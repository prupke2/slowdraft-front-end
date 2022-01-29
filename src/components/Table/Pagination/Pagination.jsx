import React from 'react';
import './Pagination.css';

export default function Pagination(
    { 
      tableType, gotoPage, canPreviousPage, previousPage, nextPage,
      canNextPage, pageCount, pageIndex, pageOptions, currentRound
    }) {
  
  const pageOrRound = tableType === 'draftPicks' ? 'Round' : 'Page';
  return (

    <ul className="pagination">
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <li className="pagination-arrows">
        <div className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <span className="page-link page-first">First</span>
        </div>
        <div className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <span className="page-link">{'<'}</span>
        </div>
        { currentRound &&
          <div className="page-item" onClick={() => gotoPage(currentRound)} disabled={!canPreviousPage}>
            <span className="page-link">
              {/* <Emoji emoji='➡️ ' /> */}
              <span className='current-round-button'>current round</span>
            </span>
          </div>
        }
        <div className="page-item" onClick={() => canNextPage && nextPage()}>
            <span className="page-link">{'>'}</span>
        </div>
        <div className="page-item" onClick={() => canNextPage && gotoPage(pageCount - 1)}>
            <span className="page-link page-last">Last</span>
        </div>
      </li>
      <li className="pagination-goto-page">
        <span className="page-link">
          {pageOrRound}
          <div className="page-of-page">
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </div>
        </span>
        {/* <span className="page-link">
          <div>Go&nbsp;to:</div>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
            }}
            style={{ width: '40px', height: '22px' }}
          />
        </span> */}
      </li>
    </ul>
  );
}
