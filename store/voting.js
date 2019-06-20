import { firestoreAction } from "vuexfire"
import { db } from "@/plugins/firebase"

export const state = () => ({
  votes: []
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
    async ({ bindFirestoreRef, rootState, rootGetters }) => {
      if (rootGetters["currentRoom/id"]) {
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
    }
  ),
  reset: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef("votes")
  })
}
