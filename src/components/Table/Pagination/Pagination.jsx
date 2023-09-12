import React from "react";
import "./Pagination.css";

export default function Pagination({
  tableType,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  currentRound,
}) {
  const pageOrRound = tableType === "draftPicks" ? "Round" : "Page";
  const isLiveDraft = JSON.parse(localStorage.getItem("liveDraft")) === "true";
  const extraPadding = tableType === "draftPicks" && 'draftTabPaddingTop';

  return (
    <ul className={`pagination ${extraPadding}`}>
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <li className="pagination-arrows">
        <div
          className="page-item"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <span className="page-link page-first">First</span>
        </div>
        <div
          className="page-item"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <span className="page-link">{"<"}</span>
        </div>
        {isLiveDraft && currentRound && (
          <div
            className="page-item"
            onClick={() => gotoPage(currentRound)}
            disabled={!canPreviousPage}
          >
            <span className="page-link">
              <span className="current-round-button">current round</span>
            </span>
          </div>
        )}
        <div className="page-item" onClick={() => canNextPage && nextPage()}>
          <span className="page-link">{">"}</span>
        </div>
        <div
          className="page-item"
          onClick={() => canNextPage && gotoPage(pageCount - 1)}
        >
          <span className="page-link page-last">Last</span>
        </div>
      </li>
      <li className="pagination-goto-page">
        <span className="page-link page-or-round">
          {pageOrRound}
          <div className="page-of-page">
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </div>
        </span>
      </li>
    </ul>
  );
}
