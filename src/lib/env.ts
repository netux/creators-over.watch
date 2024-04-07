function parseDate(input: string) {
	const date = new Date(input);
	return date.toString() !== "Invalid Date" ? date : null;
}

export const LAST_BIG_UPDATE_TIMESTAMP = parseDate(import.meta.env.PUBLIC_LAST_BIG_UPDATE_TIMESTAMP)!;
export const LAST_OKAY_UPDATE_TIMESTAMP = parseDate(import.meta.env.PUBLIC_LAST_OKAY_UPDATE_TIMESTAMP);

if (!LAST_BIG_UPDATE_TIMESTAMP) {
	throw new Error("Missing LAST_BIG_UPDATE_TIMESTAMP env variable");
}
