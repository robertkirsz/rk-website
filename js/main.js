'use strict';

// Ikony responsywności (desktop, tablet, telefon)

var IkonyResponsywnosci = function IkonyResponsywnosci(_ref) {
	var desktop = _ref.desktop;
	var tablet = _ref.tablet;
	var telefon = _ref.telefon;

	var $this = $('<h3 />', { class: 'responsive-icons' });

	$this.append($('<span />', { class: 'fa fa-desktop ' + ('' + desktop) })).append($('<span />', { class: 'fa fa-tablet ' + ('' + tablet) })).append($('<span />', { class: 'fa fa-mobile ' + ('' + telefon) }));

	return $this;
};

// Telefon ze zdjęciem projektu w wersji mobilnej
var Telefon = function Telefon(nazwa, screenshot) {
	var $this = $('<div />', { class: 'phone' });
	var $góra = $('<div />', { class: 'top' });
	var $ekran = $('<div />', { class: 'screen' });
	var $dół = $('<div />', { class: 'bottom' });
	var $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Wersja Mobilna'
	});

	$this.append($góra).append($ekran.append($screenshot)).append($dół);

	return $this;
};

// Okno przegladarki ze zdjęciem projektu w wersji webowej/desktopowej
var Desktop = function Desktop(nazwa, screenshot, adres) {
	var $this = $('<div />', { class: 'desktop' });
	var $góra = $('<div />', { class: 'top' });
	var $ekran = $('<div />', { class: 'screen' });
	var $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Wersja Webowa'
	});
	var $ikony = $('<i class="fa fa-arrow-left"></i><i class="fa fa-arrow-right"></i><i class="fa fa-refresh"></i><i class="fa fa-home"></i>');
	var $pasekAdresowy = $('<div />', { class: 'address' });
	var $link = $('<a />', { href: 'http://' + adres, text: adres });

	$this.append($góra.append($ikony).append($pasekAdresowy.append($link))).append($ekran.append($screenshot));

	return $this;
};

// Pojedyńcza pozycja na liście portfolio
var ElementPortfolio = function ElementPortfolio(key, value) {
	var nazwa = value.nazwa;
	var adres = value.adres;
	var opis = value.opis;
	var responsywnosc = value.responsywnosc;
	var screenshot = value.screenshot;
	// Elementy nieparzyste (po prawej - domyślne)

	var bootstrap1 = '';
	var bootstrap2 = '';

	// Elementy parzyste (po lewej)
	if (key % 2 === 0) {
		bootstrap1 = 'col-md-push-8';
		bootstrap2 = 'col-md-pull-4';
	}

	var foo = !responsywnosc.desktop ? 'mobile_only' : 'responsive';

	var $portfolioItem = $('<div />', { class: 'row portfolio-item ' + foo });
	var $description = $('<div />', { class: 'description col-md-4 ' + bootstrap1 });
	var $browsers = $('<div />', { class: 'browsers col-md-8 ' + bootstrap2 });

	$description.append($('<h1 />', { text: nazwa })).append(new IkonyResponsywnosci(responsywnosc)).append($('<p />', { html: opis })).append($('<a />', {
		href: 'http://' + adres,
		class: 'btn btn-info',
		text: 'Zobacz projekt na żywo'
	}));

	if (screenshot.desktop !== '') $browsers.append(new Desktop(nazwa, screenshot.desktop, adres));
	if (screenshot.telefon !== '') $browsers.append(new Telefon(nazwa, screenshot.telefon));

	$portfolioItem.append($description).append($browsers);

	return $portfolioItem;
};

// Pojedyńcza pozycja na liście skills
var ElementSkills = function ElementSkills(key, value) {
	var nazwa = value.nazwa;
	var ikona = value.ikona;

	var $element = $('<div />', { class: 'skill col-xs-6 col-md-4' });
	var $ikona = $('<img />', { src: 'img/skills/' + ikona, alt: 'Logo ' + nazwa });
	var $opis = $('<p />', { text: nazwa });

	$element.append($ikona).append($opis);

	return $element;
};

