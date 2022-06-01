import {
	SET_DRAFT, SET_TEAMS, SET_POSTS, SET_RULES, SET_TRADES 
} from './actions';

export function reducer(
	state = {
		currentPick: { user_id: null },
		draftingNow: { user_id: null },
		picks: null,
		teams: null,
		posts: null,
		rules: null,
		trades: null,
	},
	action
) {
	switch (action.type) {
		case SET_DRAFT:
			return {
				...state,
				draft: action.payload,
			};
		case SET_TEAMS:
			return {
				...state,
				teams: action.payload.teams,
			};
		case SET_POSTS:
			return {
				...state,
				posts: action.payload.posts,
			};
		case SET_RULES:
			return {
				...state,
				rules: action.payload.rules,
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
