import {
	SET_CURRENT_PICK, SET_DRAFTING_NOW, SET_TRADES
} from './actions';

export function reducer(
	state = {
		currentPick: { user_id: null },
		draftingNow: { user_id: null },
		trades: null,
	},
	action
) {
	switch (action.type) {
		case SET_CURRENT_PICK:
			return {
				...state,
				draft: action.payload,
			};
		case SET_DRAFTING_NOW:
			return {
				...state,
				teams: action.payload.teams,
			};
		case SET_TRADES:
			return {
				...state,
				trades: action.payload.trades,
			};
		default:
			return state;
	}
}
