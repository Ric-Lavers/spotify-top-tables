//@ts-nocheck
import { Machine, assign } from "xstate"
import {
  UsersTopArtistsResponse,
  UsersTopTracksResponse,
  ArtistObjectFull,
  TrackObjectFull,
} from "types/spotify-api"
import { getAllTop } from "services/me/top/all"
import { getTopTracks } from "services/me/top/tracks"
import { getTopArtists } from "services/me/top/artists"
import { getCurrentUsersGroups } from "services/me/groups"
import { getGroupById } from "services/group/getGroupById"
import { reduceGenres } from "utils"

const getTopData = ({ type, time_range }) => {
  return type === "artist"
    ? getTopArtists({ time_range })
    : getTopTracks({ time_range })
}
export interface TopData {
  track_short_term: TrackObjectFull | null
  track_medium_term: TrackObjectFull | null
  track_long_term: TrackObjectFull | null

  artist_short_term: ArtistObjectFull | null
  artist_medium_term: ArtistObjectFull | null
  artist_long_term: ArtistObjectFull | null
}
export interface TContext {
  type: "track" | "artist"
  time_range: "short_term" | "medium_term" | "long_term"
  selectedGroupId: string
  selectedGroupMembers: { display_name: string; _id: string }[]
  groupList: { _id: string; id: string; name: string }[]
  isNewGroupModalOpen: boolean
  topData: TopData
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
      states: {
        trackTable: {}
        artistTable: {}
        hist: {}
      }
    }
    newGroupModal: {}
    error: {}
  }
}
type TEvent =
  | { type: "" }
  | { type: "NEW_GROUP" }
  | { type: "SELECT_GROUP"; id: string }
  | { type: "SELECT_TRACK" }
  | { type: "SELECT_ARTIST" }
  | { type: string }
  | { type: "SET_TIME_RANGE"; time_range: Pick<TContext, "time_range"> }

//@ts-ignore
const topTableMachine = Machine<TContext, TStateSchema, TEvent>(
  {
    id: "top-table",
    initial: "initalise",
    context: {
      type: "track",
      time_range: "short_term",
      selectedGroupId: "",
      groupList: [],
      isNewGroupModalOpen: false,
      topData: {
        track_short_term: null,
        track_medium_term: null,
        track_long_term: null,
        artist_short_term: null,
        artist_medium_term: null,
        artist_long_term: null,
      },
    },
    states: {
      error: {},
      initalise: {
        invoke: {
          src: "invokeInit",
          onDone: {
            target: "topTable",
            actions: ["setInitialData"],
          },
          onError: {
            actions: (_, e) => console.log(e),
            target: "#top-table.error",
          },
        },
      },

      newGroupModal: {
        states: {
          entering: {},
          loading: {
            invoke: {
              id: "addNewGroup",
              src: "invokeGetTopData",
              onDone: {
                target: "#top-table.topTable.trackTable.display",
                actions: ["setTopData"],
              },
              onError: {
                actions: (_, e) => console.log(e),
                target: "#top-table.error",
              },
            },
          },
          complete: {},
        },
      },
      topTable: {
        initial: "trackTable",
        states: {
          hist: {
            type: "history",
          },
          fetchGroup: {
            invoke: {
              src: "invokeGroupById",
              onDone: {
                target: "#top-table.topTable",
                actions: ["setGroupData"],
              },
              onError: {
                actions: (_, e) => console.log(e),
                target: "#top-table.error",
              },
            },
          },
          trackTable: {
            initial: "display",
            states: {
              // check: {
              //   on: {
              //     "": [
              //       {
              //         target: "display",
              //         cond: ({ topData, type, time_range }) =>
              //           !!topData[`${type}_${time_range}`],
              //       },
              //       {
              //         target: "loading",
              //       },
              //     ],
              //   },
              // },
              // loading: {
              //   invoke: {
              //     id: "getTopData",
              //     src: "invokeGetTopData",
              //     onDone: {
              //       target: "#top-table.topTable.trackTable.display",
              //       actions: ["setTopData"],
              //     },
              //     onError: {
              //       actions: (_, e) => console.log("onError", e),
              //       target: "#top-table.error",
              //     },
              //   },
              // },
              display: {},
            },
          },
          artistTable: {
            initial: "display",
            states: {
              // check: {
              //   on: {
              //     "": [
              //       {
              //         target: "display",
              //         cond: ({ topData, type, time_range }) =>
              //           !!topData[`${type}_${time_range}`],
              //       },
              //       {
              //         target: "loading",
              //       },
              //     ],
              //   },
              // },
              // loading: {
              //   invoke: {
              //     id: "getTopData",
              //     src: "invokeGetTopData",
              //     onDone: {
              //       target: "#top-table.topTable.artistTable.display",
              //       actions: ["setTopData"],
              //     },
              //     onError: {
              //       actions: (_, e) => console.log(e),
              //       target: "#top-table.error",
              //     },
              //   },
              // },
              display: {},
            },
          },
        },
        on: {
          SELECT_ARTIST: {
            target: ".artistTable",
            actions: assign({ type: "artist" }),
          },
          SET_ARTIST_TIME_RANGE: {
            actions: "setTimeRange",
            target: ".artistTable",
          },
          SELECT_TRACK: {
            target: ".trackTable",
            actions: assign({ type: "track" }),
          },
          SET_TRACK_TIME_RANGE: {
            actions: "setTimeRange",
            target: ".trackTable",
          },
        },
      },
    },
    on: {
      OPEN_MODAL: "newGroupModal",
      CLOSE_MODAL: "topTable.hist",
      SELECT_GROUP: {
        target: "topTable.fetchGroup",
        actions: "setSelectedGroupId",
      },
      RESET: "initalise",
    },
  },
  {
    actions: {
      setTimeRange: assign((_, { time_range }) => ({ time_range })),
      setGroupName: console.log,
      newGroupModal: console.log,

      setTopData: assign(({ type, time_range, topData }, { data }) => {
        let genres = {}
        if (type === "artist") {
          genres = { genres: reduceGenres(data.items as ArtistObjectFull[]) }
        }
        return {
          topData: {
            ...topData,
            [`${type}_${time_range}`]: { ...data, ...genres },
          },
        }
      }),
      setInitialData: assign((_, { data }) => {
        return {
          groupList: data[0],
          topData: Object.keys(data[1]).reduce((a, key) => {
            a[key] = data[1][key].items
            return a
          }, {}),
        }
      }),
      setGroupData: assign(
        (
          _,
          {
            data: {
              id,
              track_short_term,
              track_medium_term,
              track_long_term,
              artist_short_term,
              artist_medium_term,
              artist_long_term,
              users,
            },
          },
        ) => {
          return {
            selectedGroupMembers: users,
            selectedGroupId: id,
            topData: {
              track_short_term,
              track_medium_term,
              track_long_term,
              artist_short_term,
              artist_medium_term,
              artist_long_term,
            },
          }
        },
      ),
      setSelectedGroupId: assign((_, { id }) => ({ selectedGroupId: id })),
    },
    services: {
      invokeGetTopData: ({ type, time_range }, event) => {
        return getTopData({ type, time_range })
      },
      addGroup: () => {},
      invokeInit: () => {
        return Promise.all([getCurrentUsersGroups(), getAllTop()])
      },
      invokeGroupById: ({ selectedGroupId }, event) => {
        console.log({ event, selectedGroupId })

        return getGroupById(selectedGroupId)
      },
    },
  },
)
export default topTableMachine
