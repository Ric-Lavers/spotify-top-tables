import React from "react"
import { useMachine } from "@xstate/react"
import { TrackObjectFull, ArtistObjectFull } from "../types/spotify-api"
import { top_time_range } from "../constants"
import TrackTable from "./TrackTable"
import ArtistTable from "./ArtistTable"
import NewGroupModal from "./NewGroupModal"
import topTableMachine, { TopData } from "../machines/topTableMachine"
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

  const currentTableData: unknown =
    topData[`${type}_${time_range}` as keyof TopData]

  const isTrack = matches({ topTable: "trackTable" })
  let topThreeGenres: string[] = []
  if (type === "artist")
    topThreeGenres = (
      (currentTableData as ArtistObjectFull).genres || []
    ).slice(0, 3)
  console.log({ topThreeGenres })

  const handleGroupChange = ({
    target: { value: id },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    id && send("SELECT_GROUP", { id })
  }

  const GroupSelect = () => {
    if (!groupList.length) return null
    console.log(groupList)

    return (
      <select onChange={handleGroupChange}>
        <option value={""}>yours</option>
        {groupList.map(({ id, name }) => (
          <option value={id}>{name + " " + id}</option>
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
          items={currentTableData as TrackObjectFull[]}
          iterate
        />
      ) : (
        <ArtistTable
          id="top-table-artists"
          items={currentTableData as ArtistObjectFull[]}
          iterate
        />
      )}
    </div>
  )
}

export default TopTable
