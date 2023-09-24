
import React from "react";
import Emoji from "../../Emoji";
import { useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "../../../../util/requests";
import "./WatchlistTab.css";

const WatchlistButton = ({ cell }) => {
	let watched = false;
	const playerId = cell.row.original.player_id;
	const watchListIdsLocalStorage = JSON.parse(localStorage.getItem('watchlist'));
	if (watchListIdsLocalStorage) {
		watched = watchListIdsLocalStorage.includes(playerId);
	} 

	const [isWatched, setIsWatched] = useState(watched);

	const watchedEmoji = isWatched ? '⭐' : '★';
	const watchedTitle = isWatched ? 'Remove from watchlist' : 'Add to watchlist';
	const onClickHandler = () => {
		try {
			if (isWatched) {
				removeFromWatchlist(playerId);
			} else {
				addToWatchlist(playerId);
			}
			setIsWatched(!isWatched);
		} catch {
			console.log("Error updating watchlist.")
		}
	} 

  return (
		<button 
			className='watchlist-wrapper'
			title={watchedTitle}
			onClick={onClickHandler}
		>
			<Emoji emoji={watchedEmoji} />
		</button>
	);
}

export default WatchlistButton;
