<template>
  <li class="track--card">
    <div class="track--card--info">
      <img
        :src="track.image"
        :alt="track.title"
      >
      <div>
        <h3>{{ track.title }}</h3>
        <p class="small">{{ track.artist }}</p>
      </div>
      <p class="small">
        vor 3 min . von {{ track.user }}
      </p>
    </div>
    <div class="track--card--voting">
      <IconArrowUp
        :class="{'active': !canUpvote}"
        class=" icon icon--upvote"
        @click="upvoteTrack"
      />
      <span>{{ track.score }}</span>
      <IconArrowDown
        :class="{'active': !canDownvote}"
        class="icon icon--downvote"
        @click="downvoteTrack"
      />
    </div>
  </li>
</template>

<script>
import IconArrowUp from "@/assets/icons/arrow-up.svg"
import IconArrowDown from "@/assets/icons/arrow-down.svg"

export default {
  components: {
    IconArrowUp,
    IconArrowDown
  },
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

<style lang="scss">
.track--card {
  display: flex;
  padding: rem(24 16 8);
  border-radius: rem(5);
  margin-bottom: rem(20);
  color: $white;
  background-color: $grey-mine;

  &--info {
    display: flex;
    flex-wrap: wrap;

    img {
      flex-basis: rem(64);
      height: rem(64);
      margin-bottom: rem(6);
    }

    div {
      flex: 1 1;
      margin-left: 1em;
    }

    p {
      flex-basis: 100%;
      margin: 0;
      color: rgba($white, 0.6);
    }
  }

  &--voting {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: rem(16);

    span {
      font-weight: 600;
      font-size: rem(16);
      text-align: center;
    }

    .icon {
      width: rem(24);
      cursor: pointer;
      fill: $white;

      &.active {
        fill: $green-meadow;
      }
    }
  }
}
</style>
