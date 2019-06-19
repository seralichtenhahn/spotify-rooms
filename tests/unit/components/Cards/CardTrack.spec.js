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
          { id: "4567890", value: 1 },
          { id: "4512890", value: -1 },
          { id: "4567856", value: 1 }
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
          },
          getters: {
            votes: state => state.votes
          }
        },
        currentRoom: {
          namespaced: true,
          getters: {
            isOwner: () => false
          }
        },
        device: {
          namespaced: true,
          getters: {
            isMobile: () => false
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

  it("create Vote when method is called", () => {
    const track = generateTrack()
    const wrapper = shallowMount(CardTrack, {
      propsData: {
        track
      },
      localVue,
      store
    })

    wrapper.vm.createVote = jest.fn(() => Promise.resolve())

    wrapper.find(".icon--downvote").trigger("click")
    expect(wrapper.vm.createVote).toHaveBeenCalledWith(-1, false)

    wrapper.find(".icon--upvote").trigger("click")
    expect(wrapper.vm.createVote).toHaveBeenCalledWith(1, false)
  })
})
