import React from "react"
import { TrackObjectFull } from "../types/spotify-api"
import PopularityMeter from "./PopularityMeter"

interface Props {
  items: TrackObjectFull[]
  id: string
  iterate: boolean
  onNameClick: Function
  saveTrack?: Function
  toggleSaveAll?: Function
}

const TrackTable = ({
  onNameClick,
  items,
  saveTrack,
  toggleSaveAll,
  iterate,
  id,
}: Props) => (
  <table id={id}>
    <thead>
      <tr>
        {iterate && <th></th>}
        <th>Name</th>
        <th>Artists</th>
        <th>Album</th>
        <th className="hide-up-sm">Popular</th>
        <th className="hide-up-md">Released</th>
        {toggleSaveAll && (
          <th style={{ textAlign: "center" }}>
            Like
            <input
              onChange={({ target: { checked } }) => {
                toggleSaveAll(checked)
              }}
              id="follow-check"
              type="checkbox"
              name="followingLabel"
            />
          </th>
        )}
      </tr>
    </thead>
    <tbody>
      {items.map(
        (
          {
            artists,
            album: { name: albumName, release_date },
            name,
            id,
            uri,
            popularity,
            type,
          },
          i,
        ) => {
          return (
            <tr className="results__item" key={id}>
              {iterate && <td>{(i + 1).toString()}</td>}
              <td className="pointer" onClick={() => onNameClick(uri)}>
                {name}
              </td>

              <td>{artists.map(({ name }) => name).join(", ")}</td>
              <td>{albumName}</td>
              <td className="hide-up-sm">
                <PopularityMeter
                  className="popularity-meter"
                  popularity={popularity}
                />
              </td>
              <td className="hide-up-md">{release_date}</td>
              {saveTrack && (
                <td style={{ textAlign: "center" }}>
                  <input
                    onChange={({ target: { checked } }) =>
                      saveTrack(id, checked)
                    }
                    id="follow-check"
                    type="checkbox"
                    checked={false}
                    name="followingLabel"
                  />
                </td>
              )}
            </tr>
          )
        },
      )}
    </tbody>
  </table>
)

TrackTable.defaultProps = {
  id: "search-results",
  onNameClick: () => {},
}

export default React.memo(TrackTable)
