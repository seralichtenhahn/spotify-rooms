import firebase from "firebase/app"
import differenceWith from "lodash/differenceWith"

export const state = () => ({
  id: "",
  title: "",
  owner: "",
  playlistId: "",
  queue: [],
  isPlaying: false,
  currentTrack: null,
  hydrated: false,
  listeners: [],
  timeout: null
})

export const getters = {
  id: state => state.id,
  title: state => state.title,
  owner: state => state.owner,
  playlistId: state => state.playlistId,
  isOwner: (state, _getters, rootState) => state.owner === rootState.user.id,
  queue: state => state.queue,
  isPlaying: state => state.isPlaying,
  currentTrack: state => state.currentTrack
}

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setTitle(state, title) {
    state.title = title
  },
  setOwner(state, owner) {
    state.owner = owner
  },
  setPlaylistId(state, playlistId) {
    state.playlistId = playlistId
  },
  setQueue(state, queue) {
    state.queue = queue
  },
  setIsPlaying(state, isPlaying) {
    state.isPlaying = isPlaying
  },
  setCurrentTrack(state, currentTrack) {
    state.currentTrack = currentTrack
  },
  setHydrated(state, hydrated) {
    state.hydrated = hydrated
  },
  addListener(state, listener) {
    state.listeners.push(listener)
  },
  addTimeout(state, timeout) {
    state.timeout = timeout
  },
  removeTimeout(state) {
    clearTimeout(state.timeout)
  },
  resetState(state) {
    state.id = ""
    state.title = ""
    state.queue = []
    state.isPlaying = false
    state.currentTrack = null
    state.hydrated = false
    state.listeners = []
    state.timeout = null
  }
}

