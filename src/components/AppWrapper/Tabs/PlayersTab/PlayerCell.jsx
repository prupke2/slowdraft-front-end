import React from 'react';

const PlayerCell = ({cell, draftingNow}) => {
  const takenPlayer = cell.row.original.user !== null ? 'taken-player' : null;
  return (
    <div className='player-name'>
      {cell.row.original.player_id && 
        <div className='player-name-and-headshot'>
          <img className='headshot' src={cell.row.original.headshot} alt='' />
          <span>
            <a
              href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {cell.row.original.prospect === '1' && 
                <span>
                  <span className='prospect' title='Prospect'>P</span>
                  &nbsp;
                </span>
              }
              {cell.row.original.is_keeper === 1 && 
                <span>
                  <span className='keeper' title='Keeper'>K</span>
                  &nbsp;
                </span>
              }
              {cell.value}
            </a>
            { (takenPlayer && !draftingNow) &&
              <div className='small-username'>
                &nbsp;{cell.row.original.user}
              </div>
            }
          </span>
        </div>
      }
      { !cell.row.original.player_id && 
        <span>{cell.value}</span>
      }
    </div>
  );
}

export default PlayerCell;
