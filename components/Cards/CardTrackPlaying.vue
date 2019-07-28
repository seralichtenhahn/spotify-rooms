<template>
  <li class="track--card-playing">
    <div class="track--card-playing--info">
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
  </li>
</template>

<script>
import dayjs from "dayjs"
import { mapGetters } from "vuex"

export default {
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters("device", ["isMobile"]),
    createdAt() {
      return this.track.createdAt
        ? dayjs.unix(this.track.createdAt.seconds).fromNow()
        : null
    }
  }
}
</script>

<style lang="scss">
.track--card-playing {
  display: flex;
  padding: rem(24 16 8);
  border-radius: rem(5);
  border-bottom: rem(5) solid $green-spotify;
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
  }
}
</style>
