import React from "react";
import Emoji from "../../../Emoji";
import { useState } from "react";
import { toggleAutodraft } from "../../../../../util/requests";
// import "./WatchlistTab.css";
// import toast from "react-hot-toast";

const AutodraftButton = ({ cell, setWatchlist }) => {
	let autodrafted = false;
	const playerId = cell.row.original.player_id;
	const watchListIdsLocalStorage = JSON.parse(localStorage.getItem('watchlist'));
	if (watchListIdsLocalStorage) {
		autodrafted = watchListIdsLocalStorage?.autodraft?.includes(playerId);
	}
	const [isAutodrafted, setIsAutodrafted] = useState(autodrafted);

	const toggleAutodrafted = () => {
		const action = isAutodrafted ? 'remove' : 'add';
		// try {
			setIsAutodrafted(!isAutodrafted);
			const newPlayerList = isAutodrafted ? [ ...watchListIdsLocalStorage?.players, playerId]
			: watchListIdsLocalStorage?.players.filter(p => p !== playerId);

			console.log('newPlayerList: ', newPlayerList);
			
			const newAutodraftList = !isAutodrafted ? [ ...watchListIdsLocalStorage?.autodraft, playerId]
				: watchListIdsLocalStorage?.autodraft.filter(p => p !== playerId);
			
			console.log('newAutodraftList: ', newAutodraftList);
			
			const newWatchlist = {
				players: newPlayerList,
				autodraft: newAutodraftList,
			}
			setWatchlist(newWatchlist);
			localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      toggleAutodraft(playerId, action);
		// } catch {
		// 	setIsAutodrafted(!isAutodrafted);
    //   const error = isAutodrafted ? 'Error removing player from autodraft.'
    //     : 'Error adding player to autodraft.';
		// 	toast.error(error);
		// }
	} 

  return isAutodrafted ? (
		<button
			className="remove-autodraft"
      title="Remove from autodraft list"
			onClick={toggleAutodrafted}
		>
				x
		</button>
  ) : (
		<button 
			className='watchlist-wrapper'
			title="Add to autodraft list"
			onClick={toggleAutodrafted}
		>
			<Emoji emoji="⏭️" />
		</button>
	);
}

export default AutodraftButton;
