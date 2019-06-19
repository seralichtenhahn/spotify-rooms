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
  data() {
    return {
      timeout: null
    }
  },
  computed: {
    ...mapGetters("device", ["isMobile"]),
    ...mapGetters("currentRoom", [
      "isPlaying",
      "currentTrack",
      "isOwner",
      "id",
      "playlistId"
    ]),
    playstateComponent() {
      return this.isPlaying ? "IconPause" : "IconPlay"
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(id) {
        if (this.isOwner && id) {
          this.fetchPlayback()
        }
      }
    }
  },
  mounted() {
    this.$nuxt.$on("playback:fetch", callback => {
      this.fetchPlayback().then(() => callback())
    })
  },
  methods: {
    /**
     * Spielt den zuletzt gespielten Track in der Warteschlange ab
     */
    async prevTrack() {
      await this.$spotify.skipToPrevious()

      // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
      setTimeout(() => {
        this.fetchPlayback()
      }, 250)
    },
    /*
     * Ändert den Playback Status
     */
    async changePlayState() {
      if (this.isPlaying) {
        await this.$spotify.pause()
      } else {
        await this.$spotify.play()
      }

      // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
      setTimeout(() => {
        this.fetchPlayback()
      }, 250)
    },
    /**
     * Spielt den nächsten Track in der Warteschlange ab
     */
    async nextTrack() {
      await this.$spotify.skipToNext()

      // Timeout notwendig weil Spotify den Playback Status noch nicht aktualisiert hat
      setTimeout(() => {
        this.fetchPlayback()
      }, 250)
    },
    /**
     * Holt den Playback Status des Nutzters
     * Setzt ein Timeout und führt Funktion erneut aus, wenn nächsters Track startet
     * @param {object} StoreContext - vuex context.
     */
    async fetchPlayback() {
      try {
        const playback = await this.$spotify.getMyCurrentPlaybackState()

        if (!playback) {
          return
        }

        const isPlaying = this.checkIfQueueIsPlaying(playback)

        console.log(isPlaying)

        await this.$db
          .collection("rooms")
          .doc(this.id)
          .update({
            isPlaying
          })

        if (this.isPlaying) {
          this.checkCurrentTrack(playback)

          this.timeout = null
          const timeLeft = playback.item.duration_ms - playback.progress_ms

          this.timeout = setTimeout(() => {
            this.fetchPlayback()
          }, timeLeft)
        }
      } catch (error) {
        this.$store.dispatch("error/create", error, { root: true })
      }
    },
    /**
     * Checkt ob Nutzer gerade die Warteschlange am spielen ist.
     * Aktualisiert die Datenbank
     * @param {object} StoreContext - vuex context.
     * @param {object} playback
     */
    checkIfQueueIsPlaying(playback) {
      if (!playback.is_playing) {
        return false
      }

      if (playback.context && playback.context.uri.includes(this.playlistId)) {
        return true
      }

      console.log(this.playlistId, playback.context.uri)

      return false
    },
    /**
     * Speichert aktuell laufenden Track in der Datenbank
     * @param {object} StoreContext - vuex context.
     * @param {object} playback
     */
    checkCurrentTrack({ item }) {
      if (!item) {
        return
      }

      this.$db
        .collection("rooms")
        .doc(this.id)
        .update({
          currentTrack: {
            title: item.name,
            artist: item.artists.map(artist => artist.name).join(", "),
            image: item.album.images.find(image => image.height === 300).url
          }
        })
    }
  }
}
</script>

<style lang="scss">
.stripe--room-info {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: rem($stripe--room-height-mobile);
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
    height: rem($stripe--room-height);
  }

  > p {
    width: 100%;
    text-align: center;
  }

  @include breakpoint(medium) {
    height: rem($stripe--room-height);

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
  padding-bottom: rem($stripe--room-height-mobile);

  @include breakpoint(medium) {
    padding-bottom: rem($stripe--room-height);
  }
}
</style>
