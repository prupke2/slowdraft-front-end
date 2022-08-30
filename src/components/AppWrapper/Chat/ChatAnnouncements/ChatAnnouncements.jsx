export const pickUpdatedAnnouncement = ( adminName, pickNumber) => JSON.stringify(
	{
		"event": "pickUpdated",
		"message": `The ${adminName} have updated pick ${pickNumber}.`
	}
);

export const playerDraftedAnnouncement = ( user, data) => JSON.stringify(
	{
		"event": "playerDrafted",
		"message": `The ${user} have drafted ${data.name}, ${data.position} - ${data.team}`,
	}
);


