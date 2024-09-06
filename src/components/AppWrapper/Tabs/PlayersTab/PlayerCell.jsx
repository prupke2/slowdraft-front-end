import React from "react";
import UsernameStyled from "../../UsernameStyled/UsernameStyled";
import WatchlistButton from "../WatchlistTab/WatchlistButton";
import emptyHeadshot from "../../../../assets/emptyHeadshot.png";
// import { offsetMilliseconds } from "../../../../util/requests";

const PlayerCell = ({ cell, showWatchlist }) => {
  const takenPlayer = cell.row.original.user !== null;
  const teamKey = cell.row.original.team_key;
  const ir = cell.row.original.ir;
  const headshot = cell.row.original.headshot;
  const noHeadshot = headshot === "https://s.yimg.com/iu/api/res/1.2/TcM85WhJ.fAOHWf2QKLjIw--~C/YXBwaWQ9eXNwb3J0cztjaD0yMDA7Y3I9MTtjdz0xNTM7ZHg9NzQ7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/dh/ap/default/140828/silhouette@2x.png";

  return (
    <div className={`player-name newPick`}>
      {cell.row.original.player_id && (
        <div className="player-name-and-headshot">
          {showWatchlist && <WatchlistButton cell={cell} /> }
          <img className="headshot" src={noHeadshot ? emptyHeadshot : headshot} alt="" />
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
            {(takenPlayer && showWatchlist) && (
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
