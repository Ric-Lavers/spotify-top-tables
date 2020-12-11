import React from "react"

import * as S from "./TopTables.style"

type ToggleTypeButtonsType = React.FC<{
  matches: (a: object) => boolean
  send: (str: string) => void
}>

const ToggleTypeButtons: ToggleTypeButtonsType = ({ matches, send }) => (
  <S.ButtonGroup>
    <S.Button
      className={
        matches({
          topTable: "trackTable",
        })
          ? "success"
          : ""
      }
      onClick={() => send("SELECT_TRACK")}>
      Tracks
    </S.Button>
    <S.Button
      className={
        matches({
          topTable: "artistTable",
        })
          ? "success"
          : ""
      }
      onClick={() => send("SELECT_ARTIST")}>
      Artists
    </S.Button>
  </S.ButtonGroup>
)
export default ToggleTypeButtons
