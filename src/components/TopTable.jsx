import React, { useState, useContext } from "react";
import get from "lodash.get";

import TrackTable from "./TrackTable";
import ArtistTable from "./ArtistTable";
import { getTopTracks, getTopArtists } from "api/spotify";

const buttonGroup = {
  display: "flex",
  justifyContent: "flex-start",
  width: 100,
};
const button = {
  cursor: "pointer",
  padding: 4,
};
const TopRow = {
  display: "flex",
  justifyContent: "space-between",
};
const reduceGenres = (items) => {
  return items
    .reduce((a, { genres }) => {
      genres.forEach((genre) => {
        const index = a.findIndex(({ name }) => name === genre);

        if (index === -1) {
          a.push({
            name: genre,
            count: 1,
          });
        } else {
          a[index].count++;
        }
      });
      return a;
    }, [])
    .sort((a, b) => b.count - a.count);
};
const top_time_range = [
  { value: "short_term", label: "4 weeks" },
  { value: "medium_term", label: "6 months" },
  { value: "long_term", label: "Years" },
];

const useTopData = (type, range) => {
  const [rawData, setData] = useState({});

  const [genres, setGenres] = useState([]);
  const [, setItems] = useState([]);
  const key = `${type}_${range}`;

  const getData = async () => {
    try {
      const data =
        type === "tracks"
          ? await getTopTracks({ time_range: range })
          : await getTopArtists({ time_range: range });

      if (type === "artists") {
        setGenres({ ...genres, [key]: reduceGenres(data.items) });
      }

      setData({ ...rawData, [key]: data });
      setItems(data.items);
    } catch (error) {
      console.error(`fetching top ${type} failed`);
    }
  };

  React.useEffect(() => {
    if (!rawData[key]) {
      getData();
    } else {
      setItems(rawData[key].items);
    }
  }, [type, range]);

  return {
    items: get(rawData, `${key}.items`, []),
    genres: get(genres, key, []),
  };
};

const TopTable = () => {
  const [rangeValue, setTimeRange] = useState(top_time_range[0].value);
  const [isTrack, setTrack] = useState(true);
  let { genres, items } = useTopData(
    isTrack ? "tracks" : "artists",
    rangeValue
  );
  const topThreeGenres = genres.slice(0, 3);

  const ToggleButtons = () => (
    <div style={buttonGroup}>
      <button
        style={button}
        className={isTrack ? "success" : ""}
        onClick={() => setTrack(true)}
      >
        Tracks
      </button>
      <button
        style={button}
        className={!isTrack ? "success" : ""}
        onClick={() => setTrack(false)}
      >
        Artists
      </button>
    </div>
  );

  const SwitchTimeRangeButtons = () => (
    <div style={buttonGroup}>
      {top_time_range.map(({ value, label }) => (
        <button
          style={button}
          onClick={() => setTimeRange(value)}
          className={value === rangeValue ? "success" : ""}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="results top-table">
      <div style={TopRow}>
        <div>
          <ToggleButtons />
          <SwitchTimeRangeButtons />
        </div>
        {!topThreeGenres.length ? null : (
          <div>
            Top Three Genres:
            <ol>
              {topThreeGenres.map(({ name }) => (
                <li>{name}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {isTrack ? (
        <TrackTable id="top-table" items={items} iterate />
      ) : (
        <ArtistTable id="top-table" items={items} iterate />
      )}
    </div>
  );
};

export default TopTable;
