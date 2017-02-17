'use strict';

// PORTFOLIO: Ikony responsywności (desktop, tablet, telefon)

var responsivenessIcons = function responsivenessIcons(_ref) {
	var desktop = _ref.desktop;
	var tablet = _ref.tablet;
	var telefon = _ref.telefon;

	var $this = $('<span />', { class: 'responsive-icons' });

	$this.append($('<span />', { class: 'fa fa-desktop ' + desktop })).append($('<span />', { class: 'fa fa-tablet ' + tablet })).append($('<span />', { class: 'fa fa-mobile ' + telefon }));

	return $this;
};

// PORTFOLIO: Ikony responsywności (desktop, tablet, telefon)
var techIcons = function techIcons(tech) {
	var $this = $('<span />', { class: 'tech-icons' });

	tech.forEach(function (icon) {
		$this.append($('<img />', { src: 'img/skills/' + icon + '.png' }));
	});

	return $this;
};

// PORTFOLIO: Telefon ze zdjęciem projektu w wersji mobilnej
var Phone = function Phone(nazwa, screenshot) {
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

// PORTFOLIO: Okno przegladarki ze zdjęciem projektu w wersji webowej/desktopowej
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

// PORTFOLIO: Pojedyńcza pozycja na liście portfolio
var ElementPortfolio = function ElementPortfolio(key, value) {
	var nazwa = value.nazwa;
	var adres = value.adres;
	var github = value.github;
	var opis = value.opis;
	var responsywnosc = value.responsywnosc;
	var screenshot = value.screenshot;
	var tech = value.tech;

	// Dodaj style dla elementów parzystych (po lewej stronie ekranu), które zamienią
	// miejscami opis z elementami przeglądarki/telefonu

	var bootstrap1 = key % 2 === 0 ? 'col-md-push-8' : '';
	var bootstrap2 = key % 2 === 0 ? 'col-md-pull-4' : '';

	// Dodaj unikatową klasę dla pozycji, które są stworzone tylko w wersji mobilnej
	var displayType = !responsywnosc.desktop ? 'mobile_only' : 'responsive';

	// Przygotuj poszczególne elementy całości
	var $portfolioItem = $('<div />', { class: 'row portfolio-item ' + displayType });
	var $description = $('<div />', { class: 'description col-md-4 ' + bootstrap1 });
	var $browsers = $('<div />', { class: 'browsers col-md-8 ' + bootstrap2 });
	var $icons = $('<div />', { class: 'icons' });

	// Dodaj ikony responsywności i użytych technologii
	$icons.append(responsivenessIcons(responsywnosc)).append(techIcons(tech));

	// Dodaj nazwę, utworzone wcześniej ikony, opis i link do wersji live
	$description.append($('<h1 />', { text: nazwa })).append($icons).append($('<p />', { html: opis })).append($('<a />', {
		href: 'http://' + adres,
		class: 'btn btn-info fa fa-eye fa-2x',
		'data-toggle': 'tooltip',
		'data-placement': 'top',
		title: 'Wersja live'
	}).tooltip({ delay: { show: 500, hide: 100 } }));

	// Dodaj link do GitHuba, jeśli projekt ma swoje repozytorium
	if (github) {
		$description.append($('<a />', {
			href: github,
			class: 'btn btn-default fa fa-github fa-2x',
			'data-toggle': 'tooltip',
			'data-placement': 'top',
			title: 'Zobacz kod na GitHubie'
		}).tooltip({ delay: { show: 500, hide: 100 } }));
	}

	// Dodaj elementy przeglądarki i telefonu
	if (screenshot.desktop !== '') $browsers.append(new Desktop(nazwa, screenshot.desktop, adres));
	if (screenshot.telefon !== '') $browsers.append(new Phone(nazwa, screenshot.telefon));

	// Złóż wszystko razem
	$portfolioItem.append($description).append($browsers);

	return $portfolioItem;
};

// SKILLS: Pojedyńcza pozycja na liście skills
var ElementSkills = function ElementSkills(key, value) {
	var nazwa = value.nazwa;
	var ikona = value.ikona;

	var $element = $('<div />', { class: 'skill col-xs-6 col-md-4' });
	var $ikona = $('<img />', { src: 'img/skills/' + ikona, alt: 'Logo ' + nazwa });
	var $opis = $('<p />', { text: nazwa });

	$element.append($ikona).append($opis);

	return $element;
};

// PORTFOLIO:
var wygenerujListePortfolio = function wygenerujListePortfolio(tablicaPortfolio) {
	var listaPortfolio = [];

	$.each(tablicaPortfolio, function (key, value) {
		listaPortfolio.push(new ElementPortfolio(key, value));
	});

	$('#main_portfolio .container').append(listaPortfolio);
};

// SKILLS:
var wygenerujSkills = function wygenerujSkills(tablicaSkills) {
	var primarySkills = [];
	var secondarySkills = [];
	var otherStuff = [];

	$.each(tablicaSkills, function (key, value) {
		var element = new ElementSkills(key, value);

		if (value.poziom === 'primary') primarySkills.push(element);
		if (value.poziom === 'secondary') secondarySkills.push(element);
		if (value.poziom === 'other') otherStuff.push(element);
	});

	$('.primary .container').append(primarySkills);
	$('.secondary .container').append(secondarySkills);
	$('.other .container').append(otherStuff);
};

// PORTFOLIO:
var pobierzPortfolio = function pobierzPortfolio() {
	$.getJSON('../baza/portfolio.json').done(function (tablicaPortfolio) {
		return wygenerujListePortfolio(tablicaPortfolio);
	});
};

// SKILLS:
var pobierzSkills = function pobierzSkills() {
	$.getJSON('../baza/skills.json').done(function (tablicaSkills) {
		return wygenerujSkills(tablicaSkills);
	});
};

var $window = $(window);
var $body = $('body');

// Interakcje dla wersji desktopowej
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
		// Uruchom tooltipy
		$('[data-toggle="tooltip"]').tooltip({ delay: { show: 500, hide: 100 } });
		$body.addClass('sectionScroll');
		sectionScroll.$mainNav.on('click', 'a', sectionScroll.click);
		$window.on('scroll', function () {
			sectionScroll.parallax();
			sectionScroll.navChange();
		});
		sectionScroll.timeout = setTimeout(function () {
			sectionScroll.$mainNav.css('transition-delay', '0s');
			sectionScroll.navChange();
		}, 2000);
	},
	stop: function stop() {
		$body.removeClass('sectionScroll');
		sectionScroll.$links.removeClass('active');
		sectionScroll.$mainNav.off('click', 'a', sectionScroll.click);
		$window.off('scroll');
		$('[data-parallax]').removeAttr('style');
	},
	parallax: function parallax() {
		var topDistance = window.scrollY;
		var $layers = $('[data-parallax]');

		$layers.each(function () {
			var depth = $(this).attr('data-depth');
			var type = $(this).attr('data-type');
			var movement = -topDistance * depth;
			var styles = {};

			if (type === 'position') {
				styles.transform = 'translate3d(0, ' + movement + 'px, 0)';
			}

			if (type === 'background') {
				styles.backgroundPositionY = -14 - movement + 'px';
			}

			$(this).css(styles);
		});
	},
	click: function click() {
		event.preventDefault();
		var $clickedLink = $(event.target);
		var $targetLink = $($clickedLink.attr('href'));

		$body.animate({ scrollTop: $targetLink.offset().top - 50 }, 500);
		sectionScroll.$links.removeClass('active');
		$clickedLink.addClass('active');
		// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
		if (sectionScroll.$navbarCollapse.hasClass('in')) {
			sectionScroll.$navbarToggle.click();
		}
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

// Interakcje dla wersji mobilnej
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

var initApp = function initApp() {
	// Pobierz i wygeneruj elementy sekcji portfolio i skills
	pobierzPortfolio();
	pobierzSkills();

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
};

// Zainicjuj aplikację gdy dokument będzie gotowy
$(document).ready(initApp());

// Po załadowaniu się okna usuń klasę ".rk", co uruchomi animację wejścia
$(window).load(function () {
	$('.rk').removeClass('rk');
});
//# sourceMappingURL=main.js.map
