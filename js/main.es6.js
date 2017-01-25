'use strict'

// Ikony responsywności (desktop, tablet, telefon)
const IkonyResponsywnosci = ({ desktop, tablet, telefon }) => {
	const $this = $('<h3 />', { class: 'responsive-icons' })

	$this
		.append($('<span />', { class: 'fa fa-desktop ' + `${desktop}` }))
		.append($('<span />', { class: 'fa fa-tablet ' + `${tablet}` }))
		.append($('<span />', { class: 'fa fa-mobile ' + `${telefon}` }))

	return $this
}

// Telefon ze zdjęciem projektu w wersji mobilnej
const Telefon = (nazwa, screenshot) => {
	const $this  = $('<div />', { class: 'phone' })
	const $góra  = $('<div />', { class: 'top' })
	const $ekran = $('<div />', { class: 'screen' })
	const $dół   = $('<div />', { class: 'bottom' })
	const $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Wersja Mobilna',
	})

	$this
		.append($góra)
		.append($ekran.append($screenshot))
		.append($dół)

	return $this
}

// Okno przegladarki ze zdjęciem projektu w wersji webowej/desktopowej
const Desktop = (nazwa, screenshot, adres) => {
	const $this = $('<div />', { class: 'desktop' })
	const $góra = $('<div />', { class: 'top' })
	const $ekran = $('<div />', { class: 'screen' })
	const $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Wersja Webowa',
	})
	const $ikony = $('<i class="fa fa-arrow-left"></i><i class="fa fa-arrow-right"></i><i class="fa fa-refresh"></i><i class="fa fa-home"></i>')
	const $pasekAdresowy = $('<div />', { class: 'address' })
	const $link = $('<a />', { href: 'http://' + adres, text: adres })

	$this
		.append(
			$góra
				.append($ikony)
				.append(
					$pasekAdresowy
						.append($link)
				)
			)
		.append(
			$ekran
				.append($screenshot)
		)

	return $this
}

// Pojedyńcza pozycja na liście portfolio
const ElementPortfolio = (key, value) => {
	const {	nazwa, adres, opis, responsywnosc, screenshot } = value
	// Elementy nieparzyste (po prawej - domyślne)
	let bootstrap1 = ''
	let bootstrap2 = ''

	// Elementy parzyste (po lewej)
	if (key % 2 === 0) {
		bootstrap1 = 'col-md-push-8'
		bootstrap2 = 'col-md-pull-4'
	}

	const foo = !responsywnosc.desktop ? 'mobile_only' : 'responsive'

	const $portfolioItem = $('<div />', { class: 'row portfolio-item ' + foo })
	const $description = $('<div />', { class: 'description col-md-4 ' + bootstrap1 })
	const $browsers = $('<div />', { class: 'browsers col-md-8 ' + bootstrap2 })

	$description
		.append($('<h1 />', { text: nazwa }))
		.append(new IkonyResponsywnosci(responsywnosc))
		.append($('<p />', { html: opis }))
		.append(
			$('<a />', {
				href : 'http://' + adres,
				class: 'btn btn-info',
				text : 'Zobacz projekt na żywo',
			})
		)

	if (screenshot.desktop !== '') $browsers.append(new Desktop(nazwa, screenshot.desktop, adres))
	if (screenshot.telefon !== '') $browsers.append(new Telefon(nazwa, screenshot.telefon))

	$portfolioItem
		.append($description)
		.append($browsers)

	return $portfolioItem
}

// Pojedyńcza pozycja na liście skills
const ElementSkills = (key, value) => {
	const {	nazwa, ikona } = value
	const $element = $('<div />', { class: 'skill col-xs-6 col-md-4' })
	const $ikona = $('<img />', { src: `img/skills/${ikona}`, alt: `Logo ${nazwa}` })
	const $opis = $('<p />', { text: nazwa })

	$element
		.append($ikona)
		.append($opis)

	return $element
}

