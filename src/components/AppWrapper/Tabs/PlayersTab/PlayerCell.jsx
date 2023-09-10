import React from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
// import { offsetMilliseconds } from "../../../../util/requests";

const PlayerCell = ({ cell, playerListPage }) => {
  const takenPlayer = cell.row.original.user !== null;
  const teamKey = cell.row.original.team_key;
  const ir = cell.row.original.ir;

  return (
    <div className={`player-name newPick`}>
      {cell.row.original.player_id && (
        <div className="player-name-and-headshot">
          <img className="headshot" src={cell.row.original.headshot} alt="" />
          <span>
            {ir && <span className='ir'>{ir}</span>}
            <a
              href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cell.row.original.prospect === 1 && (
                <span>
                  <span className="prospect" title="Prospect">
                    P
                  </span>
                  &nbsp;
                </span>
              )}
              {cell.row.original.is_keeper === 1 && (
                <span>
                  <span className="keeper" title="Keeper">
                    K
                  </span>
                  &nbsp;
                </span>
              )}
              {cell.value}
            </a>
            {(takenPlayer && playerListPage) && (
              <UsernameStyled
                username={cell.row.original.user}
                teamKey={teamKey}
                color={"black"}
                small={true}
              />
            )}
          </span>
        </div>
      )}
      {!cell.row.original.player_id && <span>{cell.value}</span>}
    </div>
  );
};

export default PlayerCell;
