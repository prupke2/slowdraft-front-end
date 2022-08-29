export const pickUpdatedAnnouncement = ( adminName, pickNumber) => JSON.stringify(
	{
		"event": "pickUpdated",
		"message": `The ${adminName} have updated pick ${pickNumber}.`
	}
);

export const playerDraftedAnnouncement = ( teamName, playerName, playerPosition, playerTeam) => JSON.stringify(
	{
		"event": "playerDrafted",
		"message": `The ${teamName} have drafted ${playerName}, ${playerPosition} - ${playerTeam}`,
	}
);


