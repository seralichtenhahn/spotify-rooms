<template>
  <div class="room-overview--page">
    <div class="topbar">
      <div class="topbar--item left">
        <a
          href="#"
          @click.prevent="leaveRoom"
        >
          <IconArrowBack class="icon" />
        </a>
      </div>
      <div
        v-if="isMobile"
        class="topbar--item right"
      >
        <nuxt-link
          :to="{ name: 'rooms-id-add' }"
        >
          <IconAddCircle class="icon" />
        </nuxt-link>
      </div>
    </div>
    <div class="room-overview--page--header">
      <div class="row--outer">
        <h1>{{ title }}</h1>
        <h2 class="subtitle">von <span>{{ owner }}</span></h2>
      </div>
    </div>
    <div class="room-overview--page--queue">
      <div class="row--outer">
        <div class="room-overview--page--queue--header">
          <h3>Warteschlange</h3>
          <div>
            <button
              v-if="isOwner"
              class="button--primary"
              @click="toggleQueue"
            >
              <span v-if="!isMobile">Warteschlange</span> {{ toggleQueueState }}
            </button>
            <template v-if="!isMobile">
              <nuxt-link
                :to="{ name: 'rooms-id-add' }"
                class="button"
              >
                Track hinzufügen
              </nuxt-link>
            </template>
          </div>
        </div>
        <Queue v-slot="{ queue, playing }">
          <CardTrackPlaying
            v-if="playing"
            :track="playing"
          />
          <template v-if="queue.length">
            <CardTrack
              v-for="(track, index) in queue"
              :key="index"
              :track="track"
            />
          </template>
          <CardTrackPlaceholder
            v-else
            @placeholder-click="placeholderClick"
          />
        </Queue>
      </div>
    </div>
    <portal
      v-if="showFormStartQueue"
      to="modal"
    >
      <FormStartQueue />
    </portal>
    <portal
      v-if="showFormResetQueue"
      to="modal"
    >
      <FormResetQueue />
    </portal>
  </div>
</template>

<script>
import CardTrack from "@/components/Cards/CardTrack"
import CardTrackPlaying from "@/components/Cards/CardTrackPlaying"
import FormStartQueue from "@/components/Forms/FormStartQueue"
import FormResetQueue from "@/components/Forms/FormResetQueue"
import Queue from "@/components/Queue/Queue"
import { mapGetters } from "vuex"
import IconArrowBack from "@/assets/icons/arrow-back.svg"
import IconAddCircle from "@/assets/icons/add-circle-outline.svg"
import CardTrackPlaceholder from "@/components/Cards/CardTrackPlaceholder"

export default {
  components: {
    CardTrack,
    CardTrackPlaying,
    CardTrackPlaceholder,
    FormStartQueue,
    FormResetQueue,
    Queue,
    IconArrowBack,
    IconAddCircle
  },
  /**
   * Führt Action currentRoom/init mit der Raum Id aus
   * Gibt Raumdaten zurück
   * Falls Raum nicht gefunden wird, wird der Nutzter zur 404 Seite weitergeleitet
   * @param {object} NuxtContext - https://nuxtjs.org/api/context/
   * @return {object} Room
   */
  async asyncData({ params, error, store }) {
    try {
      await store.dispatch("currentRoom/init", params.id)
      await store.dispatch("voting/init")

      const { title, owner } = store.state.currentRoom.room

      return {
        title,
        owner
      }
    } catch ({ message }) {
      error({
        statusCode: 404,
        message
      })
    }
  },
  data() {
    return {
      showFormStartQueue: false,
      showFormResetQueue: false
    }
  },
  computed: {
    ...mapGetters("currentRoom", ["isOwner", "currentTrack"]),
    ...mapGetters("device", ["isMobile"]),
    toggleQueueState() {
      return this.currentTrack ? "neustarten" : "starten"
    }
  },
  methods: {
    /**
     * Führt Action currentRoom/reset aus
     * Leiter Nutzer zur Introseite weiter
     */
    leaveRoom() {
      this.$store.dispatch("currentRoom/reset")
      this.$store.dispatch("voting/reset")
      this.$router.push("/rooms")
    },
    /**
     * Setzt showDeviceList auf true
     * Ruft Event auf um Modal zu aktivieren mit dem Titel "Warteschlange starten"
     */
    toggleQueue() {
      // if (this.currentTrack) {
      //   this.showFormResetQueue = true
      // } else {
      //   this.showFormStartQueue = true
      // }

      // this.$nuxt.$emit(
      //   "modal:activate",
      //   `Warteschlange ${this.toggleQueueState}`
      // )
      this.$nuxt.$emit("playback:resume")
    },
    placeholderClick() {
      this.$router.push({ name: "rooms-id-add" })
    }
  },
  transition(to, from) {
    if (!from) return null

    const transitions = {
      "rooms-id-add": "slide-right",
      rooms: "slide-left"
    }

    return transitions[from.name] || null
  }
}
</script>

<style lang="scss">
$room-overview--page--header-height: rem(320);
$room-overview--page--header-height-mobile: rem(160);

.room-overview--page {
  &--header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $room-overview--page--header-height-mobile;
    text-align: center;
    background: $header-gradient;

    .row--outer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    h1 {
      padding: 0;
      margin: 0;
    }
  }

  &--queue {
    padding-top: rh(1);
    background-color: $grey-cod;
    transform: translateY($room-overview--page--header-height-mobile);

    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    ul {
      padding-bottom: rem($stripe--room-height-mobile) + rem(20);
      margin: 0;
      margin-top: rh(1);
      list-style: none;
    }
  }

  @include breakpoint(medium) {
    &--header {
      height: $room-overview--page--header-height + rem(10);
      text-align: left;
    }

    &--queue {
      padding-top: rem(12);
      transform: translateY($room-overview--page--header-height);

      ul {
        padding-bottom: rem($stripe--room-height) + rem(20);
        margin-top: 0;
      }
    }
  }
}
</style>
