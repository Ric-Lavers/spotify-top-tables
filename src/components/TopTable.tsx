import React from "react"
import { useMachine } from "@xstate/react"
import { TrackObjectFull, ArtistObjectFull } from "../types/spotify-api"
import { top_time_range } from "../constants"
import TrackTable from "./TrackTable"
import ArtistTable from "./ArtistTable"
import NewGroupModal from "./NewGroupModal"
import topTableMachine from "../machines/topTableMachine"

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

const TopTable = () => {
  const [
    {
      matches,
      context,
      context: { time_range, type, isNewGroupModalOpen, topData },
      value,
      toStrings,
      ...rest
    },
    send,
    //@ts-ignore
  ] = useMachine(topTableMachine, {
    devTools: true,
  })
  //@ts-ignore
  const currentTableData = topData[`${type}_${time_range}`]

  const isTrack = matches({ topTable: "trackTable" })
  const topThreeGenres = (currentTableData?.genres || []).slice(0, 3)

  const ToggleTypeButtons = () => (
    <div style={buttonGroup}>
      <button
        style={button}
        className={
          matches({
            topTable: "trackTable",
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
            topTable: "artistTable",
          })
            ? "success"
            : ""
        }
        onClick={() => send("SELECT_ARTIST")}>
        Artists
      </button>
    </div>
  )

  const SwitchTimeRangeButtons = () => (
    <div style={buttonGroup}>
      {top_time_range.map(
        ({ value, label }: { value: string; label: string }) => (
          <button
            key={label}
            style={button}
            //@ts-ignore
            onClick={() =>
              send("SET_" + type.toUpperCase() + "_TIME_RANGE", {
                time_range: value,
              })
            }
            className={time_range === value ? "success" : ""}>
            {label}
          </button>
        ),
      )}
    </div>
  )
  const isLoading = !!toStrings().join("").match("loading")

  return (
    <div className="results top-table">
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onExit={() => {}}
        onSubmit={() => {}}
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
              {
                //@ts-ignore
                topThreeGenres.map(({ name }) => (
                  <li key={name}>{name}</li>
                ))
              }
            </ol>
          </div>
        )}
      </div>

      {isLoading ? (
        "loading..."
      ) : isTrack ? (
        <TrackTable
          id="top-table-tracks"
          items={currentTableData.items as TrackObjectFull[]}
          iterate
        />
      ) : (
        <ArtistTable
          id="top-table-artists"
          items={currentTableData.items as ArtistObjectFull[]}
          iterate
        />
      )}
    </div>
  )
}

export default TopTable
