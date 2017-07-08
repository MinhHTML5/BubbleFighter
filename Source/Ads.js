var ADS_PANEL_X = 246;
var ADS_PANEL_Y = 585;
var ADS_PANEL_W = 788;
var ADS_PANEL_H = 150;

var ega_siteWidth = 1024;
var ega_offsetTop = 0;
var ega_offsetLeft = 0;
var ega_offsetRight = 0;
var ega_fixedPosition = 0;
var ega_hideLeft = 1;
var ega_hideRight = 1;

if (ENABLE_ADS == true) {
	document.write("<scr" + "ipt type='text/javascript' src='https://www.epicgameads.com/ads/bannerjs.php?id=uiwRgVdkvB&channel=0&t=ss&sitewidth=" + ega_siteWidth +"&offsettop=" + ega_offsetTop +"&offsetleft=" + ega_offsetLeft + "&offsetright=" + ega_offsetRight + "&fixedposition=" + ega_fixedPosition + "&hideleft=" + ega_hideLeft + "&hideright=" + ega_hideRight + "&cb=" + new Date().getTime() + "'></scri" + "pt>");
}

function CreateAds() {
	if (ENABLE_ADS == true) {
		document.write("<iframe id='banner' src='https://www.epicgameads.com/ads/banneriframe.php?id=uiwRgVdkvB&t=728x90&channel=0&cb=" + (Math.floor(Math.random()*99999) + new Date().getTime()) + "' style='position: absolute; width:728px; height:90px; visibility:hidden; top: 630px; left: 276px;' width='728'; height='90'; frameborder='0' scrolling='no'></iframe>");
	}
}

function ShowAds() {
	if (ENABLE_ADS == true) {
		var banner = document.getElementById("banner");
		banner.style.visibility = "visible";
	}
}

function HideAds() {
	if (ENABLE_ADS == true) {
		var banner = document.getElementById("banner");
		banner.style.visibility = "hidden";
	}
}


if (ENABLE_ADS == true) {
	CreateAds();
}