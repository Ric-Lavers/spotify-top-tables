import React from "react"

import * as S from "./TopTables.style"

type SwitchTimeRangeButtonsType = React.FC<{
  top_time_range: { value: string; label: string }[]
  time_range: string
  type: string
  send: (str: string, data: object) => void
}>

const SwitchTimeRangeButtons: SwitchTimeRangeButtonsType = ({
  top_time_range,
  time_range,
  send,
  type,
}) => (
  <S.ButtonGroup>
    {top_time_range.map(({ value, label }) => (
      <S.Button
        key={label}
        onClick={() =>
          send("SET_" + type.toUpperCase() + "_TIME_RANGE", {
            time_range: value,
          })
        }
        className={time_range === value ? "success" : ""}>
        {label}
      </S.Button>
    ))}
  </S.ButtonGroup>
)

export default SwitchTimeRangeButtons
