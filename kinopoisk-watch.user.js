// ==UserScript==
// @name		Kinopoisk Watch (Alternative)
// @namespace	kinopoisk-watch-alternative
// @author		Zeeit241
// @description Watch films on Kinopoisk.ru for free! Alternative version of the script, with a temporary link to the player. Based on https://github.com/Kirlovon/Kinopoisk-Watch
// @icon		https://github.com/Kirlovon/Kinopoisk-Watch/raw/master/website/favicon.png
// @version		1.5.0
// @match		*://www.kinopoisk.ru/*
// @grant		none
// @run-at		document-end
// ==/UserScript==

const BANNER_ID = 'kinopoisk-watch-alternative';
const WATCH_LINK = 'https://freekp.ru/film.php';
const MOVIE_TYPES = ['film', 'series'];


let lastUrl = '/';

/**
 * Add banner element to the page
 */
function mountButton() {
	const btn = document.createElement('div');
	const arrow = document.createElement('div');
	arrow.style.display = "inline-block"
	arrow.style.width = "24px"
	arrow.style.height = "24px"
	arrow.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg%20width='24'%20height='24'%20xmlns='http://www.w3.org/2000/svg'%20fill='%23fff'%3E%3Cpath%20d='M6%203.375%2021%2012%206%2020.625V3.375Z'/%3E%3C/svg%3E")`
	arrow.style.backgroundRepeat="no-repeat"
	arrow.style.backgroundPosition="50%"
	arrow.style.marginRight = "1rem"
	btn.id = BANNER_ID;
	btn.style.padding = "1.4rem 2.6rem 1.4rem 2.2rem";
	btn.style.background = "linear-gradient(90deg,#ff5c4d,#eb469f 26.56%,#8341ef 75%,#3f68f9)"
	btn.style.fontFamily = "Graphik Kinopoisk LC Web,Tahoma,Arial,Verdana,sans-serif"
	btn.style.fontSize = "16px"
	btn.style.color = "#fff"
	btn.style.cursor = "pointer"
	btn.style.display = "flex"
	btn.style.alignItems = "center"
	btn.style.fontWeight="bold"
	btn.style.lineHeight = "normal"
	btn.style.fontSmoothing = "antialiased"
	btn.style.borderRadius="50px"
	btn.style.border = "none"
	btn.style.marginRight="8px"
	btn.style.transition="0.2s ease-in-out"
	btn.innerText = `Смотреть`;
	btn.prepend(arrow);
	setTimeout(() => {
		btn.addEventListener("mouseover", () => btn.style.scale = "1.05");
		btn.addEventListener("mouseout", () => btn.style.scale = "1");
	}, 100);
	document.querySelector(`.styles_buttonsContainer__HREZO`).prepend(btn);
	console.log("BUTTON MOUNTED")
}

/**
 * Edit button on pages with kinopoisk sub
 */

function editButton(link) {
	const off_btn = document.querySelector(".kinopoisk-watch-online-button");
	off_btn.onclick = null
	off_btn.addEventListener("click", () => window.open(link.toString(), '_blank').focus());
}

/**
 * Open player
 */
function openPlayer(id) {
	const link = new URL(WATCH_LINK);
	if (id) link.searchParams.set('id', id);

	window.open(link.toString(), '_blank').focus();
}

/**
 * Remove banner element from the page
 */
function unmountButton() {
	const button = document.getElementById(BANNER_ID);
	if (button) button.remove();
}

/**
 * Process & update banner depending on the current page state
 */
function updateBanner() {
	const url = location.href;

	// Skip if the same url
	if (url === lastUrl) return;
	lastUrl = url;

	const banner = document.getElementById(BANNER_ID);
	const off_btn = document.querySelector(".kinopoisk-watch-online-button");
	const urlData = url.split('/');
	const movieId = urlData[4];
	const movieType = urlData[3];
	const link = new URL(WATCH_LINK);
	link.searchParams.set('id', movieId);
	// Unmount if link is invalid
	if (!movieId || !movieType || !MOVIE_TYPES.includes(movieType)) {
		if (banner) unmountButton();
	} else {
		if(off_btn){
			return editButton(link);
		}

		if (!banner){
			setTimeout(async ()=>{
				mountButton();

				document.getElementById(BANNER_ID).addEventListener("click", () =>window.open(link.toString(), '_blank').focus());
			}, 200)
		}


	}
}

/**
 * Script initialization
 */
function init() {
	// Listen for the Url changes
	const observer = new MutationObserver(() => updateBanner());
	observer.observe(document, { subtree: true, childList: true });

	// Initialize
	updateBanner();
	console.log('Kinopoisk Watch started! 🎥');
}

init();
