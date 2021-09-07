import React from 'react';
import './FilterTypes.css';

export function SearchColumnFilter({
    column: { filterValue, setFilter, id },
  }) {
    return (
      <input
        className="search-filter"
        id={`${id}-search-filter`}
        value={filterValue || ''}
        onChange={(event) => {
          setFilter(event.target.value !== '' ? event.target.value : undefined);
        }}
        placeholder="Filter..."
      />
    )
  }

export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  // const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder="Filter..."
    />
  )
}  




export function SelectFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows

  // console.log("filterValue: " + filterValue);
  
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}


export function SelectTeamFilter({
  column: { filterValue, setFilter },
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

  return (
    <select
      value={filterValue}
      className='team-filter'
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      <option value="Anh">Anaheim</option>
      <option value="Ari">Arizona</option>
      <option value="Bos">Boston</option>
      <option value="Buf">Buffalo</option>
      <option value="Cgy">Calgary</option>
      <option value="Car">Carolina</option>
      <option value="Chi">Chicago</option>
      <option value="Col">Cololardo</option>
      <option value="Cls">Columbus</option>
      <option value="Dal">Dallas</option>
      <option value="Det">Detroit</option>
      <option value="Edm">Edmonton</option>
      <option value="Fla">Florida</option>
      <option value="LA">L.A.</option>
      <option value="Min">Minnesota</option>
      <option value="Mon">Montreal</option>
      <option value="Nsh">Nashville</option>
      <option value="NJ">New Jersey</option>
      <option value="NYI">NY Islanders</option>
      <option value="NYR">NY Rangers</option>
      <option value="Ott">Ottawa</option>
      <option value="Phi">Philadelphia</option>
      <option value="Pit">Pittsburgh</option>
      <option value="SJ">San Jose</option>
      <option value="Sea">Seattle</option>
      <option value="StL">St. Louis</option>
      <option value="Tor">Toronto</option>
      <option value="TB">Tampa Bay</option>
      <option value="Van">Vancouver</option>
      <option value="VGK">Vegas</option>
      <option value="Was">Washington</option>
      <option value="Wpg">Winnipeg</option>

      {/* {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))} */}
    </select>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectPlayerTypeColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  const optionToProspect = {
    "0": "Non-prospects",
    "1": "Prospects"
  }

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {optionToProspect[option]}
        </option>
      ))}
    </select>
  )
}


export function SelectPositionColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => {
        if (option.length < 3) { // To prevent showing LW/RW, etc.
          return(
            <option key={i} value={option}>
              {option}
            </option>
          );
        }
        return options
      } 
      )}
      <option value={'/'}>Multi</option>
    </select>
  )
}
