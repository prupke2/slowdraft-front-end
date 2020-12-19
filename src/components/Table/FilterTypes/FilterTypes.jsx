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
