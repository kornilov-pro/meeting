function redirectToLogin() {
	var currentURL = location.origin + location.pathname;
	var loginURL = new URL(CONFIG.login_url);
	loginURL.searchParams.append(CONFIG.redirect_url_param_name, currentURL);
	window.location.replace(loginURL);
}