const initApp = () => {
	const $window = $(window)
	const $body = $('body')

	const sectionScroll = {
		$links         : $('#main_nav .navbar-nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		$mainCover     : $('#main_cover'),
		$navbarToggle  : $('.navbar-toggle'),
		mainNavHeight  : $('#main_nav').height(),
		mainCoverHeight: $('#main_cover').height(),
		$mainNav       : $('#main_nav'),
		timeout        : {},
		start () {
			$body.addClass('sectionScroll')
			sectionScroll.$mainNav.on('click', 'a', sectionScroll.click)
			$window.on('scroll', sectionScroll.parallax)
			$window.on('scroll', sectionScroll.navChange)
			sectionScroll.timeout = setTimeout(function () {
				sectionScroll.$mainNav.css('transition-delay', '0s')
				sectionScroll.navChange()
			}, 2000)
		},
		click () {
			event.preventDefault()
			const $clickedLink = $(event.target)
			const $targetLink = $($clickedLink.attr('href'))

			$body.animate({
				scrollTop: $targetLink.offset().top - 50,
			}, 500)
			sectionScroll.$links.removeClass('active')
			$clickedLink.addClass('active')
			// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
			if (sectionScroll.$navbarCollapse.hasClass('in')) {
				sectionScroll.$navbarToggle.click()
			}
		},
		stop () {
			$body.removeClass('sectionScroll')
			sectionScroll.$links.removeClass('active')
			sectionScroll.$mainNav.off('click', 'a', sectionScroll.click)
			$window.off('scroll', sectionScroll.parallax)
			$window.off('scroll', sectionScroll.navChange)
			sectionScroll.$mainCover.css('background-position', '0 0, 50% 0')
		},
		parallax () {
			sectionScroll.$mainCover.css('background-position', '0 0, 50% ' + $(event.target).scrollTop() / 1.3 + 'px')
		},
		navChange () {
			if (sectionScroll.mainCoverHeight - window.pageYOffset - sectionScroll.mainNavHeight < 0) {
				sectionScroll.$mainNav.removeClass('white')
			} else {
				sectionScroll.$mainNav.addClass('white')
			}
		},
		perfectScrollbar () {
			const $screen = $('.screen')

			$screen.perfectScrollbar()
			let scrollTimeout

			$screen.on({
				mouseenter () {
					clearTimeout(scrollTimeout)
				},
				mouseleave () {
					scrollTimeout = setTimeout(function () {
						$screen.stop().animate({ scrollTop: 0 }, '500', 'swing')
					}, 5000)
				},
			})
		},
	}

	const sectionFade = {
		$mainNav       : $('#main_nav'),
		$links         : $('#main_nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		start () {
			$body.addClass('sectionFade')
			$('#main_portfolio, #main_skills, #main_contact').hide()
			sectionFade.$mainNav.on('click', 'a', sectionFade.click)
			clearTimeout(sectionScroll.timeout)
			sectionFade.$mainNav.removeClass('white')
			$('.navbar-brand').addClass('active')
		},
		click () {
			event.preventDefault()

			const $clickedLink = $(event.target)

			// Uruchom tylko jeśli link nie był już aktywowany ani nie trwa animacja przełączania okien
			if (!$clickedLink.hasClass('active') && !$clickedLink.hasClass('disabled')) {
				// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
				if (sectionFade.$navbarCollapse.hasClass('in')) {
					$('.navbar-toggle').click()
				}
				// Pobierz odnośnik linku
				const $content = $($clickedLink.attr('href'))

				// Deaktywuj inne linki, aktywuj link kliknięty
				sectionFade.$links.removeClass('active').addClass('disabled')
				$clickedLink.addClass('active')
				window.scrollTo(0, 0)
				// Okno z wierzchu przesuń na spód
				$('.front').addClass('oldfront').removeClass('front')
				// Pokaż nowe okno, przesuń je na wierzch i animuj wejście
				$content.addClass('front').show().addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
					$content.removeClass('animated fadeInRight')
					// Usuń klasę z poprzedniego okna
					$('.oldfront').removeClass('oldfront').hide()
					// Aktywuj linku
					sectionFade.$links.removeClass('disabled')
				})
			}
		},
		stop () {
			$body.removeClass('sectionFade')
			$('#main_portfolio, #main_skills, #main_contact').show()
			$('.front').removeClass('front')
			$('.oldfront').removeClass('oldfront')
			sectionFade.$links.removeClass('active disabled')
			sectionFade.$mainNav.off('click', 'a', sectionFade.click)
		},
	}

	// Small devices (tablets, less than 992px)
	if ($window.width() < 768) sectionFade.start()
	else sectionScroll.start()

	$window.on('resize', function () {
		if ($window.width() < 768 && $body.hasClass('sectionScroll')) {
			sectionScroll.stop()
			sectionFade.start()
		} else if ($window.width() >= 768 && $body.hasClass('sectionFade')) {
			sectionFade.stop()
			sectionScroll.start()
		}
	})

	// Wysyłanie wiadomości
	$('form[name=wiadomosc]').on('submit', function (e) {
		e.preventDefault()
		const $this = $(this)
		const $submit = $(this).find('button[type=submit]')

		if (!$submit.hasClass('nonactive')) {
			$.ajax({
				type: 'POST',
				url : 'skrypty/wiadomosc.php',
				data: $this.serialize(),
				'success' (daneZwrotne) {
					const json = $.parseJSON(daneZwrotne)

					// Wyczyść formularz
					if (json.stan === 'ok') {
						$this.find('textarea').val('')
						$submit.removeClass('btn-primary').addClass('btn-success nonactive').html(json.ikona)
					} else {
						$submit.removeClass('btn-primary').addClass('btn-danger nonactive').html(json.ikona)
					}
					// Zmień tekst przycisku
					setTimeout(function () {
						$submit.removeClass('btn-success btn-danger nonactive').addClass('btn-primary').html('Wyślij')
					}, 8000)
				},
			})
		}
	})

	const wygenerujListePortfolio = (tablicaPortfolio) => {
		const listaPortfolio = []

		$.each(tablicaPortfolio, (key, value) => {
			listaPortfolio.push(new ElementPortfolio(key, value))
		})

		$('#main_portfolio .container').append(listaPortfolio)
	}

	const wygenerujSkills = (tablicaSkills) => {
		const advancedSkills = []
		const intermediateSkills = []
		const beginnerSkills = []
		const otherStuff = []

		$.each(tablicaSkills, (key, value) => {
			const element = new ElementSkills(key, value)

			if (value.poziom === 'advanced') advancedSkills.push(element)
			if (value.poziom === 'intermediate') intermediateSkills.push(element)
			if (value.poziom === 'beginner') beginnerSkills.push(element)
			if (value.poziom === 'other') otherStuff.push(element)
		})

		$('.advanced .container').append(advancedSkills)
		$('.intermediate .container').append(intermediateSkills)
		$('.beginner .container').append(beginnerSkills)
		$('.other .container').append(otherStuff)
	}

	const pobierzPortfolio = () => {
		$.getJSON('../baza/portfolio.json')
			.done(tablicaPortfolio => wygenerujListePortfolio(tablicaPortfolio))
	}

	const pobierzSkills = () => {
		$.getJSON('../baza/skills.json')
			.done(tablicaSkills => wygenerujSkills(tablicaSkills))
	}

	pobierzPortfolio()
	pobierzSkills()
}

// Zainicjuj aplikację gdy dokument będzie gotowy
$(document).ready(initApp())
// Po załadowaniu się okna usuń klasę .rk, co uruchomi animację wejścia
$(window).load(() => { $('.rk').removeClass('rk') })
