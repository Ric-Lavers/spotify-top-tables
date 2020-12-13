import React from "react"

interface Props {
  items: {
    label: string
    value: string
  }[]
}

/**
 * ! sorting requires more detailed track information, which is avaiabled on a per item manner.
 */
const SortSelect: React.FC<Props> = ({ items }) => {
  if (!items.length) return null
  return (
    <select>
      {items.map(({ label, value }) => (
        <option value={value}>{label}</option>
      ))}
    </select>
  )
}

SortSelect.defaultProps = {
  items: [
    {
      label: "bpm",
      value: "bpm",
    },
  ],
}

export default SortSelect
