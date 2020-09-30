import React, { useState } from "react"
import { useMachine } from "@xstate/react"
import get from "lodash.get"
import {
  TrackObjectFull,
  ArtistObjectFull,
  UsersTopArtistsResponse,
  UsersTopTracksResponse,
} from "../types/spotify-api"
// import { getTopTracks, getTopArtists } from "~/api/spotify"
import { reduceGenres } from "../utils"
import { top_time_range } from "../constants"
import TrackTable from "./TrackTable"
import ArtistTable from "./ArtistTable"
import NewGroupModal from "./NewGroupModal"
import topTableMachine from "../machines/topTableMachine"
import { getTopArtists } from "services/me/top/artists"
import { getTopTracks } from "services/me/top/tracks"

const topArtistsMock: UsersTopArtistsResponse = require("../__mocks__/me/top/artists.json")
const topTracksMock: UsersTopTracksResponse = require("../__mocks__/me/top/tracks.json")

const buttonGroup = {
  display: "flex",
  justifyContent: "flex-start",
  width: 100,
}
const button = {
  cursor: "pointer",
  padding: 4,
}
const TopRow = {
  display: "flex",
  justifyContent: "space-between",
}

const useTopData = (type: string, range: string) => {
  const [rawData, setData] = useState({})

  const [genres, setGenres] = useState([])
  const key = `${type}_${range}`

  React.useEffect(() => {
    const getData = async () => {
      try {
        const data =
          type === "tracks"
            ? await getTopTracks({ time_range: range })
            : topArtistsMock //await getTopArtists({ time_range: range })

        if (type === "artists") {
          setGenres({
            ...genres,
            [key]: reduceGenres(data.items as ArtistObjectFull[]),
          })
        }

        setData({ ...rawData, [key]: data })
      } catch (error) {
        console.error(`fetching top ${type} failed`)
      }
    }
    //@ts-ignore
    if (!rawData[key]) {
      getData()
    }
  }, [type, range, rawData, key, genres])

  return {
    items: get(rawData, `${key}.items`, []),
    genres: get(genres, key, []) as ArtistObjectFull[],
  }
}

const TopTable = () => {
  const [
    {
      matches,
      context,
      context: { timeRange, isNewGroupModalOpen },
      value,
      ...rest
    },
    send,
    //@ts-ignore
  ] = useMachine(topTableMachine, {
    devTools: true,
  })

  const isTrack = matches({ topTable: "trackTable" })
  const isShortTerm = matches({ topTable: { timeRange: "short_term" } })

  console.log(value)
  console.log(
    matches({
      topTable: {
        timeRange: "short_term",
      },
    }),
  )
  // console.log({ isShortTerm, isTrack })

  let { genres, items } = useTopData(isTrack ? "tracks" : "artists", timeRange)

  const topThreeGenres = genres.slice(0, 3)

  /* var event = [
    send("SELECT_SHORT_TERM"),
    send("SELECT_MEDIUM_TERM"),
    send("SELECT_LONG_TERM"),
    send("SELECT_TRACK"),
    send("SELECT_ARTIST"),
  ] */

  const ToggleTypeButtons = () => (
    <div style={buttonGroup}>
      <button
        style={button}
        className={
          matches({
            topTable: {
              table_Type: "trackTable",
            },
          })
            ? "success"
            : ""
        }
        onClick={() => send("SELECT_TRACK")}>
        Tracks
      </button>
      <button
        style={button}
        className={
          matches({
            topTable: {
              table_Type: "artistTable",
            },
          })
            ? "success"
            : ""
        }
        onClick={() => send("SELECT_ARTIST")}>
        Artists
      </button>
    </div>
  )
  const ranges = {
    short_term: () => send("SELECT_SHORT_TERM"),
    medium_term: () => send("SELECT_MEDIUM_TERM"),
    long_term: () => send("SELECT_LONG_TERM"),
  }

  const SwitchTimeRangeButtons = () => (
    <div style={buttonGroup}>
      {top_time_range.map(
        ({ value, label }: { value: string; label: string }) => (
          <button
            key={label}
            style={button}
            //@ts-ignore
            onClick={ranges[value]}
            className={
              matches({
                topTable: {
                  timeRange: value,
                },
              })
                ? "success"
                : ""
            }>
            {label}
          </button>
        ),
      )}
    </div>
  )
  // const CollectionType = () => (
  //   <div style={buttonGroup}>
  //     <button
  //       style={button}
  //       className={isTrack ? "success" : ""}
  //       onClick={() => send("SELECT_TRACK")}>
  //       Yours
  //     </button>
  //     <button
  //       style={button}
  //       className={!isTrack ? "success" : ""}
  //       onClick={() => send("SELECT_ARTIST")}>
  //       Group
  //     </button>
  //   </div>
  // )

  return (
    <div className="results top-table">
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onExit={() => {}}
        onSubmit={console.log}
      />
      <div style={TopRow}>
        <div>
          <ToggleTypeButtons />
          <SwitchTimeRangeButtons />
        </div>
        {!topThreeGenres.length ? null : (
          <div>
            Top Three Genres:
            <ol>
              {topThreeGenres.map(({ name }) => (
                <li key={name}>{name}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {isTrack ? (
        <TrackTable
          id="top-table-tracks"
          items={items as TrackObjectFull[]}
          iterate
        />
      ) : (
        <ArtistTable
          id="top-table-artists"
          items={items as ArtistObjectFull[]}
          iterate
        />
      )}
    </div>
  )
}

export default TopTable
