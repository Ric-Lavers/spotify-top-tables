import React from "react"
import { useMachine } from "@xstate/react"
import { TrackObjectFull, ArtistObjectFull } from "../types/spotify-api"
import { top_time_range } from "../constants"
import TrackTable from "./TrackTable"
import ArtistTable from "./ArtistTable"
import NewGroupModal from "./NewGroupModal"
import topTableMachine from "../machines/topTableMachine"
import SwitchTimeRangeButtons from "./SwitchTimeRangeButtons"
import ToggleTypeButtons from "./ToggleTypeButtons"
import * as S from "./TopTables.style"

const TopTable = () => {
  const [
    {
      matches,
      context,
      context: { time_range, type, isNewGroupModalOpen, topData, groupList },
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
  const handleGroupChange = ({
    target: { value: id },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    id && send("SELECT_GROUP", { id })
  }

  const GroupSelect = () => {
    if (!groupList.length) return null
    return (
      <select onChange={handleGroupChange}>
        <option value={""}>yours</option>
        {groupList.map(({ _id, name }) => (
          <option value={_id}>{name}</option>
        ))}
      </select>
    )
  }

  if (value === "error") {
    return (
      <>
        error has occured
        <S.Button onClick={() => send("RESET")}>reset?</S.Button>
      </>
    )
  }
  const isLoading =
    !!toStrings().join("").match("loading") || value === "initalise"

  return (
    <div className="results top-table">
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onExit={() => {}}
        onSubmit={() => {}}
      />
      <S.TopRow>
        <div>
          <GroupSelect />
          <ToggleTypeButtons matches={matches} send={send} />
          <SwitchTimeRangeButtons
            top_time_range={top_time_range}
            send={send}
            time_range={time_range}
            type={type}
          />
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
      </S.TopRow>

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
