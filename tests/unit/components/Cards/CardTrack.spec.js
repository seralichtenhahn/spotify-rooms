import CardTrack from "@/components/Cards/CardTrack.vue"
import Vuex from "vuex"
import { shallowMount, createLocalVue } from "@vue/test-utils"
import { generateTrack } from "@/tests/utils"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("CardTrack", () => {
  const $store = {
    state: {
      voting: {
        votes: [
          { id: "4567890", mode: "up" },
          { id: "4512890", mode: "down" },
          { id: "4567856", mode: "up" }
        ]
      }
    }
  }

  let storeOptions
  let store
  beforeEach(() => {
    storeOptions = {
      modules: {
        voting: {
          namespaced: true,
          state: {
            votes: []
          }
        },
        currentRoom: {
          namespaced: true,
          actions: {
            voteTrack: jest.fn()
          }
        }
      }
    }

    store = new Vuex.Store(storeOptions)
  })

  it("is a Vue component", () => {
    const wrapper = shallowMount(CardTrack, {
      propsData: {
        track: generateTrack()
      },
      localVue,
      store
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it("can upvote/downvote track if no votes are set", () => {
    const wrapper = shallowMount(CardTrack, {
      propsData: {
        track: generateTrack()
      },
      localVue,
      store
    })
    expect(wrapper.vm.canUpvote).toBeTruthy()
    expect(wrapper.vm.canDownvote).toBeTruthy()
  })

  it("dispatches action when method is called", () => {
    store.dispatch = jest.fn(() => Promise.resolve())
    const track = generateTrack()
    const wrapper = shallowMount(CardTrack, {
      propsData: {
        track
      },
      localVue,
      store
    })

    wrapper.find(".icon--downvote").trigger("click")
    expect(store.dispatch).toHaveBeenCalledWith("currentRoom/voteTrack", {
      id: track.id,
      mode: "down"
    })
    wrapper.find(".icon--upvote").trigger("click")
    expect(store.dispatch).toHaveBeenCalledWith("currentRoom/voteTrack", {
      id: track.id,
      mode: "up"
    })
  })
})
