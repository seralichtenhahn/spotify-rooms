<template>
  <li>
    <strong>{{ track.title }}</strong> by {{ track.artist }}
    <br>
    eingereicht von <i>{{ track.user }}</i>
    <br>
    <div>
      <button
        :disabled="!canUpvote"
        @click="upvoteTrack"
      >
        up
      </button>
      <span>{{ track.score }}</span>
      <button
        :disabled="!canDownvote"
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
      default: () => ({}),
      required: true
    }
  },
  computed: {
    vote() {
      return this.$store.state.voting.votes.find(
        vote => vote.trackId === this.track.id
      )
    },
    canUpvote() {
      return this.vote ? this.vote.mode !== "up" : true
    },
    canDownvote() {
      return this.vote ? this.vote.value !== "down" : true
    }
  },
  methods: {
    upvoteTrack() {
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        mode: "up"
      })
    },
    downvoteTrack() {
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        mode: "down"
      })
    }
  }
}
</script>
