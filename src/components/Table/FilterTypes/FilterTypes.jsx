import React, { useMemo } from "react";
import "./FilterTypes.css";

export function SearchColumnFilter({ column: { filterValue, setFilter, id } }) {

  return (
    <div className="search-filter-wrapper">
      <input
        autoComplete="off"
        className="search-filter"
        id={`${id}-search-filter`}
        value={filterValue || ""}
        onChange={(event) => {
          setFilter(event.target.value !== "" ? event.target.value : undefined);
        }}
        placeholder="Filter..."
      />
      { filterValue && (
        <div className="search-filter-clear" onClick={() => setFilter('')}>
          x
        </div>
      )}
    </div>
  );
}

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  // const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder="Filter..."
    />
  );
}

export function SelectFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows

  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function SelectTeamFilter({
  column: { filterValue, setFilter },
  wideFilter,
  disableAll,
}) {
  // Calculate the options for filtering
  // using the preFilteredRows

  // const options = React.useMemo(() => {
  //   const options = new Set()
  //   preFilteredRows.forEach(row => {
  //     options.add(row.values[id])
  //   })
  //   return [...options.values()]
  // }, [id, preFilteredRows])

  const isWideFilter = wideFilter ? "wide-filter" : null;
  return (
    <select
      name="team-filter"
      value={filterValue}
      className={`team-filter ${isWideFilter}`}
      onChange={(e) => {
        localStorage.setItem("team-filter-cache", e.target.value);
        setFilter(e.target.value);
      }}
    >
      {!disableAll && <option value="">All</option>}
      {disableAll && <option value="">Select a team</option>}

      <option value="ANA">Anaheim</option>
      <option value="BOS">Boston</option>
      <option value="BUF">Buffalo</option>
      <option value="CGY">Calgary</option>
      <option value="CAR">Carolina</option>
      <option value="CHI">Chicago</option>
      <option value="COL">Colorado</option>
      <option value="CBJ">Columbus</option>
      <option value="DAL">Dallas</option>
      <option value="DET">Detroit</option>
      <option value="EDM">Edmonton</option>
      <option value="FLA">Florida</option>
      <option value="LA">L.A.</option>
      <option value="MIN">Minnesota</option>
      <option value="MTL">Montreal</option>
      <option value="NSH">Nashville</option>
      <option value="NJ">New Jersey</option>
      <option value="NYI">NY Islanders</option>
      <option value="NYR">NY Rangers</option>
      <option value="OTT">Ottawa</option>
      <option value="PHI">Philadelphia</option>
      <option value="PIT">Pittsburgh</option>
      <option value="SJ">San Jose</option>
      <option value="SEA">Seattle</option>
      <option value="STL">St. Louis</option>
      <option value="TOR">Toronto</option>
      <option value="TB">Tampa Bay</option>
      <option value="VAN">Vancouver</option>
      <option value="UTA">Utah</option>
      <option value="VGK">Vegas</option>
      <option value="WSH">Washington</option>
      <option value="WPG">Winnipeg</option>

      {/* {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))} */}
    </select>
  );
}

export function SelectPositionColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      className="position-filter"
      value={filterValue}
      onChange={(e) => {
        localStorage.setItem("position-filter-cache", e.target.value);
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => {
        if (option.length < 3) {
          // To prevent showing LW/RW, etc.
          return (
            <option key={i} value={option}>
              {option}
            </option>
          );
        }
        return options;
      })}
      <option value={"/"}>Multi</option>
    </select>
  );
}
