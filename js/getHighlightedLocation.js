/**
 *
 * @returns {Promise<string>}
 */
async function getHighlightedLocation() {
	return new URL(window.location).searchParams.get(CONFIG.highlight_location_url_param_name) ?? "";
}
