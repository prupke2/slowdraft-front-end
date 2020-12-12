import React from 'react';
import { useTable } from 'react-table';
import './Table.css';

export default function Table({players}) {

  const data = React.useMemo(
    () => players, [players]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Team',
        accessor: 'team',
      },
      {
        Header: 'Player ID',
        accessor: 'player_id',
        hidden: true
      },
      {
        Header: 'Position',
        accessor: 'position.position',
      },
    ],
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })
  
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
              >
                { column.render('Header') }

              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                if (cell.column.Header === 'Position') {
                  return (
                    <td className={cell.column.Header}
                    {...cell.getCellProps()}
                    >
                      {cell.render(({ value }) => String(value + ', ').substring(0, (String(value).length)))}
                    </td>                    
                  )
                } else if (cell.column.Header === 'Name') {
                  return (
                    <td className="player-name"
                    {...cell.getCellProps()}
                    >
                      <a href={`https://sports.yahoo.com/nhl/players/${cell.column.Header}`}>
                        {cell.render('Cell')}
                      </a>
                    </td>                    
                  )
                } else {
                  return (
                    <td className={cell.column.Header}
                    {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                }
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
