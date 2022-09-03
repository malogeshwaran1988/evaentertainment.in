/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'recording\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-download': '&#xe939;',
		'icon-calendar': '&#xe938;',
		'icon-share': '&#xe93a;',
		'icon-promotion-1': '&#xe900;',
		'icon-audio': '&#xe903;',
		'icon-settings': '&#xe904;',
		'icon-mic': '&#xe905;',
		'icon-promotion': '&#xe906;',
		'icon-interface': '&#xe907;',
		'icon-people': '&#xe913;',
		'icon-travel': '&#xe914;',
		'icon-quaver': '&#xe916;',
		'icon-folded-newspaper': '&#xe917;',
		'icon-picture': '&#xe919;',
		'icon-quotation': '&#xe91b;',
		'icon-telephone': '&#xe91c;',
		'icon-clock': '&#xe91d;',
		'icon-music-headphones': '&#xe91e;',
		'icon-music-cd': '&#xe91f;',
		'icon-music-cd-1': '&#xe920;',
		'icon-music-equalizer': '&#xe924;',
		'icon-mic-2': '&#xe925;',
		'icon-music-equalizer-1': '&#xe926;',
		'icon-play': '&#xe928;',
		'icon-sound': '&#xe929;',
		'icon-social': '&#xe92a;',
		'icon-note': '&#xe92b;',
		'icon-square': '&#xe92c;',
		'icon-mic-3': '&#xe92d;',
		'icon-big-speech-balloon': '&#xe92e;',
		'icon-sky': '&#xe92f;',
		'icon-placeholder-for-map': '&#xe901;',
		'icon-facebook-logo': '&#xe908;',
		'icon-twitter-logo': '&#xe909;',
		'icon-googleplus-logo': '&#xe90a;',
		'icon-linkedin-logo': '&#xe90b;',
		'icon-star': '&#xe90c;',
		'icon-search': '&#xe90d;',
		'icon-plus': '&#xe90e;',
		'icon-remove': '&#xe90f;',
		'icon-three': '&#xe910;',
		'icon-arrow-top': '&#xe921;',
		'icon-arrow-left': '&#xe937;',
		'icon-arrow-right': '&#xe936;',
		'icon-arrow-down': '&#xe911;',
		'icon-left-arrow': '&#xe912;',
		'icon-right-arrow': '&#xe915;',
		'icon-user': '&#xe91a;',
		'icon-play-circle': '&#xe927;',
		'icon-pause-circle': '&#xe902;',
		'icon-next-track': '&#xe918;',
		'icon-prev-track': '&#xe923;',
		'icon-like': '&#xe922;',
		'icon-sound-on': '&#xe930;',
		'icon-bulb': '&#xe931;',
		'icon-mail': '&#xe932;',
		'icon-facebook-logo-lined': '&#xe933;',
		'icon-twitter-logo-lined': '&#xe934;',
		'icon-instagram-logo-lined': '&#xe935;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