export const actions = {
  /**
   * initialisiert den betrettenen Raum für den Nutzer
   * Erstellte alle Hörer um Änderungen in Echtzeit zu erhalten
   * Gibt die Raum Daten zurück
   * @param {object} StoreContext - vuex context.
   * @param {string} roomID
   * @return {promise}
   */
  async init({ commit, getters, dispatch, state }, id) {
    // Raum wurde bereits initialisiert
    if (state.id) {
      return
    }

    const room = await this.$db.collection("rooms").doc(id)
    const roomSnapshot = await room.get()

    if (!roomSnapshot.exists) {
      throw new Error("Raum existiert nicht")
    }
    commit("setId", room.id)

    const roomData = roomSnapshot.data()
    commit("setTitle", roomData.title)
    commit("setOwner", roomData.owner)

    if (getters.isOwner) {
      commit("setPlaylistId", roomData.playlistId)
      dispatch("fetchPlayback")
    }

    // Wird bei Änderungen der Raumdaten ausgeführt
    const roomListener = room.onSnapshot(async snapshot => {
      const { isPlaying, currentTrack } = snapshot.data()

      commit("setIsPlaying", isPlaying)
      commit("setCurrentTrack", currentTrack)
    })

    // // Listener wird gespeichert damit er beim verlassen des Raumes wieder entfrent werden kann
    commit("addListener", roomListener)

    // Wird bei Änderungen der Warteschlange ausgeführt
    const queueListener = room
      .collection("queue")
      .onSnapshot(async snapshot => {
        const queue = await snapshot.query
          .orderBy("score", "desc")
          .orderBy("createdAt")
          .get()
        const queueData = queue.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Überprüft ob neue Tracks vorhanden sind
        if (getters.isOwner && state.hydrated) {
          const newTracks = differenceWith(
            queueData,
            getters.queue,
            (newTrack, oldTrack) => {
              return newTrack.id === oldTrack.id
            }
          )

          // Speichert neue Tracks in der Playlist
          if (newTracks.length) {
            const uris = newTracks.map(track => track.uri)
            const index = queueData.findIndex(track => track.score === -1)
            const position = index > -1 ? index - 1 : queueData.length - 1
            this.$spotify.addTracksToPlaylist(state.playlistId, uris, {
              position
            })
          }

          // Überprüft ob Tracks neue Reihenfolge haben
          const updatedTracks = getters.queue.filter(track => {
            const newTrack = queueData.find(_track => _track.id === track.id)
            return newTrack ? newTrack.score !== track.score : false
          })

          // Neue Position wird bestimmt
          updatedTracks.forEach(track => {
            const findTrack = _track => _track.id === track.id
            const position = getters.queue.findIndex(findTrack)
            const newPosition = queueData.findIndex(findTrack)
            if (position !== newPosition) {
              this.$spotify.reorderTracksInPlaylist(
                state.playlistId,
                position,
                newPosition
              )
            }
          })
        }

        commit("setQueue", queueData)
        commit("setHydrated", true)
      })

    // Event Listener wird gesetzt um Status des Raums abzufragen
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange.bind(this)
    )

    commit("addListener", queueListener)

    return roomData
  },
  /**
   * Fügt einen neuen Track der Datenbank hinzu
   * @param {object} StoreContext - vuex context.
   * @param {object} trackData
   */
  async addTrack({ state, rootState }, trackData) {
    await this.$db
      .collection("rooms")
      .doc(state.id)
      .collection("queue")
      .add({
        ...trackData,
        user: rootState.user.username,
        score: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  },
  /**
   * Entfernt einen Track aus der Playlist und der Warteschlange
   * @param {object} StoreContext - vuex context.
   * @param {object} Track
   */
  async removeTrack({ state }, track) {
    const position = state.queue.findIndex(_track => _track.id === track.id)
    await this.$spotify.removeTracksFromPlaylist(state.playlistId, [
      {
        uri: track.uri,
        positions: [position]
      }
    ])
    await this.$db
      .collection("rooms")
      .doc(state.id)
      .collection("queue")
      .doc(track.id)
      .delete()
  },
  /**
   * Bewertet einen Track und speichert den Score des Track in der Datenbank
   * @param {object} StoreContext - vuex context.
   * @param {object} VoteData
   */
  async voteTrack({ state, dispatch }, { id, mode }) {
    const track = state.queue.find(track => track.id === id)

    const index = await dispatch(
      "voting/updateVote",
      {
        trackId: id,
        mode
      },
      { root: true }
    )

    // Setzt Value jenachdem ob "up" oder "down"
    let value = mode === "up" ? 1 : -1

    // Falls bereits eine Bewertung vorhanden ist wird die alte überschrieben
    if (index > -1) {
      value = value * 2
    }

    await this.$db
      .collection("rooms")
      .doc(state.id)
      .collection("queue")
      .doc(id)
      .update({
        score: track.score + value
      })
  },
  /**
   * Deaktiviert die Zufallswiedergabe und Startet die Warteschlange
   * @param {object} StoreContext - vuex context.
   */
  async start({ rootState, state }) {
    await this.$spotify.setShuffle(false, {
      device_id: rootState.user.device
    })
    await this.$spotify.play({
      device_id: rootState.user.device,
      context_uri: `spotify:playlist:${state.playlistId}`
    })
  },
  /**
   * Holt den Playback Status des Nutzters
   * Setzt ein Timeout und führt Funktion erneut aus, wenn nächsters Track startet
   * @param {object} StoreContext - vuex context.
   */
  async fetchPlayback({ dispatch, commit, state }) {
    try {
      const playback = await this.$spotify.getMyCurrentPlaybackState()

      await dispatch("checkIfQueueIsPlaying", playback)

      if (state.isPlaying) {
        dispatch("checkCurrentTrack", playback)

        commit("removeTimeout")
        const timeLeft = playback.item.duration_ms - playback.progress_ms
        const timeout = setTimeout(() => {
          dispatch("fetchPlayback")
        }, timeLeft)
        commit("addTimeout", timeout)
      }
    } catch (error) {
      dispatch("error/create", error, { root: true })
    }
  },
  /**
   * Checkt ob Nutzer gerade die Warteschlange am spielen ist.
   * Aktualisiert die Datenbank
   * @param {object} StoreContext - vuex context.
   * @param {object} playback
   */
  async checkIfQueueIsPlaying({ state, commit }, playback) {
    const isPlaying =
      playback.is_playing && playback.context.uri.includes(state.playlistId)
    commit("setIsPlaying", isPlaying)
    await this.$db
      .collection("rooms")
      .doc(state.id)
      .update({
        isPlaying
      })
  },
  /**
   * Speichert aktuell laufenden Track in der Datenbank
   * @param {object} StoreContext - vuex context.
   * @param {object} playback
   */
  checkCurrentTrack({ state }, { item }) {
    if (!item) {
      return
    }

    this.$db
      .collection("rooms")
      .doc(state.id)
      .update({
        currentTrack: {
          title: item.name,
          artist: item.artists.map(artist => artist.name).join(", "),
          image: item.album.images.find(image => image.height === 300).url
        }
      })
  },
  /**
   * Spielt den zuletzt gespielten Track in der Warteschlange ab
   * @param {object} StoreContext - vuex context.
   */
  async prevTrack({ dispatch }) {
    await this.$spotify.skipToPrevious()

    // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 250)
  },
  /**
   * Spielt den nächsten Track in der Warteschlange ab
   * @param {object} StoreContext - vuex context.
   */
  async nextTrack({ dispatch }) {
    await this.$spotify.skipToNext()

    // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 250)
  },
  /**
   * Ändern den Playback Status
   * @param {object} StoreContext - vuex context.
   */
  async changePlayState({ dispatch, state }) {
    if (state.isPlaying) {
      await this.$spotify.pause()
    } else {
      await this.$spotify.play()
    }

    // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 250)
  },
  /**
   * Setzt den aktuellen Raum zurück
   * @param {object} StoreContext - vuex context.
   */
  reset({ commit, getters, state }) {
    if (getters.isOwner) {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
    state.listeners.forEach(listener => listener())
    commit("resetState")
  }
}

function handleVisibilityChange() {
  if (!document.hidden) {
    this.dispatch("currentRoom/fetchPlayback")
  }
}
