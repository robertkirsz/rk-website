// TODO: translate everything into English
'use strict'

// PORTFOLIO: Ikony responsywności (desktop, tablet, telefon)
const responsivenessIcons = ({ desktop, tablet, telefon }) => {
	const $this = $('<span />', { class: 'responsive-icons' })

	$this
		.append($('<span />', { class: `fa fa-desktop ${desktop}` }))
		.append($('<span />', { class: `fa fa-tablet ${tablet}` }))
		.append($('<span />', { class: `fa fa-mobile ${telefon}` }))

	return $this
}

// PORTFOLIO: Ikony responsywności (desktop, tablet, telefon)
const techIcons = tech => {
	const $this = $('<span />', { class: 'tech-icons' })

	tech.forEach(icon => {
		$this.append($('<img />', { src: `img/skills/${icon}.png` }))
	})

	return $this
}

// PORTFOLIO: Telefon ze zdjęciem projektu w wersji mobilnej
const Phone = (nazwa, screenshot) => {
	const $this  = $('<div />', { class: 'phone' })
	const $góra  = $('<div />', { class: 'top' })
	const $ekran = $('<div />', { class: 'screen' })
	const $dół   = $('<div />', { class: 'bottom' })
	const $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Mobile Version',
	})

	$this
		.append($góra)
		.append($ekran.append($screenshot))
		.append($dół)

	return $this
}

