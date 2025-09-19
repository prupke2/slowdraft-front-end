import React from "react";
import "./Pagination.css";
import { scrollToTop } from "../../../util/util";

export default function Pagination({
  currentRound,
  tableType,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  position,
}) {
  const pageOrRound = tableType === "draftPicks" ? "Round" : "Page";
  const isLiveDraft = localStorage.getItem("liveDraft") === "true";
  const extraPadding = tableType === "draftPicks" && 'draftTabPaddingTop';
  const showCurrentRoundButton = isLiveDraft && typeof currentRound === 'number';
  const scrollLeftClass = !canPreviousPage ? 'disabled-pagination' : '';
  const scrollRightClass = !canNextPage ? 'disabled-pagination' : '';
  const currentRoundClass = pageIndex === currentRound ? 'disabled-pagination' : '';
  const playersTabs = ["skaters", "goalies"].includes(tableType);

  const goToPageNumber = (pageNum) => {
    gotoPage(pageNum);
    scrollToTop(position === "bottom");
  }

  const goToNextPage = () => {
    nextPage();
    scrollToTop(position === "bottom");
  }

  const goToPreviousPage = () => {
    previousPage();
    scrollToTop(position === "bottom");
  }

  return (
    <ul className={`pagination ${position} ${extraPadding} ${playersTabs ? 'players-tabs-pagination' : ''}`}>
      {/* <pre>
        <code>
          {JSON.stringify({ pageIndex, pageCount, canNextPage, canPreviousPage}, null, 2)}
        </code>
      </pre> */}
      <li className="pagination-arrows">
        <div
          className={`page-item ${scrollLeftClass}`}
          onClick={() => goToPageNumber(0)}
          disabled={!canPreviousPage}
        >
          <span className="page-link page-first">First</span>
        </div>
        <div
          className={`page-item ${scrollLeftClass}`}
          onClick={() => goToPreviousPage()}
          disabled={!canPreviousPage}
        >
          <span className="page-link">{"<"}</span>
        </div>
        {showCurrentRoundButton && (
          <div
            className={`page-item ${currentRoundClass}`}
            onClick={() => goToPageNumber(currentRound)}
            disabled={pageIndex === currentRound}
          >
            <span className="page-link">
              <span className="current-round-button">current round</span>
            </span>
          </div>
        )}
        <div className={`page-item ${scrollRightClass}`} onClick={() => canNextPage && goToNextPage()}>
          <span className="page-link">{">"}</span>
        </div>
        <div
          className={`page-item ${scrollRightClass}`}
          onClick={() => canNextPage && goToPageNumber(pageCount - 1)}
        >
          <span className="page-link page-last">Last</span>
        </div>
      </li>
      { pageCount > 0 && (
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
      )}
      { pageCount === 0 && (
        <li />
      )
      }
    </ul>
  );
}
