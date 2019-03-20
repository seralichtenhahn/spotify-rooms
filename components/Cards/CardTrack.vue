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
      return this.vote ? this.vote.value !== "upvote" : true
    },
    canDownvote() {
      return this.vote ? this.vote.value !== "downvote" : true
    }
  },
  methods: {
    upvoteTrack() {
      this.$store.dispatch("voting/updateVote", {
        trackId: this.track.id,
        value: "upvote"
      })
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        value: 1
      })
    },
    downvoteTrack() {
      this.$store.dispatch("voting/updateVote", {
        trackId: this.track.id,
        value: "downvote"
      })
      this.$store.dispatch("currentRoom/voteTrack", {
        id: this.track.id,
        value: -1
      })
    }
  }
}
</script>
