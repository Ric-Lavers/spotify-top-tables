//@ts-nocheck
import { Machine, assign } from "xstate"
import {
  UsersTopArtistsResponse,
  UsersTopTracksResponse,
} from "types/spotify-api"
import { getTopTracks } from "services/me/top/tracks"

interface TContext {
  type: "track" | "artist"
  timeRange: "short_term" | "medium_term" | "long_term"
  groupName: string
  isNewGroupModalOpen: boolean
  tracks: UsersTopTracksResponse | null
}
interface TStateSchema {
  states: {
    intitalFetch: {
      invoke: {
        id: string
        src: string
        onDone: {
          target: string
          actions: string
        }
        onError: {
          actions?: string
          target: string
        }
      }
    }
    topTable: {
      type: "parallel"
      states: {
        timeRange: {
          states: {
            short_term: {}
            medium_term: {}
            long_term: {}
          }
        }
        table_Type: {
          states: {
            trackTable: {}
            artistTable: {}
          }
        }
      }
    }
    newGroupModal: {
      /*   states: {
        loading: {}
      } */
    }
    error: {}
  }
}
type TEvent =
  | { type: "" }
  | { type: "NEW_GROUP" }
  | { type: "SELECT_TRACK" }
  | { type: "SELECT_ARTIST" }
  // | { type: "SELECT_TIME_RANGE_SHORT_TERM" }
  // | { type: "SELECT_TIME_RANGE_MEDIUM_TERM" }
  // | { type: "SELECT_TIME_RANGE_LONG_TERM" }
  | { type: "SUBMIT_NEW_GROUP" }
  | { type: string }
  | { type: "SET_TIME_RANGE"; range: Pick<TContext, "timeRange"> }

const topTableMachine = Machine<TContext, TStateSchema, TEvent>(
  {
    id: "top-table",
    initial: "intitalFetch",
    context: {
      type: "track",
      timeRange: "short_term",
      groupName: "all",
      isNewGroupModalOpen: false,
      tracks: null,
    },
    states: {
      error: {
        type: "final",
      },

      intitalFetch: {
        invoke: {
          id: "intialFetch",
          src: "invokeInitialTrackTable",
          onDone: {
            target: "topTable",
            actions: ["setTracks"],
          },
          onError: {
            target: "error",
          },
        },
      },

      newGroupModal: {
        /* 
        states: {  
          loading: {
          exit: "setGroupName",
            on: {
              "": {
                target: "topTable",
              },
            },
          },
        },
        on: {
          SUBMIT_NEW_GROUP: {
            actions: "",
          },
     
        }, */
      },

      topTable: {
        type: "parallel",
        states: {
          hist: {
            type: "history",
            history: "deep",
          },
          timeRange: {
            initial: "short_term",
            on: {
              SELECT_SHORT_TERM: ".short_term",
              SELECT_MEDIUM_TERM: ".medium_term",
              SELECT_LONG_TERM: ".long_term",
            },
            states: {
              short_term: {},
              medium_term: {
                states: {
                  check: {},
                  idle: {},
                },
              },
              long_term: {},
            },
          },

          table_Type: {
            initial: "trackTable",
            on: {
              SELECT_TRACK: ".trackTable",
              SELECT_ARTIST: ".artistTable",
            },
            states: {
              trackTable: {},
              artistTable: {},
            },
          },
        },
        on: {
          SET_TIME_RANGE: {
            actions: "setTimeRange",
          },
        },
      },
    },
    on: {
      OPEN_MODAL: "newGroupModal",
      CLOSE_MODAL: "topTable.hist",
      // NEW_GROUP: "newGroupModal",
    },
  },
  {
    actions: {
      //@ts-ignore
      setTimeRange: assign((ctx, { range }) => {
        return { timeRange: range }
      }),
      setGroupName: console.log,
      newGroupModal: console.log,
      //@ts-ignore
      setTracks: assign((ctx, { data }) => ({ tracks: data })),
      //@ts-ignore
      // newGroupModal: assign(() => ({
      //   isNewGroupModalOpen: true,
      // })),
    },
    services: {
      invokeInitialTrackTable: ({ timeRange }, event) => {
        console.log(event)

        return getTopTracks({ time_range: timeRange })
      },
    },
  },
)
export default topTableMachine