var initApp = function initApp() {
	var $window = $(window);
	var $body = $('body');

	var sectionScroll = {
		$links: $('#main_nav .navbar-nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		$mainCover: $('#main_cover'),
		$navbarToggle: $('.navbar-toggle'),
		mainNavHeight: $('#main_nav').height(),
		mainCoverHeight: $('#main_cover').height(),
		$mainNav: $('#main_nav'),
		timeout: {},
		start: function start() {
			$body.addClass('sectionScroll');
			sectionScroll.$mainNav.on('click', 'a', sectionScroll.click);
			$window.on('scroll', sectionScroll.parallax);
			$window.on('scroll', sectionScroll.navChange);
			sectionScroll.timeout = setTimeout(function () {
				sectionScroll.$mainNav.css('transition-delay', '0s');
				sectionScroll.navChange();
			}, 2000);
		},
		click: function click() {
			event.preventDefault();
			var $clickedLink = $(event.target);
			var $targetLink = $($clickedLink.attr('href'));

			$body.animate({
				scrollTop: $targetLink.offset().top - 50
			}, 500);
			sectionScroll.$links.removeClass('active');
			$clickedLink.addClass('active');
			// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
			if (sectionScroll.$navbarCollapse.hasClass('in')) {
				sectionScroll.$navbarToggle.click();
			}
		},
		stop: function stop() {
			$body.removeClass('sectionScroll');
			sectionScroll.$links.removeClass('active');
			sectionScroll.$mainNav.off('click', 'a', sectionScroll.click);
			$window.off('scroll', sectionScroll.parallax);
			$window.off('scroll', sectionScroll.navChange);
			sectionScroll.$mainCover.css('background-position', '0 0, 50% 0');
		},
		parallax: function parallax() {
			sectionScroll.$mainCover.css('background-position', '0 0, 50% ' + $(event.target).scrollTop() / 1.3 + 'px');
		},
		navChange: function navChange() {
			if (sectionScroll.mainCoverHeight - window.pageYOffset - sectionScroll.mainNavHeight < 0) {
				sectionScroll.$mainNav.removeClass('white');
			} else {
				sectionScroll.$mainNav.addClass('white');
			}
		},
		perfectScrollbar: function perfectScrollbar() {
			var $screen = $('.screen');

			$screen.perfectScrollbar();
			var scrollTimeout = void 0;

			$screen.on({
				mouseenter: function mouseenter() {
					clearTimeout(scrollTimeout);
				},
				mouseleave: function mouseleave() {
					scrollTimeout = setTimeout(function () {
						$screen.stop().animate({ scrollTop: 0 }, '500', 'swing');
					}, 5000);
				}
			});
		}
	};

	var sectionFade = {
		$mainNav: $('#main_nav'),
		$links: $('#main_nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		start: function start() {
			$body.addClass('sectionFade');
			$('#main_portfolio, #main_skills, #main_contact').hide();
			sectionFade.$mainNav.on('click', 'a', sectionFade.click);
			clearTimeout(sectionScroll.timeout);
			sectionFade.$mainNav.removeClass('white');
			$('.navbar-brand').addClass('active');
		},
		click: function click() {
			event.preventDefault();

			var $clickedLink = $(event.target);

			// Uruchom tylko jeśli link nie był już aktywowany ani nie trwa animacja przełączania okien
			if (!$clickedLink.hasClass('active') && !$clickedLink.hasClass('disabled')) {
				(function () {
					// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
					if (sectionFade.$navbarCollapse.hasClass('in')) {
						$('.navbar-toggle').click();
					}
					// Pobierz odnośnik linku
					var $content = $($clickedLink.attr('href'));

					// Deaktywuj inne linki, aktywuj link kliknięty
					sectionFade.$links.removeClass('active').addClass('disabled');
					$clickedLink.addClass('active');
					window.scrollTo(0, 0);
					// Okno z wierzchu przesuń na spód
					$('.front').addClass('oldfront').removeClass('front');
					// Pokaż nowe okno, przesuń je na wierzch i animuj wejście
					$content.addClass('front').show().addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
						$content.removeClass('animated fadeInRight');
						// Usuń klasę z poprzedniego okna
						$('.oldfront').removeClass('oldfront').hide();
						// Aktywuj linku
						sectionFade.$links.removeClass('disabled');
					});
				})();
			}
		},
		stop: function stop() {
			$body.removeClass('sectionFade');
			$('#main_portfolio, #main_skills, #main_contact').show();
			$('.front').removeClass('front');
			$('.oldfront').removeClass('oldfront');
			sectionFade.$links.removeClass('active disabled');
			sectionFade.$mainNav.off('click', 'a', sectionFade.click);
		}
	};

	// Small devices (tablets, less than 992px)
	if ($window.width() < 768) sectionFade.start();else sectionScroll.start();

	$window.on('resize', function () {
		if ($window.width() < 768 && $body.hasClass('sectionScroll')) {
			sectionScroll.stop();
			sectionFade.start();
		} else if ($window.width() >= 768 && $body.hasClass('sectionFade')) {
			sectionFade.stop();
			sectionScroll.start();
		}
	});

	// Wysyłanie wiadomości
	$('form[name=wiadomosc]').on('submit', function (e) {
		e.preventDefault();
		var $this = $(this);
		var $submit = $(this).find('button[type=submit]');

		if (!$submit.hasClass('nonactive')) {
			$.ajax({
				type: 'POST',
				url: 'skrypty/wiadomosc.php',
				data: $this.serialize(),
				'success': function success(daneZwrotne) {
					var json = $.parseJSON(daneZwrotne);

					// Wyczyść formularz
					if (json.stan === 'ok') {
						$this.find('textarea').val('');
						$submit.removeClass('btn-primary').addClass('btn-success nonactive').html(json.ikona);
					} else {
						$submit.removeClass('btn-primary').addClass('btn-danger nonactive').html(json.ikona);
					}
					// Zmień tekst przycisku
					setTimeout(function () {
						$submit.removeClass('btn-success btn-danger nonactive').addClass('btn-primary').html('Wyślij');
					}, 8000);
				}
			});
		}
	});

	var wygenerujListePortfolio = function wygenerujListePortfolio(tablicaPortfolio) {
		var listaPortfolio = [];

		$.each(tablicaPortfolio, function (key, value) {
			listaPortfolio.push(new ElementPortfolio(key, value));
		});

		$('#main_portfolio .container').append(listaPortfolio);
	};

	var wygenerujSkills = function wygenerujSkills(tablicaSkills) {
		var advancedSkills = [];
		var intermediateSkills = [];
		var beginnerSkills = [];
		var otherStuff = [];

		$.each(tablicaSkills, function (key, value) {
			var element = new ElementSkills(key, value);

			if (value.poziom === 'advanced') advancedSkills.push(element);
			if (value.poziom === 'intermediate') intermediateSkills.push(element);
			if (value.poziom === 'beginner') beginnerSkills.push(element);
			if (value.poziom === 'other') otherStuff.push(element);
		});

		$('.advanced .container').append(advancedSkills);
		$('.intermediate .container').append(intermediateSkills);
		$('.beginner .container').append(beginnerSkills);
		$('.other .container').append(otherStuff);
	};

	var pobierzPortfolio = function pobierzPortfolio() {
		$.getJSON('../baza/portfolio.json').done(function (tablicaPortfolio) {
			return wygenerujListePortfolio(tablicaPortfolio);
		});
	};

	var pobierzSkills = function pobierzSkills() {
		$.getJSON('../baza/skills.json').done(function (tablicaSkills) {
			return wygenerujSkills(tablicaSkills);
		});
	};

	pobierzPortfolio();
	pobierzSkills();
};

// Zainicjuj aplikację gdy dokument będzie gotowy
$(document).ready(initApp());
// Po załadowaniu się okna usuń klasę .rk, co uruchomi animację wejścia
$(window).load(function () {
	$('.rk').removeClass('rk');
});
//# sourceMappingURL=main.js.map
