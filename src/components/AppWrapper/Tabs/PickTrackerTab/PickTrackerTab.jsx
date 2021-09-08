import React from 'react';
import './PickTrackerTab.css';

export default function PickTrackerTab() {
  return (
    <iframe
      title='Pick Tracker spreadsheet'
      className='picks-iframe'
      src='https://docs.google.com/spreadsheets/d/e/2PACX-1vQjGUyaVWR-sDOCvWx2Ue6OpRiK2OiN9bgmTRN6Nv4902raikLi06ItB-E6jX4-ImBIGpAk7lZPZfsL/pubhtml?widget=true'
    />
  )
}
