//@ts-nocheck
import { Machine, assign } from "xstate"
import {
  UsersTopArtistsResponse,
  UsersTopTracksResponse,
  ArtistObjectFull,
} from "types/spotify-api"
import { getTopTracks } from "services/me/top/tracks"
import { getTopArtists } from "services/me/top/artists"
import { reduceGenres } from "utils"

const getTopData = ({ type, time_range }) => {
  return type === "artist"
    ? getTopArtists({ time_range })
    : getTopTracks({ time_range })
}
interface TContext {
  type: "track" | "artist"
  time_range: "short_term" | "medium_term" | "long_term"
  groupName: string
  isNewGroupModalOpen: boolean
  topData: {
    track_short_term: UsersTopTracksResponse | null
    track_medium_term: UsersTopTracksResponse | null
    track_long_term: UsersTopTracksResponse | null

    artist_short_term: UsersTopArtistsResponse | null
    artist_medium_term: UsersTopArtistsResponse | null
    artist_long_term: UsersTopArtistsResponse | null
  }
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
  | { type: "SELECT_TRACK" }
  | { type: "SELECT_ARTIST" }
  | { type: string }
  | { type: "SET_TIME_RANGE"; time_range: Pick<TContext, "time_range"> }

//@ts-ignore
const topTableMachine = Machine<TContext, TStateSchema, TEvent>(
  {
    id: "top-table",
    initial: "topTable",
    context: {
      type: "track",
      time_range: "short_term",
      groupName: "all",
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
      error: {
        type: "final",
      },

      newGroupModal: {},
      topTable: {
        initial: "trackTable",
        states: {
          hist: {
            type: "history",
          },
          trackTable: {
            initial: "check",
            states: {
              check: {
                on: {
                  "": [
                    {
                      target: "display",
                      cond: ({ topData, type, time_range }) =>
                        !!topData[`${type}_${time_range}`],
                    },
                    {
                      target: "loading",
                    },
                  ],
                },
              },
              loading: {
                invoke: {
                  id: "getTopData",
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
              display: {},
            },
          },
          artistTable: {
            initial: "check",
            states: {
              check: {
                on: {
                  "": [
                    {
                      target: "display",
                      cond: ({ topData, type, time_range }) =>
                        !!topData[`${type}_${time_range}`],
                    },
                    {
                      target: "loading",
                    },
                  ],
                },
              },
              loading: {
                invoke: {
                  id: "getTopData",
                  src: "invokeGetTopData",
                  onDone: {
                    target: "#top-table.topTable.artistTable.display",
                    actions: ["setTopData"],
                  },
                  onError: {
                    actions: (_, e) => console.log(e),
                    target: "#top-table.error",
                  },
                },
              },
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
    },
    services: {
      invokeGetTopData: ({ type, time_range }, event) => {
        return getTopData({ type, time_range })
      },
    },
  },
)
export default topTableMachine
