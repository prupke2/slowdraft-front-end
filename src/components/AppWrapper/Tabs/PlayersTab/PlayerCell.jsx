import React from "react";
// import { offsetMilliseconds } from "../../../../util/requests";

const PlayerCell = ({ cell, draftingNow }) => {
  const takenPlayer = cell.row.original.user !== null;
  // const now = new Date();
  // console.log(`timestamp: ${timestamp}`);
  // console.log(`new Date(timestamp - 10000): ${new Date(Date.parse(timestamp) - offsetMilliseconds - 100000)}`);
  // console.log(`now: ${now}`);
  // console.log(`timestamp && new Date(timestamp - 10000) < now: ${timestamp && new Date(Date.parse(timestamp) - 10000) < now}`);

  // const newPick = timestamp && new Date(Date.parse(timestamp) - offsetMilliseconds) > now ? 'newPick' : null;
  // // console.log(`now: ${now}`);
  // // console.log(`timestamp: ${timestamp}`);
  // console.log(`newPick: ${newPick}`);


  return (
    <div className={`player-name newPick`}>
      {cell.row.original.player_id && (
        <div className="player-name-and-headshot">
          <img className="headshot" src={cell.row.original.headshot} alt="" />
          <span>
            <a
              href={`https://sports.yahoo.com/nhl/players/${cell.row.original.player_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cell.row.original.prospect === "1" && (
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
            {takenPlayer && !draftingNow && (
              <div className="small-username">
                &nbsp;{cell.row.original.user}
              </div>
            )}
          </span>
        </div>
      )}
      {!cell.row.original.player_id && <span>{cell.value}</span>}
    </div>
  );
};

export default PlayerCell;
