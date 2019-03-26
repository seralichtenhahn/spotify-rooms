<template>
  <li>
    <strong>{{ track.title }}</strong> by {{ track.artist }}
    <br>
    eingereicht von <i>{{ track.user }}</i>
    <br>
    <div>
      <button
        :disabled="!canUpvote"
        class="button--upvote"
        @click="upvoteTrack"
      >
        up
      </button>
      <span>{{ track.score }}</span>
      <button
        :disabled="!canDownvote"
        class="button--downvote"
        @click="downvoteTrack"
      >
        down
      </button>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    /**
     * Gibt gespeicherte Berwetung zurück, falls vorhanden
     * @return {object} vote
     */
    vote() {
      return this.$store.state.voting.votes.find(
        vote => vote.trackId === this.track.id
      )
    },
    /**
     * Gibt zürück ob der Benutzer den Track hochwerten darf
     * @return {boolean} Nutzer darf Track hochwerten
     */
    canUpvote() {
      return this.vote ? this.vote.mode !== "up" : true
    },
    /**
     * Gibt zürück ob der Benutzer den Track abwerten darf
     * @return {boolean} Nutzer darf Track abwerten
     */
    canDownvote() {
      return this.vote ? this.vote.value !== "down" : true
    }
  },
  methods: {
    /**
     * Führt Store Action aus um Track hochzuwerten
     */
    upvoteTrack() {
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        mode: "up"
      })
    },
    /**
     * Führt Store Action aus um Track abzuwerten
     */
    downvoteTrack() {
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        mode: "down"
      })
    }
  }
}
</script>
