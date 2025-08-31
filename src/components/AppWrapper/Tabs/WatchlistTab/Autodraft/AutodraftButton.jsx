import React from "react";
import Emoji from "../../../Emoji";
import { useState } from "react";
import { toggleAutodraft } from "../../../../../util/requests";
// import "./WatchlistTab.css";
import toast from "react-hot-toast";

const AutodraftButton = ({ cell, setWatchlist, largerIcon, setAutodraftTableRows, showToastOnAutodraft=false }) => {
	let autodrafted = false;
	const playerId = cell.row.original.player_id;
	const playerName = cell.row.original.name || 'Player';
	const watchListIdsLocalStorage = JSON.parse(localStorage.getItem('watchlist'));
	if (watchListIdsLocalStorage) {
		autodrafted = watchListIdsLocalStorage?.autodraft?.includes(playerId);
	}
	const [isAutodrafted, setIsAutodrafted] = useState(autodrafted);

	const toggleAutodrafted = () => {
		const action = isAutodrafted ? 'remove' : 'add';
		try {
			setIsAutodrafted(!isAutodrafted);
			const newPlayerList = action === 'remove' ? [ ...watchListIdsLocalStorage?.players, playerId]
				: watchListIdsLocalStorage?.players.filter(p => p !== playerId);

			console.log('newPlayerList: ', newPlayerList);
			
			const newAutodraftList = action === 'add' ? [ ...watchListIdsLocalStorage?.autodraft, playerId]
				: watchListIdsLocalStorage?.autodraft.filter(p => p !== playerId);
			
			console.log('newAutodraftList: ', newAutodraftList);
			
			const newWatchlist = {
				players: newPlayerList,
				autodraft: newAutodraftList,
			}
			if (setWatchlist) {
				console.log('SETTING newWatchlist: ', newWatchlist);
				
				setWatchlist(newWatchlist);
			}
			localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      toggleAutodraft(playerId, action);
			const actionVerbiage = action === 'add' ? 'added to' : 'removed from';
			if (showToastOnAutodraft) {
				toast.success(`${playerName} ${actionVerbiage} autodraft list.`);
			}
		} catch {
			setIsAutodrafted(!isAutodrafted);
			const actionVerbiage = action === 'add' ? 'adding player to' : 'removing player from';
			toast.error(`Error ${actionVerbiage} autodraft list.`);
		}
	}

	const autodraftButtonClasses = largerIcon ? 'watchlist-wrapper close-modal' : 'watchlist-wrapper';

	const onClickHandler = () => {
		toggleAutodrafted();
		if (setAutodraftTableRows) {
			setAutodraftTableRows(prevRows => {
				const updatedRows = prevRows.map(row => {
					if (row.original.player_id === playerId) {
						return {
							...row,
							isAutodrafted: !isAutodrafted,
						};
					}
					return row;
				});
				return updatedRows;
			});
		}
		// if (setWatchlist) {
		// 	const newAutodraftList = isAutodrafted ? watchListIdsLocalStorage?.autodraft.filter(p => p !== playerId)
		// 		: [ ...watchListIdsLocalStorage?.autodraft, playerId];
		// 	const newWatchlist = {
		// 		...watchListIdsLocalStorage,
		// 		autodraft: newAutodraftList,
		// 	};
		// 	setWatchlist(newWatchlist);
		// 	localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
		// }
	}

  return isAutodrafted ? (
		<button
			className={autodraftButtonClasses}
      title="Remove from autodraft list"
			onClick={onClickHandler}
		>
			<Emoji emoji="❌" />
		</button>
  ) : (
		<button 
			className='watchlist-wrapper'
			title="Add to autodraft list"
			onClick={onClickHandler}
		>
			<Emoji emoji="✅" />
		</button>
	);
}

export default AutodraftButton;
