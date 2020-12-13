import React from 'react';

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
