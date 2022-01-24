import React from 'react';

export default function Emoji({emoji}) {
  return (
    <span role='img' aria-label='draft'>
      {emoji}
    </span>
  );
}
