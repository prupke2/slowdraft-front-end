import React from 'react';
import { useTable } from 'react-table';
import './Table.css';

export default function Table() {
  const data = React.useMemo(
    () => [
      {
        player: 'Crosby',
        stat: '10',
      },
      {
        player: 'Ovechkin',
        stat: '7',
      },
      {
        player: 'Kane',
        stat: '4',
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Players',
        accessor: 'player', // accessor is the "key" in the data
      },
      {
        Header: 'Stats',
        accessor: 'stat',
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
                {column.render('Header')}
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
                return (
                  <td
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
