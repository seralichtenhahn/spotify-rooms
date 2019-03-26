<template>
  <div class="room-overview--page">
    <div class="topbar">
      <div class="topbar--item left">
        <IconArrowBack
          class="icon"
          @click="leaveRoom"
        />
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
          <div v-if="!isMobile">
            <button
              v-if="isOwner"
              class="button--primary"
            >
              Warteschlange starten
            </button>
            <nuxt-link
              :to="{ name: 'rooms-id-add' }"
              class="button"
            >
              Track hinzufügen
            </nuxt-link>
          </div>
        </div>
        <ul>
          <CardTrack
            v-for="(track, index) in queue"
            :key="index"
            :track="track"
          />
        </ul>
      </div>
    </div>
    <!-- <div>
      <nuxt-link
        :to="{ name: 'rooms-id-add' }"
        class="button"
      >
        Add Track
      </nuxt-link>
      <button
        v-if="isOwner"
        @click="setDevice"
      >
        Start Queue
      </button>
    </div> -->
    <portal
      v-if="showDeviceList"
      to="modal"
    >
      <FormDeviceList />
    </portal>
  </div>
</template>

<script>
import CardTrack from "@/components/Cards/CardTrack"
import FormDeviceList from "@/components/Forms/FormDeviceList"
import { mapGetters } from "vuex"
import IconArrowBack from "@/assets/icons/arrow-back.svg"
import IconAddCircle from "@/assets/icons/add-circle-outline.svg"

export default {
  components: {
    CardTrack,
    FormDeviceList,
    IconArrowBack,
    IconAddCircle
  },
  /**
   * Führt Action currentRoom/init mit der Raum Id aus
   * Gibt Raumdaten zurück
   * Falls Raum nicht gefunden wird, wird der Nutzter zur 404 Seiter weitergeleitet
   * @param {object} NuxtContext - https://nuxtjs.org/api/context/
   * @return {object} Room
   */
  async asyncData({ params, error, store }) {
    try {
      const room = await store.dispatch("currentRoom/init", params.id)

      return room
    } catch ({ message }) {
      error({
        statusCode: 404,
        message
      })
    }
  },
  data() {
    return {
      showDeviceList: false
    }
  },
  computed: {
    ...mapGetters("currentRoom", ["queue", "isOwner"]),
    ...mapGetters("device", ["isMobile"])
  },
  methods: {
    /**
     * Führt Action currentRoom/reset aus
     * Leiter Nutzer zur Introseite weiter
     */
    leaveRoom() {
      this.$store.dispatch("currentRoom/reset")
      this.$router.push("/rooms")
    },
    /**
     * Setzt showDeviceList auf true
     * Ruft Event auf um Modal zu aktivieren mit dem Titel "Wähle dein aktives Gerät"
     */
    setDevice() {
      this.showDeviceList = true
      this.$nuxt.$emit("modal:activate", "Wähle dein aktives Gerät")
    }
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

    ul {
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

      &--header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      ul {
        margin-top: 0;
      }
    }
  }
}
</style>
