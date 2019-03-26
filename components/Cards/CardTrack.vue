<template>
  <li class="track--card">
    <div class="track--card--info">
      <template v-if="isMobile">
        <img
          :src="track.image"
          :alt="track.title"
        >
        <div>
          <h3>{{ track.title }}</h3>
          <p class="small">{{ track.artist }}</p>
        </div>
        <p class="small">
          {{ createdAt }} • von {{ track.user }}
        </p>
      </template>
      <template v-else>
        <img
          :src="track.image"
          :alt="track.title"
        >
        <div>
          <p>
            {{ track.artist }}
            <span>{{ track.title }}</span>
          </p>
          <p>
            eingereicht von
            <span>{{ track.user }}</span>
          </p>
          <p>
            vor
            <span>{{ createdAt }}</span>
          </p>
        </div>
      </template>  
    </div>
    <div class="track--card--voting">
      <a
        href="#"
        class="icon--upvote"
        @click.prevent="upvoteTrack"
      >
        <IconArrowUp
          :class="{'active': !canUpvote}"
          class=" icon"
        />
      </a>
      <span>{{ track.score }}</span>
      <a
        href="#"
        class="icon--downvote"
        @click.prevent="downvoteTrack"
      >
        <IconArrowDown
          :class="{'active': !canDownvote}"
          class="icon"
        />
      </a>
    </div>
  </li>
</template>

<script>
import IconArrowUp from "@/assets/icons/arrow-up.svg"
import IconArrowDown from "@/assets/icons/arrow-down.svg"
import dayjs from "dayjs"
import { mapGetters } from "vuex"

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
    ...mapGetters("device", ["isMobile"]),
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
    },
    createdAt() {
      return this.track.createdAt
        ? dayjs.unix(this.track.createdAt.seconds).fromNow()
        : null
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
      display: block;
      width: rem(24);
      cursor: pointer;
      fill: $white;

      &.active {
        fill: $green-meadow;
      }
    }
  }

  @include breakpoint(medium) {
    justify-content: space-between;
    padding: rem(16);

    &--info {
      flex: 1 1;
      flex-wrap: nowrap;

      img {
        margin: 0;
      }

      div {
        display: flex;
        align-items: center;

        p {
          padding: 0;
          font-size: rem(12);
        }

        span {
          @include headline--lvl3;
        }
      }
    }

    &--voting {
      margin: 0;
    }
  }
}
</style>