// PORTFOLIO: Okno przegladarki ze zdjęciem projektu w wersji webowej/desktopowej
const Desktop = (nazwa, screenshot, adres) => {
	const $this = $('<div />', { class: 'desktop' })
	const $góra = $('<div />', { class: 'top' })
	const $ekran = $('<div />', { class: 'screen' })
	const $screenshot = $('<img />', {
		src: 'img/portfolio/' + screenshot,
		alt: nazwa + ' - Desktop Version',
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

// PORTFOLIO: Pojedyńcza pozycja na liście portfolio
const ElementPortfolio = (key, value) => {
	const {	nazwa, adres, github, opis, responsiveness, screenshot, tech, workInProgress } = value

	// Dodaj style dla elementów parzystych (po lewej stronie ekranu), które zamienią
	// miejscami opis z elementami przeglądarki/telefonu
	const	bootstrap1 = key % 2 === 0 ? 'col-md-push-8' : ''
	const	bootstrap2 = key % 2 === 0 ? 'col-md-pull-4' : ''

	// Dodaj unikatową klasę dla pozycji, które są stworzone tylko w wersji mobilnej
	const displayType = !responsiveness.desktop ? 'mobile_only' : 'responsive'

	// Przygotuj poszczególne elementy całości
	const $portfolioItem = $('<div />', { class: 'row portfolio-item ' + displayType })
	const $description = $('<div />', { class: 'description col-md-4 ' + bootstrap1 })
	const $browsers = $('<div />', { class: 'browsers col-md-8 ' + bootstrap2 })
	const $icons = $('<div />', { class: 'icons' })

	// Dodaj ikony responsywności i użytych technologii
	$icons
		.append(responsivenessIcons(responsiveness))
		.append(techIcons(tech))

	// Dodaj nazwę, utworzone wcześniej ikony, opis i link do wersji live
	$description
		.append($('<h1 />', { text: nazwa }))
		.append($icons)
		.append($('<p />', { html: opis }))
		.append(
			$('<a />', {
				href             : 'http://' + adres,
				class            : 'btn btn-info fa fa-eye fa-2x',
				'data-toggle'    : 'tooltip',
				'data-placement' : 'top',
				title            : 'Live version',
			}).tooltip({ delay: { show: 500, hide: 100 } })
		)

	// Dodaj link do GitHuba, jeśli projekt ma swoje repozytorium
	if (github) {
		$description.append(
			$('<a />', {
				href             : github,
				class            : 'btn btn-default fa fa-github fa-2x',
				'data-toggle'    : 'tooltip',
				'data-placement' : 'top',
				title            : 'Source on GitHubie',
			}).tooltip({ delay: { show: 500, hide: 100 } })
		)
	}

	// Dodaj oznaczenie "work in progress" jeśli trzeba
	if (workInProgress) {
		const $workInProgressBadge = $('<div />', { class: 'work-in-progress-badge' })

		$workInProgressBadge.append($('<span />', { html: 'Work<br>in progress' }))
		$description.append($workInProgressBadge)
	}

	// Dodaj elementy przeglądarki i telefonu
	if (screenshot.desktop !== '') $browsers.append(new Desktop(nazwa, screenshot.desktop, adres))
	if (screenshot.telefon !== '') $browsers.append(new Phone(nazwa, screenshot.telefon))

	// Złóż wszystko razem
	$portfolioItem
		.append($description)
		.append($browsers)

	return $portfolioItem
}

// SKILLS: Pojedyńcza pozycja na liście skills
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

// PORTFOLIO:
const wygenerujListePortfolio = (tablicaPortfolio) => {
	const listaPortfolio = []

	$.each(tablicaPortfolio, (key, value) => {
		listaPortfolio.push(new ElementPortfolio(key, value))
	})

	$('#main_portfolio .container').append(listaPortfolio)
}

// SKILLS:
const wygenerujSkills = (tablicaSkills) => {
	const primarySkills = []
	const secondarySkills = []
	const otherStuff = []

	$.each(tablicaSkills, (key, value) => {
		const element = new ElementSkills(key, value)

		if (value.poziom === 'primary') primarySkills.push(element)
		if (value.poziom === 'secondary') secondarySkills.push(element)
		if (value.poziom === 'other') otherStuff.push(element)
	})

	$('.primary .container').append(primarySkills)
	$('.secondary .container').append(secondarySkills)
	$('.other .container').append(otherStuff)
}

// PORTFOLIO:
const pobierzPortfolio = () => {
	$.getJSON('../baza/portfolio.json')
		.done(tablicaPortfolio => wygenerujListePortfolio(tablicaPortfolio))
}

// SKILLS:
const pobierzSkills = () => {
	$.getJSON('../baza/skills.json')
		.done(tablicaSkills => wygenerujSkills(tablicaSkills))
}

const $window = $(window)
const $body = $('body')

// Interakcje dla wersji desktopowej
const sectionScroll = {
	$links          : $('#main_nav .navbar-nav a'),
	$navbarCollapse : $('.navbar-collapse'),
	$mainCover      : $('#main_cover'),
	$navbarToggle   : $('.navbar-toggle'),
	mainNavHeight   : $('#main_nav').height(),
	mainCoverHeight : $('#main_cover').height(),
	$mainNav        : $('#main_nav'),
	timeout         : {},
	start () {
		// Uruchom tooltipy
		$('[data-toggle="tooltip"]').tooltip({ delay: { show: 500, hide: 100 } })
		$body.addClass('sectionScroll')
		sectionScroll.$mainNav.on('click', 'a', sectionScroll.click)
		$window.on('scroll', () => {
			sectionScroll.parallax()
			sectionScroll.navChange()
		})
		sectionScroll.timeout = setTimeout(() => {
			sectionScroll.$mainNav.css('transition-delay', '0s')
			sectionScroll.navChange()
		}, 2000)
	},
	stop () {
		$body.removeClass('sectionScroll')
		sectionScroll.$links.removeClass('active')
		sectionScroll.$mainNav.off('click', 'a', sectionScroll.click)
		$window.off('scroll')
		$('[data-parallax]').removeAttr('style')
	},
	parallax () {
		const topDistance = window.scrollY
		const $layers = $('[data-parallax]')

		$layers.each(function () {
			const depth = $(this).attr('data-depth')
			const type = $(this).attr('data-type')
			const movement = -topDistance * depth
			const styles = {}

			if (type === 'position') {
				styles.transform = 'translate3d(0, ' + movement + 'px, 0)'
			}

			if (type === 'background') {
				styles.backgroundPositionY = -14 - movement + 'px'
			}

			$(this).css(styles)
		})
	},
	click () {
		event.preventDefault()
		const $clickedLink = $(event.target)
		const $targetLink = $($clickedLink.attr('href'))

		$body.animate({ scrollTop: $targetLink.offset().top - 50 }, 500)
		sectionScroll.$links.removeClass('active')
		$clickedLink.addClass('active')
		// Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
		if (sectionScroll.$navbarCollapse.hasClass('in')) {
			sectionScroll.$navbarToggle.click()
		}
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

// Interakcje dla wersji mobilnej
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

const initApp = () => {
	// Pobierz i wygeneruj elementy sekcji portfolio i skills
	pobierzPortfolio()
	pobierzSkills()

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
}

// Zainicjuj aplikację gdy dokument będzie gotowy
$(document).ready(initApp())

// Po załadowaniu się okna usuń klasę ".rk", co uruchomi animację wejścia
$(window).load(() => { $('.rk').removeClass('rk') })
