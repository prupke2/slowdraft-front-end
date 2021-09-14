import React, { useEffect, useState } from 'react';
import './PickTrackerTab.css';
import Loading from '../../../Loading/Loading';

export default function PickTrackerTab() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(function () {
      setIsLoading(false);
    }, 1000)
  }, []);

  return (
    <>
      { isLoading && (
        <Loading 
          absolute={true} 
        />
      ) }
      <iframe
        title='Pick Tracker spreadsheet'
        id='picks-iframe'
        src='https://docs.google.com/spreadsheets/d/e/2PACX-1vQjGUyaVWR-sDOCvWx2Ue6OpRiK2OiN9bgmTRN6Nv4902raikLi06ItB-E6jX4-ImBIGpAk7lZPZfsL/pubhtml?widget=true'
      />
    </>
  )
}
