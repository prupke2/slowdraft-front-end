export const pickUpdatedAnnouncement = (adminName, pickNumber) => ({
		event: "pickUpdated",
		message: `The ${adminName} have updated pick ${pickNumber}.`
});

export const playerDraftedAnnouncement = (user, player, position, team) => ({
	event: "playerDrafted",
	message: `The ${user} have drafted ${player}, ${position} - ${team}`,
});

export const publishToChat = (channel, user, message) => {
	const msg = typeof(message) === "string" ? { message } : message; 
	return (
		channel.publish(
			user.team_name,
			{
				...msg,
				teamKey: user.team_key,
				color: user.color,
			}
		)
	)
}
