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
        :class="{'active': !canUpvote}"
        href="#"
        class="icon--upvote"
        @click.prevent="upvoteTrack"
      >
        <IconArrowUp class=" icon" />
      </a>
      <span>{{ track.score }}</span>
      <a
        :class="{'active': !canDownvote}"
        href="#"
        class="icon--downvote"
        @click.prevent="downvoteTrack"
      >
        <IconArrowDown class="icon" />
      </a>
    </div>
    <div
      v-if="isOwner"
      class="track--card--remove"
    >
      <a
        href="#"
        @click.prevent="removeTrack"
      >
        <IconCloseCircle class="icon" />
      </a>
    </div>
  </li>
</template>

<script>
import IconArrowUp from "@/assets/icons/arrow-up.svg"
import IconArrowDown from "@/assets/icons/arrow-down.svg"
import IconCloseCircle from "@/assets/icons/close-circle-outline.svg"
import dayjs from "dayjs"
import { mapGetters } from "vuex"
import firebase from "firebase/app"

export default {
  components: {
    IconArrowUp,
    IconArrowDown,
    IconCloseCircle
  },
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters("device", ["isMobile"]),
    ...mapGetters("currentRoom", ["id", "isOwner"]),
    ...mapGetters("voting", ["votes"]),
    /**
     * Gibt gespeicherte Berwetung zurück, falls vorhanden
     * @return {object} vote
     */
    trackVote() {
      return this.votes.find(vote => vote.id === this.track.id)
    },
    /**
     * Gibt zürück ob der Benutzer den Track hochwerten darf
     * @return {boolean} Nutzer darf Track hochwerten
     */
    canUpvote() {
      return this.trackVote ? this.trackVote.value === -1 : true
    },
    /**
     * Gibt zürück ob der Benutzer den Track abwerten darf
     * @return {boolean} Nutzer darf Track abwerten
     */
    canDownvote() {
      return this.trackVote ? this.trackVote.value === 1 : true
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
      if (this.canUpvote) {
        this.createVote(1, !this.canDownvote)
      }
    },
    /**
     * Führt Store Action aus um Track abzuwerten
     */
    downvoteTrack() {
      if (this.canDownvote) {
        this.createVote(-1, !this.canUpvote)
      }
    },
    async createVote(value, multiply) {
      const increment = multiply ? value * 2 : value

      try {
        this.$db
          .collection("users")
          .doc(this.$store.state.user.id)
          .collection("rooms")
          .doc(this.id)
          .collection("votes")
          .doc(this.track.id)
          .set({
            value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        this.$db
          .collection("rooms")
          .doc(this.id)
          .collection("queue")
          .doc(this.track.id)
          .update({
            score: firebase.firestore.FieldValue.increment(increment)
          })
      } catch (error) {
        this.$store.dispatch("error/create", error)
      }
    },
    /**
     * Führt Store Action aus um Track zu entfernen
     */
    async removeTrack() {
      try {
        await this.$store.dispatch("currentRoom/removeTrack", this.track)
      } catch (error) {
        this.$store.dispatch("error/create", error)
      }
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
    }

    .active {
      cursor: not-allowed;
      pointer-events: none;

      svg {
        fill: $green-meadow;
      }
    }
  }

  &--remove {
    align-self: center;
    margin-bottom: rem(16);

    .icon {
      display: block;
      width: rem(24);
      color: rgba($white, 0.4);
      cursor: pointer;
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

    &--remove {
      margin-bottom: 0;
      margin-left: rem(16);
    }
  }
}
</style>
