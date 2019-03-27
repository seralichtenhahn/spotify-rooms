<template>
  <div
    v-if="id"
    :class="{ 'owner': isOwner }"
    class="stripe--room-info"
  >
    <div class="row--outer">
      <div class="stripe--room-info--item">
        <template v-if="!isMobile && currentTrack">
          <img
            :src="currentTrack.image"
            :alt="currentTrack.title"
          >
          <div>
            <h3>{{ currentTrack.title }}</h3>
            <p class="small muted">{{ currentTrack.artist }}</p>
          </div>
        </template>
      </div>
      <div class="stripe--room-info--item">
        <div
          v-if="isMobile"
          class="playstate"
        >
          <template v-if="currentTrack">
            <h3>{{ currentTrack.title }}</h3>
            <p class="small muted">{{ currentTrack.artist }}</p>
          </template>
          <template v-else>
            <h3 class="muted">Warteschlange noch nicht gestartet</h3>
          </template>
        </div>
        <div
          v-if="isOwner"
          class="controls"
        >
          <a
            href="#"
            @click.prevent="prevTrack"
          >
            <IconSkipBackwards class="icon" />
          </a>
          <a
            href="#"
            @click.prevent="changePlayState"
          >
            <component
              :is="playstateComponent"
              class="icon"
            />
          </a>
          <a
            href="#"
            @click.prevent="nextTrack"
          >
            <IconSkipForward class="icon" />
          </a>
        </div>
      </div>
      <div class="stripe--room-info--item">
        <div
          :class="{ 'active': isPlaying }"
          class="equalizer"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="stripe--room-info"
  >
    <p class="muted">
      Keinem Raum beigetreten 
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import IconSkipBackwards from "@/assets/icons/skip-backward.svg"
import IconPlay from "@/assets/icons/play.svg"
import IconPause from "@/assets/icons/pause.svg"
import IconSkipForward from "@/assets/icons/skip-forward.svg"

export default {
  components: {
    IconSkipBackwards,
    IconPlay,
    IconPause,
    IconSkipForward
  },
  computed: {
    ...mapGetters("device", ["isMobile"]),
    ...mapGetters("currentRoom", [
      "isPlaying",
      "currentTrack",
      "isOwner",
      "id"
    ]),
    playstateComponent() {
      return this.isPlaying ? "IconPause" : "IconPlay"
    }
  },
  methods: {
    /*
     * Führt Actions aus zum starten des letzten Tracks in der Wartesclange
     */
    prevTrack() {
      this.$store.dispatch("currentRoom/prevTrack")
    },
    /*
     * Führt Actions aus zum ändern des Play Status
     */
    changePlayState() {
      this.$store.dispatch("currentRoom/changePlayState")
    },
    /*
     * Führt Actions aus zum starten des nächsten Tracks in der Wartesclange
     */
    nextTrack() {
      this.$store.dispatch("currentRoom/nextTrack")
    }
  }
}
</script>

<style lang="scss">
$stripe--room-height: rem(80);
$stripe--room-height-mobile: rem(60);

.stripe--room-info {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: $stripe--room-height-mobile;
  padding: rem(10 0);
  background-color: $grey-mine;
  box-shadow: rem(0 0 21 0) rgba($black, 0.45);

  &--item {
    min-width: rem(24);

    p,
    h3 {
      padding: 0;
      margin: 0;
    }

    .playstate {
      text-align: center;
    }

    .controls {
      display: flex;
      justify-content: center;

      .icon {
        width: rem(24);
        height: rem(24);
        margin: 0 rem(5);
        fill: $white;
      }
    }

    &:nth-child(2) {
      flex: 2 2;
    }

    &:nth-child(3) {
      position: relative;
      height: 100%;
    }
  }

  .row--outer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &.owner {
    height: $stripe--room-height;
  }

  > p {
    width: 100%;
    text-align: center;
  }

  @include breakpoint(medium) {
    height: $stripe--room-height;

    &--item {
      img {
        width: rem(48);
        height: rem(48);
        margin: 0;
      }

      &:nth-child(1) {
        flex: 2 2;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        div {
          margin-left: rem(16);
        }

        p {
          font-size: rem(12);
        }
      }

      &:nth-child(2) {
        flex: 1 1;
        display: flex;
        justify-content: center;
      }

      &:nth-child(3) {
        flex: 2 2;
        display: flex;
      }
    }
  }
}

.app--layout {
  padding-bottom: $stripe--room-height-mobile;

  @include breakpoint(medium) {
    padding-bottom: $stripe--room-height;
  }
}
</style>
