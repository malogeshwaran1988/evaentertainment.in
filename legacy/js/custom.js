(function ($) {

	"use strict";

	var $document = $(document),
		$window = $(window),
		// Template options
		themeOptions = {
			stickyHeader: true, // sticky header enable (set 'false' for disable)
			smoothScroll: false, // smooth scroll enable (set 'false' for disable)
			backToTop: true // back to top button enable (set 'false' for disable)
		},
		// Google map options
		googleMapOption = {
			latitude: 19.136326,
			longitude: 72.827660,
			zoom: 13 // map zoom value
		},
		// Template Blocks
		themeBlocks = {
			mainSlider: $('#mainSlider'),
			studioSlider: $('.ini-studio-gallery'),
			projectSlider: $('.ini-project-slider'),
			reviewsSlider: $('.ini-reviews-slider'),
			teamSlider: $('.ini-team-slider-mobile'), // home page
			teamSlider2: $('.ini-team-slider'), // about page
			newsSlider: $('.ini-news-slider-mobile'),
			postSingleSlider: $('.ini-post-slider'),
			stickyHeader: $('.header--sticky'),
			ourClientSlider: $('.ini-client-slider'),
			googleMap: $('#googleMap'),
			newsTicker: $(".tickerwrapper")
		};

	/* ---------------------------------------------
		Scripts initialization
	--------------------------------------------- */
	$document.ready(function () {
		var windowWidth = window.innerWidth || $window.width();
		var windowH = $window.height();
		studioSlider();
		projectSlider();
		reviewsSlider();
		teamSlider2();
		mainSlider();
		postSingleSlider();
		ourClientSlider();
		iniPlayer();
		headerSearch();
		textSlider();
		mobileMenu(windowWidth);
		allViewMobile();
		formAddRow();
		iniPopup();
		instaFeed();
		filtersGrid();
		filtersBlogGrid();
		filterClient();
		//newsTicker();
		backToTop('.ini-backToTop', themeOptions.backToTop);
		if (themeOptions.smoothScroll) {
			$('html').scrollWithEase();
		}
		if (windowWidth < 769) {
			slickMobile(themeBlocks.teamSlider, 768, 1, 1);
			slickMobile(themeBlocks.newsSlider, 992, 2, 1);
		}
		if (themeOptions.stickyHeader) {
			$(themeBlocks.stickyHeader).stickyHeader();
		}
		if (themeBlocks.googleMap.length) {
			createMap('googleMap', googleMapOption.zoom, googleMapOption.latitude, googleMapOption.longitude);
		}
		if ($("#tableFix").length) {
			$("#tableFix").tableHeadFixer({"head" : false, "left" : 1});
		}
		setTimeout(function () {
			$('body').addClass('is-loaded');
		}, 1000);
		
		// Resize window events
		$window.on('resize', function () {
			var windowWidth = window.innerWidth || $window.width();
			if (windowWidth < 769) {
				slickMobile(themeBlocks.teamSlider, 768, 1, 1);
				slickMobile(themeBlocks.newsSlider, 992, 2, 1);
			}
		});
		$(window).on('resize', debouncer(function (e) {
			var windowWidth = window.innerWidth || $window.width();
			if (themeOptions.stickyHeader) {
				$(themeBlocks.stickyHeader).stickyHeader();
			}
		}));
	});
	$window.on('load', function () {
		var windowWidth = window.innerWidth || $window.width();
		$('body').addClass('is-loaded');
	});

	/* ---------------------------------------------
		Functions
	--------------------------------------------- */
	// time out resize
	function debouncer(func, timeout) {
		var timeoutID,
			timeout = timeout || 500;
		return function () {
			var scope = this,
				args = arguments;
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function () {
				func.apply(scope, Array.prototype.slice.call(args));
			}, timeout);
		};
	}
	
	// magnific popup
	function iniPopup() {
		$('.open-popup-link').magnificPopup({
			type: 'inline',
			removalDelay: 500,
			callbacks: {
				beforeOpen: function () {
					this.st.mainClass = this.st.el.attr('data-effect');
					$('header').css({
						'width': $('header').outerWidth() + 'px'
					});
					$('body').addClass('mfp-is-open');
				},
				close: function () {
					$('body').removeClass('mfp-is-open');
					$('header').css({
						'width': ''
					});
				}
			}
		});
		$('.open-popup-image').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true
			}
		});
	}
	
	// filters projects/gallery
	function filtersGrid() {
		var filtr,
			$filterList = $('.filtr-row li'),
			$filterContainer = $('.filtr-container'),
			$showMore = $('.filtr-showmore');
		if ($filterContainer.length) {
			$filterList.on('click', function () {
				$filterList.removeClass('active');
				$(this).addClass('active');
			});
			$filterContainer.imagesLoaded(function () {
				filtr = $filterContainer.filterizr('setOptions', {
					delay: 50,
					delayMode: 'progressive',
					layout: 'sameSize'
				});
				$filterContainer.addClass('is-loaded');
			});
			$showMore.on('click', function (e) {
				e.preventDefault();
				var toAppend = $('.more-content').children();
				filtr._fltr.appendToGallery(toAppend);
				$(this).hide();
			});
		}
	}
	
	// filters blog grid
	function filtersBlogGrid() {
		var $filterContainer = $('.blog-grid');
		if ($filterContainer.length) {
			var filtr = $filterContainer.imagesLoaded(function () {
				$filterContainer.filterizr('setOptions', {layout: 'sameWidth'});
				$window.resize();
			})
		}
	}
	
	// filter client list
	function filterClient(){
		var $clientitem = $(".clients-list-column > li"),
			$filter = $(".simple-filter > li"),
			selectedCategory = "",
			activeStart;
		$filter.each(function() {
			selectedCategory = $(this).attr("data-filter");
			if ($(this).hasClass('active')){
				console.log(selectedCategory)
				$clientitem.filter(':not('+selectedCategory+')').fadeOut(0).removeClass('isvisible');
				activeStart = true;
			}
			else {
				$clientitem.fadeIn(0).addClass('isvisible');
			}
		});
		if (!activeStart)  $(".client-filter li:first-child").addClass('active');
		$filter.on('click',function(e){
			e.preventDefault();
			if ($(this).hasClass('active')){
				return false;
			}
			else {
				$filter.removeClass('active');
				$(this).addClass('active')
			}
			selectedCategory = $(this).attr("data-filter");
			 if(!selectedCategory){
				$clientitem.fadeIn(0).addClass('isvisible');
			 } else {
				$clientitem.filter(':not('+selectedCategory+')').fadeOut(0).removeClass('isvisible');
				$clientitem.filter(selectedCategory).fadeIn(0).addClass('isvisible');
			 }
		});
	}

	// booking form add row button
	function formAddRow() {
		$("#btnAddRow").on("click", function (e) {
			e.preventDefault();
			var div = $("<div />");
			div.html(GetDynamicTextBox(""));
			$("#rowMiltipleBooking").append(div);
		});
		$("body").on("click", ".remove-btn", function (e) {
			e.preventDefault();
			$(this).closest(".form-row").remove();
		});
		function GetDynamicTextBox(value) {
			return '<div class="form-row"><div class="btn-place"></div><div class="form-group sm-full"><div class="select-wrapper"><select name="service" class="input-custom"><option value="1">Language Dubbing</option><option value="2">Subtitling</option><option value="3">Audio Description</option><option value="4">Engineering</option></select></div></div><div class="form-group"><div class="select-wrapper"><select name="hours" class="input-custom"><option value="1">1 Hour</option><option value="2">2 Hour</option><option value="3">4 Hour</option><option value="4">6 Hour</option></select></div></div><div class="form-group"><div class="datetimepicker-wrap"><input type="text" name="date" class="form-control input-custom datetimepicker" placeholder=""></div></div><div class="btn-place"><a href="#" class="remove-btn">-</a></div></div>'
		}
	}
	
	// mobile collapsed text
	function allViewMobile() {
		$("[data-show-xs]").on('click', function (e) {
			e.preventDefault();
			$('.' + $(this).attr('data-show-xs')).each(function () {
				$(this).toggleClass('collapsed-xs');
			})
			$(this).hide();
		})
		$("[data-show-sm]").on('click', function (e) {
			e.preventDefault();
			$('.' + $(this).attr('data-show-sm')).each(function () {
				$(this).toggleClass('collapsed-sm');
			})
			$(this).hide();
		})
	}
	
	// Mobile Only Slider
	function slickMobile(slider, breakpoint, slidesToShow, slidesToScroll) {
		if (slider.length) {
			var windowWidth = window.innerWidth || $window.width();
			if (windowWidth < breakpoint) {
				slider.slick({
					mobileFirst: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					autoplay: true,
					autoplaySpeed: 3000,
					arrows: false,
					dots: true,
					responsive: [{
						breakpoint: 767,
						settings: {
							slidesToShow: slidesToShow,
							slidesToScroll: slidesToScroll
						}
					},{
						breakpoint: (breakpoint - 1),
						settings: "unslick"
					}]
				});
			}
		}
	}
	
	// sticky header
	$.fn.stickyHeader = function () {
		var $header = this,
			$body = $('body'),
			headerOffset = $header.find('.header-wrap').height() + 50;
		var windowWidth = window.innerWidth || $window.width();

		$(window).scroll(function () {
			var st = getCurrentScroll();
			if (st > headerOffset) {
				$header.addClass('is-sticky');
				$body.addClass('hdr-sticky');
			} else {
				$header.removeClass('is-sticky');
				$body.removeClass('hdr-sticky');
			}
		});
		$(window).scroll();
		
		function getCurrentScroll() {
			return window.pageYOffset || document.documentElement.scrollTop;
		}
	};
	
	// studio Slider
	function studioSlider() {
		if (themeBlocks.studioSlider.length) {
			themeBlocks.studioSlider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				dots: false,
				arrows: true,
				centerMode: true,
				centerPadding: '28.4%',
				autoplay: true,
				autoplaySpeed: 3000,
				speed: 400,
				cssEase: 'ease-in-out',
				responsive: [{
					breakpoint: 992,
					settings: {
						centerPadding: '10%',
						arrows: false,
						dots: true
					}
				},{
					breakpoint: 480,
					settings: {
						centerPadding: '0',
						arrows: false,
						dots: true
					}
				}]
			})
		}
	}
	
	// arrow pos for project slider
	function changeArrowPos(slider) {
		var $slider = slider,
			toppos = ($('.slick-active', $slider).find("img").height() / 2);
			$('.slick-prev, .slick-next', $slider).css('top', toppos + 'px');
	}
	
	// project Slider
	function projectSlider() {
		if (themeBlocks.projectSlider.length) {
			var $el = themeBlocks.projectSlider;
			$el.imagesLoaded(function () {changeArrowPos($el)});
			$(window).on('resize', debouncer(function (e) {
				changeArrowPos($el)
			}));
			$el.on('init', function () {
				changeArrowPos($el)
			});
			$el.slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				dots: false,
				arrows: true,
				speed: 400,
				autoplay: true,
				autoplaySpeed: 4000,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						dots: true,
						arrows: false
					}
				}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						dots: true,
						arrows: false
					}
				}]
			})
		}
	}
	
	// client Slider
	function ourClientSlider() {
		if (themeBlocks.ourClientSlider.length) {
			var $el = themeBlocks.ourClientSlider;
			$el.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				dots: false,
				arrows: true,
				speed: 400,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						dots: true,
						arrows: false,
						autoplay: true,
						autoplaySpeed: 3000
					}
				}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						dots: true,
						arrows: false,
						autoplay: true,
						autoplaySpeed: 3000
					}
				}]
			})
		}
	}
	
	// post Single Slider
	function postSingleSlider() {
		if (themeBlocks.postSingleSlider.length) {
			themeBlocks.postSingleSlider.slick({
				mobileFirst: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				autoplay: false,
				arrows: true,
				dots: true
			});
		}
	}
	// reviews Slider
	function reviewsSlider() {
		if (themeBlocks.reviewsSlider.length) {
			themeBlocks.reviewsSlider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				dots: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: 3000
			})
		}
	}

	// team Slider (about page)
	function teamSlider2() {
		if (themeBlocks.teamSlider2.length) {
			themeBlocks.teamSlider2.slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				dots: false,
				arrows: true,
				autoplay: true,
				autoplaySpeed: 3000,
				responsive: [{
					breakpoint: 1399,
					settings: {
						arrows: false,
						dots: true
					}
					}, {
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						dots: true
					}
					}, {
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						dots: true
					}
				}]
			})
		}
	}
	
	// instagram feed
	function instaFeed() {
		if ($("#instafeed").length) {
			var userFeed = new Instafeed({
				get: 'user',
				userId: 'self',
				template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
				accessToken: '3483630941.1677ed0.66c4618b32444ac08a70cb2fe84c1bf8',
				limit: 9,
				resolution: 'low_resolution',
				sortBy: 'most-recent'
			});
			userFeed.run();
		}
	}

	// main slider
	function mainSlider() {
		if (themeBlocks.mainSlider.length) {
			var $el = themeBlocks.mainSlider;
			$el.find('.slide').first().imagesLoaded({
				background: true
			}, function () {
				$('.mainSliderWrapper .loader-wrapper').addClass('disable');
			});
			$el.on('init', function (e, slick) {
				var $firstAnimatingElements = $('div.slide:first-child').find('[data-animation]');
				doAnimations($firstAnimatingElements);
			});
			$el.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
				var $currentSlide = $('div.slide[data-slick-index="' + nextSlide + '"]');
				var $animatingElements = $currentSlide.find('[data-animation]');
				doAnimations($animatingElements);
			});
			$el.slick({
				arrows: true,
				dots: true,
				autoplay: true,
				autoplaySpeed: 7000,
				fade: true,
				speed: 1000,
				pauseOnHover: false,
				pauseOnDotsHover: true,
				responsive: [{
					breakpoint: 1399,
					settings: {
						arrows: false
					}
				},{
					breakpoint: 1025,
					settings: {
						dots: false,
						arrows: false
					}
				}]
			});
		}
	}

	// text slider
	function textSlider() {
		var animationDelay = 2500,
			lettersDelay = 50;
		initHeadline();
		function initHeadline() {
			singleLetters($('.cd-headline').find('li'));
			animateHeadline($('.cd-headline'));
		}
		function singleLetters($words) {
			$words.each(function () {
				var word = $(this),
					letters = word.text().split(''),
					selected = word.hasClass('is-visible');
				var i, l;
				for (i = 0, l = letters.length; i < l; i++) {
					letters[i] = '<em>' + letters[i] + '</em>';
					letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
				}
				var newLetters = letters.join('');
				word.html(newLetters);
			});
		}
		function animateHeadline($headlines) {
			var duration = animationDelay;
			$headlines.each(function () {
				var headline = $(this);
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 5;
				spanWrapper.css('width', newWidth);
				setTimeout(function () {
					hideWord(headline.find('.is-visible').eq(0))
				}, duration);
			});
		}
		function hideWord($word) {
			var nextWord = takeNext($word);
			if ($word.parents('.cd-headline').hasClass('letters')) {
				var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
				hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
				showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
			} else {
				switchWord($word, nextWord);
				setTimeout(function () {
					hideWord(nextWord)
				}, animationDelay);
			}
		}
		function hideLetter($letter, $word, $bool, $duration) {
			$letter.removeClass('in').addClass('out');
			if (!$letter.is(':last-child')) {
				setTimeout(function () {
					hideLetter($letter.next(), $word, $bool, $duration);
				}, $duration);
			} else if ($bool) {
				setTimeout(function () {
					hideWord(takeNext($word))
				}, animationDelay);
			}
			if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
				var nextWord = takeNext($word);
				switchWord($word, nextWord);
			}
		}
		function showLetter($letter, $word, $bool, $duration) {
			$letter.addClass('in').removeClass('out');
			if (!$letter.is(':last-child')) {
				setTimeout(function () {
					showLetter($letter.next(), $word, $bool, $duration);
				}, $duration);
			} else {
				if (!$bool) {
					setTimeout(function () {
						hideWord($word)
					}, animationDelay)
				}
			}
		}
		function takeNext($word) {
			return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
		}
		function takePrev($word) {
			return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
		}
		function switchWord($oldWord, $newWord) {
			$oldWord.removeClass('is-visible').addClass('is-hidden');
			$newWord.removeClass('is-hidden').addClass('is-visible');
		}
	}

	// Slider Animation
	function doAnimations(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('animation-delay');
			var $animationType = 'animated ' + $this.data('animation');
			$this.css({
				'animation-delay': $animationDelay,
				'-webkit-animation-delay': $animationDelay
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
			if ($this.hasClass('animate')) {
				$this.removeClass('animation');
			}
		});
	}

	//	header search
	function headerSearch() {
		$('#toggle-search').on('click', function () {
			$('#search-form, #toggle-search').toggleClass('open');
			return false;
		});
		$('#search-form input[type=submit]').on('click', function () {
			$('#search-form, #toggle-search').toggleClass('open');
			return true;
		});
		$(document).on('click', function (event) {
			var target = $(event.target);
			if (!target.is('#toggle-search') && !target.closest('#search-form').length) {
				$('#search-form, #toggle-search').removeClass('open');
			}
		});
	}

	//	news ticker
	function newsTicker() {
		if (themeBlocks.newsTicker.length) {
			var $tickerWrapper = themeBlocks.newsTicker.show();
			var $list = $tickerWrapper.find("ul.ticker");
			var $clonedList = $list.clone();
			var listWidth = 10;
			$list.find("li").each(function (i) {
				listWidth += $(this, i).outerWidth(true);
			});
			var endPos = $tickerWrapper.width() - listWidth;
			$list.add($clonedList).css({
				"width": listWidth + "px"
			});
			$clonedList.addClass("cloned").appendTo($tickerWrapper);
			//TimelineMax
			var infinite = new TimelineMax({
				force3D: true,
				repeat: -1,
				paused: false
			});
			var time = $tickerWrapper.attr('data-speed') ? $tickerWrapper.attr('data-speed') : 25;
			infinite.fromTo($list, time, {
				x: 0
			}, {
				x: -listWidth,
				ease: Linear.easeNone
			}, 0);
			infinite.fromTo($clonedList, time, {
				x: listWidth
			}, {
				x: 0,
				ease: Linear.easeNone
			}, 0);
			infinite.set($list, {
				x: listWidth
			});
			infinite.to($clonedList, time, {
				x: -listWidth,
				ease: Linear.easeNone
			}, time);
			infinite.to($list, time, {
				x: 0,
				ease: Linear.easeNone
			}, time);
			//Pause/Play
			$tickerWrapper.on("mouseenter", function () {
				infinite.pause();
			}).on("mouseleave", function () {
				infinite.play();
			});
		}
	}

	//	awp player initialization
	function iniPlayer() {
		if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
			return false;
		} else {
			var ctx = document.createElement('canvas').getContext('2d');
			var progress_color = ctx.createLinearGradient(0, 0, 1000, 0);
			progress_color.addColorStop(0, '#328add');
			progress_color.addColorStop(1, '#abee2d');
			if ($("#awp-project-player").length) {
				var awp_player1;
				var settings = {
					instanceName: "glory1",
					sourcePath: "",
					playlistList: "#awp-project-playlist",
					activePlaylist: "playlist-1",
					activeItem: 0,
					volume: 0.5,
					autoPlay: false,
					randomPlay: false,
					loopingOn: true,
					autoAdvanceToNextMedia: true,
					mediaEndAction: "loop",
					useKeyboardNavigationForPlayback: true,
					usePlaylistScroll: true,
					playlistScrollOrientation: "vertical",
					playlistScrollTheme: "records",
					useDownload: true,
					useShare: true,
					useTooltips: false,
					useNumbersInPlaylist: true,
					numberTitleSeparator: ".  ",
					artistTitleSeparator: " - ",
					playlistItemContent: "title",
					wavesurfer: {
						waveColor: '#6e6e6e',
						progressColor: progress_color,
						barWidth: 1,
						cursorColor: 'transparent',
						cursorWidth: 1,
						height: 50
					}
				};
				awp_player1 = $("#awp-project-player").awp(settings);
			}
			if ($("#awp-home-player").length) {
				var awp_player2;
				var settings = {
					instanceName: "glory2",
					sourcePath: "",
					playlistList: "#awp-home-playlist",
					activePlaylist: "playlist-2",
					activeItem: 0,
					volume: 0.5,
					autoPlay: true,
					drawWaveWithoutLoad: false,
					randomPlay: false,
					loopingOn: true,
					autoAdvanceToNextMedia: true,
					mediaEndAction: "loop",
					useKeyboardNavigationForPlayback: false,
					numberTitleSeparator: ".  ",
					artistTitleSeparator: " - ",
					playlistItemContent: "title",
					wavesurfer: {
						waveColor: '#6e6e6e',
						progressColor: progress_color,
						barWidth: 1,
						cursorColor: 'transparent',
						cursorWidth: 1,
						height: 50
					}
				};
				awp_player2 = $("#awp-home-player").awp(settings);
			}
			if ($("#awp-grid-player").length) {
				var awp_player3;
				var settings = {
					instanceName: "glory3",
					sourcePath: "",
					playlistList: "#awp-grid-playlist",
					activePlaylist: "playlist-3",
					activeItem: 0,
					volume: 0.5,
					autoPlay: false,
					drawWaveWithoutLoad: false,
					randomPlay: false,
					loopingOn: true,
					autoAdvanceToNextMedia: true,
					mediaEndAction: "loop",
					numberTitleSeparator: ".  ",
					artistTitleSeparator: " - ",
					playlistItemContent: "title",
					wavesurfer: {
						waveColor: '#6e6e6e',
						progressColor: progress_color,
						barWidth: 1,
						cursorColor: 'transparent',
						cursorWidth: 1,
						height: 50
					}
				};
				awp_player3 = $("#awp-grid-player").awp(settings);
			}
			$('.popup-player-link').on("click", function () {
				var trackNum = parseInt($(this).attr('data-track'), 10);
				awp_player3.loadMedia(trackNum - 1);
				return false;
			})
		}
	}

	// back to top
	function backToTop(button, flag) {
		if (flag) {
			var $button = $(button);
			$(window).on('scroll', function () {
				if ($(this).scrollTop() >= 500) {
					$button.addClass('visible');
				} else {
					$button.removeClass('visible');
				}
			});
			$button.on('click', function () {
				$('body,html').animate({
					scrollTop: 0
				}, 1000);
			});
		} else {
			$(button).hide();
		}
	}

	// Menu max height
	function mHeight() {
		return $(window).height() - 65;
	}

	// Navigation dropdown menu
	function mobileMenu(windowWidth) {
		var $menu = $('.header .header-menu'),
			$menuWrap = $menu,
			$menuToggle = $('.menu-toggle'),
			$menuSub = $('.header .menu'),
			$menuArrow = $('.header .menu .arrow');
		$menuToggle.on('click', function (e) {
			e.preventDefault();
			var $this = $(this);
			if (!$menu.hasClass('opened')) {
				$menu.addClass('opened');
				$this.addClass('opened');
				$('body').addClass('fixed');
				$menuWrap.css({
					'height': mHeight() + 'px'
				});
			} else {
				$menu.removeClass('opened');
				$this.removeClass('opened');
				$('body').removeClass('fixed');
				$menuWrap.css({
					'height': ''
				});
			}
		});
		$('.darkOverlay').on('click', function (e) {
			$menu.removeClass('opened');
			$menuToggle.removeClass('opened');
			$('body').removeClass('fixed');
			$menuWrap.css({
				'height': ''
			});
		})
		$menuArrow.on('click', function (e) {
			e.preventDefault();
			var $this = $(this).parent('a');
			$this.next('ul').slideToggle();
			$this.toggleClass('opened');
		});
		$(window).on('resize', function () {
			var w = $(window).width();
			if (w > 1024 && $menu.hasClass('opened')) {
				$menu.removeClass('opened');
				$menuToggle.removeClass('opened');
				$('body').removeClass('fixed');
				$menuWrap.css({
					'height': ''
				});
			}
		});
	}
	
	// Google Map
	function createMap(id, mapZoom, lat, lng) {
		// Create google map
		// Basic options for a simple Google Map
		// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		var mapOptions = {
			// How zoomed in you want the map to start at (always required)
			zoom: mapZoom,
			scrollwheel: false, // The latitude and longitude to center the map (always required)
			center: new google.maps.LatLng(lat, lng),
			// How you would like to style the map. 
			// This is where you would paste any style found on Snazzy Maps.
			styles: [{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{
					"color": "#e9e9e9"
						}, {
					"lightness": 17
						}]
					}, {
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f5f5f5"
						}, {
					"lightness": 20
						}]
					}, {
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [{
					"color": "#ffffff"
						}, {
					"lightness": 17
						}]
					}, {
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [{
					"color": "#ffffff"
						}, {
					"lightness": 29
						}, {
					"weight": 0.2
						}]
					}, {
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [{
					"color": "#ffffff"
						}, {
					"lightness": 18
						}]
					}, {
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [{
					"color": "#ffffff"
						}, {
					"lightness": 16
						}]
					}, {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f5f5f5"
						}, {
					"lightness": 21
						}]
					}, {
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [{
					"color": "#dedede"
						}, {
					"lightness": 21
						}]
					}, {
				"elementType": "labels.text.stroke",
				"stylers": [{
					"visibility": "on"
						}, {
					"color": "#ffffff"
						}, {
					"lightness": 16
						}]
					}, {
				"elementType": "labels.text.fill",
				"stylers": [{
					"saturation": 36
						}, {
					"color": "#333333"
						}, {
					"lightness": 40
						}]
					}, {
				"elementType": "labels.icon",
				"stylers": [{
					"visibility": "off"
						}]
					}, {
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [{
					"color": "#f2f2f2"
						}, {
					"lightness": 19
						}]
					}, {
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [{
					"color": "#fefefe"
						}, {
					"lightness": 20
						}]
					}, {
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [{
					"color": "#fefefe"
						}, {
					"lightness": 17
						}, {
					"weight": 1.2
						}]
					}]
		};
		// Get the HTML DOM element that will contain your map 
		// We are using a div with id="map" seen below in the <body>
		var mapElement = document.getElementById(id);
		// Create the Google Map using our element and options defined above
		var map = new google.maps.Map(mapElement, mapOptions);
		var image = 'images/map-marker.png';
		// Let's also add a marker while we're at it
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			icon: image
		});
	}

	// END FUNCTIONS
})(jQuery);