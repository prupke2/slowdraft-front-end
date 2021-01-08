import React from 'react';
import './Pagination.css';

export default function Pagination(
    { 
      tableType, gotoPage, canPreviousPage, previousPage, nextPage,
      canNextPage, pageCount, pageIndex, pageOptions
    }) {
  return (

    <ul className="pagination">
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <li className="pagination-goto-page">
        <span className="page-link">
          Page
          <div className="page-of-page">
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </div>
        </span>
        <span className="page-link">
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
        </span>
      </li>

      <li className="pagination-arrows">
        <div className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <span className="page-link">First</span>
        </div>
        <div className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <span className="page-link">{'<'}</span>
        </div>
        <div className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
            <span className="page-link">{'>'}</span>
        </div>
        <div className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <span className="page-link">Last</span>
        </div>
      </li>
    </ul>
  );
}
