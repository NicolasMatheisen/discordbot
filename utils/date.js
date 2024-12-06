function isDST(date) {
	const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
	const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
	return Math.max(january, july) !== date.getTimezoneOffset();
}

function getStartOfDay(date) {
	let startOfDay;
	if (isDST(date)) {
		startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2, 0, 0);
	}
	else {
		startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0);
	}
	return startOfDay;
}

module.exports = { isDST, getStartOfDay };
