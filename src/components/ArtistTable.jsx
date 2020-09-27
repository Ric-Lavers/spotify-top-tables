import React from "react";

import PopularityMeter from "./PopularityMeter";

const ArtistTable = ({
  onNameClick,
  items,
  followArtist,
  toggleFollowAll,
  iterate,
}) => (
  <table id="search-results">
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
                toggleFollowAll(checked);
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
        ({ artists, name, id, uri, popularity, followers, following }, i) => {
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
                    checked={following}
                    name="followingLabel"
                  />
                </td>
              )}
            </tr>
          );
        }
      )}
    </tbody>
  </table>
);

ArtistTable.defaultProps = {
  onNameClick: () => {},
};

export default ArtistTable;
