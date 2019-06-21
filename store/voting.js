import { firestoreAction } from "vuexfire"
import { db } from "@/plugins/firebase"

export const state = () => ({
  votes: [],
  initialized: false
})

export const getters = {
  votes: state => state.votes
}

export const mutations = {
  addVote(state, vote) {
    state.votes.push(vote)
  },
  removeVote(state, index) {
    state.votes.splice(index, 1)
  },
  setInitialized(state, initialized) {
    state.initialized = initialized
  }
}

export const actions = {
  /**
   * Checkt ob bereits eine Bewertunf vorhanden ist
   * Ersetzt allte Bewertung mit neuer Bewertung
   * Gibt Bewertung zurück
   * @param {object} StoreContext - vuex context.
   * @param {object} roomName
   * @return {number} index
   */
  init: firestoreAction(
    async ({ commit, bindFirestoreRef, rootState, state }) => {
      if (state.initialized) {
        return
      }

      await bindFirestoreRef(
        "votes",
        db
          .collection("users")
          .doc(rootState.user.id)
          .collection("rooms")
          .doc(rootState.currentRoom.room.id)
          .collection("votes")
      )

      commit("setInitialized", true)
    }
  ),
  reset: firestoreAction(({ commit, unbindFirestoreRef }) => {
    unbindFirestoreRef("votes")
    commit("setInitialized", false)
  })
}
