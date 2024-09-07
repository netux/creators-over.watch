function parseDate(input: string) {
	const date = new Date(input);
	return date.toString() !== "Invalid Date" ? date : null;
}

// Extraction
export const LAST_BIG_UPDATE_DATE = parseDate(import.meta.env.PUBLIC_LAST_BIG_UPDATE_TIMESTAMP)!;
export const LAST_OKAY_UPDATE_DATE = parseDate(import.meta.env.PUBLIC_LAST_OKAY_UPDATE_TIMESTAMP);

export const FOOTER_BANNER_TEXT = import.meta.env.PUBLIC_FOOTER_BANNER_TEXT?.toString();

// Validation
if (!LAST_BIG_UPDATE_DATE) {
	throw new Error("Missing LAST_BIG_UPDATE_TIMESTAMP env variable");
}
