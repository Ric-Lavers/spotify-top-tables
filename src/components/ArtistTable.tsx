import React from "react"
import { ArtistObjectFull } from "../types/spotify-api"
import PopularityMeter from "./PopularityMeter"

interface Props {
  items: ArtistObjectFull[]
  id: string
  iterate: boolean
  onNameClick: Function
  followArtist?: Function
  toggleFollowAll?: Function
}
const ArtistTable = ({
  items,
  id,
  iterate,
  onNameClick,
  followArtist,
  toggleFollowAll,
}: Props) => (
  <table id={id}>
    <thead>
      <tr>
        {iterate && <th></th>}
        <th>Name</th>
        <th>Popular</th>
        <th className="hide-up-md">Fans</th>
        {toggleFollowAll && (
          <th>
            Follow
            <input
              onChange={({ target: { checked } }) => {
                toggleFollowAll(checked)
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
      {items.map(({ name, id, uri, popularity, followers }, i) => {
        return (
          <tr className="results__item" key={id}>
            {iterate && <th>{(i + 1).toString()}</th>}
            <td className="pointer" onClick={() => onNameClick(uri)}>
              {name}
            </td>
            <td>
              <PopularityMeter
                className="popularity-meter"
                popularity={popularity}
              />
            </td>
            <td className="hide-up-md">
              {followers && followers.total.toString()}
            </td>
            {followArtist && (
              <td style={{ textAlign: "center" }}>
                <input
                  onChange={({ target: { checked } }) =>
                    followArtist(id, checked)
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
      })}
    </tbody>
  </table>
)

ArtistTable.defaultProps = {
  onNameClick: () => {},
  id: "search-results",
}

export default React.memo(ArtistTable)
