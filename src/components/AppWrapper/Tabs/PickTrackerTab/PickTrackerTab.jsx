import React, { useEffect, useState } from "react";
import "./PickTrackerTab.css";
import Loading from "../../../Loading/Loading";
import { API_URL, getHeaders } from "../../../../util/util";

export default function PickTrackerTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [docURL, setDocURL] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!docURL) {
      try {
        fetch(`${API_URL}/get_doc_url`, {
          method: "GET",
          headers: getHeaders(),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success === false) {
              setError(data.error);
            } else {
              setDocURL(data.url);
            }
          });
        }
      catch (err) {
        setError(err);
        console.log('Error fetching doc URL:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [docURL]);

  return (
    <div className="pick-tracker-wrapper">
      {isLoading && <Loading absolute={true} />}
      {error && <div className="error">Error loading spreadsheet: {error}</div>}
      {docURL && !isLoading && (
        <iframe
          title="Pick Tracker spreadsheet"
          id="picks-iframe"
          src={docURL}
        />
      )}
    </div>
  );
}
