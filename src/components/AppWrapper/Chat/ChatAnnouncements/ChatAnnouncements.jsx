export const pickUpdatedAnnouncement = (adminName, pickNumber) => JSON.stringify(
	{
		"event": "pickUpdated",
		"message": `The ${adminName} have updated pick ${pickNumber}.`
	}
);

export const playerDraftedAnnouncement = (user, player, position, team) => JSON.stringify(
	{
		"event": "playerDrafted",
		"message": `The ${user} have drafted ${player}, ${position} - ${team}`,
	}
);


