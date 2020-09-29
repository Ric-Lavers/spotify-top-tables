import { Machine, assign } from "xstate"

interface TContext {
  type: "track" | "artist"
  timeRange: "short_term" | "medium_term" | "long_term"
  groupName: string
  isNewGroupModalOpen: boolean
}
interface TStateSchema {
  states: {
    intitalFetch: {}
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
//@ts-nocheck
const topTableMachine = Machine<TContext, TStateSchema, TEvent>(
  {
    id: "top-table",
    initial: "intitalFetch",
    context: {
      type: "track",
      timeRange: "short_term",
      groupName: "all",
      isNewGroupModalOpen: false,
    },
    states: {
      error: {
        type: "final",
      },
      intitalFetch: {
        on: {
          "": [{ target: "topTable" }, { target: "error", cond: () => false }],
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
          timeRange: {
            // type: "history",
            initial: "short_term",
            on: {
              SELECT_SHORT_TERM: ".short_term",
              SELECT_MEDIUM_TERM: ".medium_term",
              SELECT_LONG_TERM: ".long_term",
            },
            states: {
              short_term: {
                // type: "history",
              },
              medium_term: {
                // type: "history",
              },
              long_term: {
                // type: "history",
              },
            },
          },

          table_Type: {
            // type: "history",
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
          // SELECT_TRACK: "topTable.table_Type.trackTable",
          // SELECT_ARTIST: "topTable.table_Type.artistTable",
          // SELECT_TIME_RANGE_SHORT_TERM: "topTable.timeRange.short_term",
          // // SELECT_TIME_RANGE_MEDIUM_TERM: "topTable.timeRange.medium_term",
          // SELECT_TIME_RANGE_LONG_TERM: "topTable.timeRange.long_term",
          SET_TIME_RANGE: {
            actions: "setTimeRange",
          },
        },
      },
    },
    on: {
      OPEN_MODAL: "newGroupModal",
      CLOSE_MODAL: "topTable",
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
      // newGroupModal: assign(() => ({
      //   isNewGroupModalOpen: true,
      // })),
    },
  },
)
export default topTableMachine
