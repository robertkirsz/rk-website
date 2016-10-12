'use strict'

function initApp() {
	const $window = $(window)
	const $body = $('body')

	const sectionFade = {
		$mainNav: $('#main_nav'),
		$links: $('#main_nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		start: function() {
			$body.addClass('sectionFade')
			$('#main_portfolio, #main_skills, #main_contact').hide()
			sectionFade.$mainNav.on('click', 'a', sectionFade.click)
			clearTimeout(sectionScroll.timeout)
			sectionFade.$mainNav.removeClass('white')
			$('.navbar-brand').addClass('active')
		},
		click: function() {
			event.preventDefault()
			var $clickedLink = $(event.target)
			//Uruchom tylko jeśli link nie był już aktywowany ani nie trwa animacja przełączania okien
			if (!$clickedLink.hasClass('active') && !$clickedLink.hasClass('disabled')) {
				//Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
				if (sectionFade.$navbarCollapse.hasClass('in')) {
					$('.navbar-toggle').click()
				}
				//Pobierz odnośnik linku
				var $content = $($clickedLink.attr('href'))
				//Deaktywuj inne linki, aktywuj link kliknięty
				sectionFade.$links.removeClass('active').addClass('disabled')
				$clickedLink.addClass('active')
				window.scrollTo(0, 0)
				//Okno z wierzchu przesuń na spód
				$('.front').addClass('oldfront').removeClass('front')
				//Pokaż nowe okno, przesuń je na wierzch i animuj wejście
				$content.addClass('front').show().addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$content.removeClass('animated fadeInRight')
					//Usuń klasę z poprzedniego okna
					$('.oldfront').removeClass('oldfront').hide()
					//Aktywuj linku
					sectionFade.$links.removeClass('disabled')
				})
			}
		},
		stop: function() {
			$body.removeClass('sectionFade')
			$('#main_portfolio, #main_skills, #main_contact').show()
			$('.front').removeClass('front')
			$('.oldfront').removeClass('oldfront')
			sectionFade.$links.removeClass('active disabled')
			sectionFade.$mainNav.off('click', 'a', sectionFade.click)
		}
	}

	const sectionScroll = {
		$links: $('#main_nav .navbar-nav a'),
		$navbarCollapse: $('.navbar-collapse'),
		$main_cover: $('#main_cover'),
		$navbar_toggle: $('.navbar-toggle'),
		mainNavHeight: $('#main_nav').height(),
		mainCoverHeight: $('#main_cover').height(),
		$mainNav: $('#main_nav'),
		timeout: {},
		start: function() {
			$body.addClass('sectionScroll')
			sectionScroll.$mainNav.on('click', 'a', sectionScroll.click)
			$window.on('scroll', sectionScroll.parallax)
			$window.on('scroll', sectionScroll.navChange)
			sectionScroll.timeout = setTimeout(function() {
				sectionScroll.$mainNav.css('transition-delay', '0s')
				sectionScroll.navChange()
			}, 2000)
		},
		click: function() {
			event.preventDefault()
			var $clickedLink = $(event.target),
				$targetLink = $($clickedLink.attr('href'))
			$body.animate({
				scrollTop: $targetLink.offset().top - 50
			}, 500)
			sectionScroll.$links.removeClass('active')
			$clickedLink.addClass('active')
			//Jeśli strona jest w wersji mobilnej, zamknij pasek z linkami po kliknięciu na któryś z nich
			if (sectionScroll.$navbarCollapse.hasClass('in')) {
				sectionScroll.$navbar_toggle.click()
			}
		},
		stop: function() {
			$body.removeClass('sectionScroll')
			sectionScroll.$links.removeClass('active')
			sectionScroll.$mainNav.off('click', 'a', sectionScroll.click)
			$window.off('scroll', sectionScroll.parallax)
			$window.off('scroll', sectionScroll.navChange)
			sectionScroll.$main_cover.css('background-position', '0 0, 50% 0')
		},
		parallax: function() {
			sectionScroll.$main_cover.css('background-position', '0 0, 50% ' + ($(event.target).scrollTop() / 1.3) + 'px')
		},
		navChange: function() {
			if ((sectionScroll.mainCoverHeight - window.pageYOffset - sectionScroll.mainNavHeight) < 0) {
				sectionScroll.$mainNav.removeClass('white')
			} else {
				sectionScroll.$mainNav.addClass('white')
			}
		},
		perfectScrollbar: function() {
			var $screen = $('.screen')
			$screen.perfectScrollbar()
			var scrollTimeout
			$screen.on({
				mouseenter: function() {
					clearTimeout(scrollTimeout)
				},
				mouseleave: function() {
					scrollTimeout = setTimeout(function() {
						$screen.stop().animate({ scrollTop:0 }, '500', 'swing')
					}, 5000)
				}
			})
		}
	}

	/* Small devices (tablets, less than 992px) */
	if ($window.width() < 768) {
		sectionFade.start()
	} else {
		sectionScroll.start()
	}

	$window.on('resize', function() {
		if ($window.width() < 768 && $body.hasClass('sectionScroll')) {
			sectionScroll.stop()
			sectionFade.start()
		} else if ($window.width() >= 768 && $body.hasClass('sectionFade')) {
			sectionFade.stop()
			sectionScroll.start()
		}
	})

	//Wysyłanie wiadomości
	$('form[name=wiadomosc]').on('submit', function(e) {
	    e.preventDefault()
	    var $this = $(this),
	        $submit = $(this).find('button[type=submit]')
	    if (!$submit.hasClass('nonactive')) {
		    $.ajax({
		        type: 'POST',
		        url: 'skrypty/wiadomosc.php',
		        data: $this.serialize(),
		        success: function(daneZwrotne) {
		            var json = $.parseJSON(daneZwrotne)
		            //Wyczyść formularz
		            if (json.stan == 'ok') {
		            	$this.find('textarea').val('')
		            	$submit.removeClass('btn-primary').addClass('btn-success nonactive').html(json.ikona)
		            } else {
		            	$submit.removeClass('btn-primary').addClass('btn-danger nonactive').html(json.ikona)
		            }
		            //Zmień tekst przycisku
		            setTimeout(function() {
		                $submit.removeClass('btn-success btn-danger nonactive').addClass('btn-primary').html('Wyślij')
		            }, 8000)
		        }
		    })
		}
	})

	const ElementPortfolio = (key, value) => {
		const {	nazwa, adres, opis, responsywnosc, screenshot } = value

		let uklad = null
		let bootstrap1 = null
		let bootstrap2 = null

		// Elementy parzyste (po lewej)
		if (key % 2 === 0) {
				uklad = screenshot.desktop === '' ? 'telefon_only left' : 'responsive left'
				bootstrap1 = 'col-md-push-8'
				bootstrap2 = 'col-md-pull-4'
		// Elementy nieparzyste (po prawej)
		} else {
				uklad = screenshot.desktop === '' ? 'telefon_only right' : 'responsive right'
				bootstrap1 = ''
				bootstrap2 = ''
		}

		function generateResponsivenessIcons (desktop, tablet, telefon) {
			var $responsiveIcons = $('<h3 />', { class: 'responsive-icons' })
			$responsiveIcons.append($('<i />', { class: 'fa fa-desktop ' + responsywnosc.desktop }))
			$responsiveIcons.append($('<i />', { class: 'fa fa-tablet ' + responsywnosc.tablet }))
			$responsiveIcons.append($('<i />', { class: 'fa fa-mobile ' + responsywnosc.telefon }))
			return $responsiveIcons
		}

		var $portfolioItem = $('<div />', { class: 'row portfolio-item ' + uklad })
		var $description = $('<div />', { class: 'description col-md-4 ' + bootstrap1 })
		var $browsers = $('<div />', { class: 'browsers col-md-8 ' + bootstrap2 })

		$description.append($('<h1 />', { text: nazwa }))
		$description.append(
			generateResponsivenessIcons(responsywnosc.desktop, responsywnosc.tablet, responsywnosc.telefon)
		)
		$description.append($('<p />', { text: opis }))
		$description.append(
			$('<a />', {
				href: 'http://' + adres,
				type: 'button',
				class: 'btn btn-info',
				text: 'Zobacz projekt na żywo'
			})
		)

		var $phone = $('<div />', { class: 'phone' })
		var $top = $('<div class="top"></div>')
		var $screen = $('<div class="screen"><img src="img/portfolio/' + screenshot.telefon + '" alt="' + nazwa + ' Mobile Version"></div>')
		var $bottom = $('<div class="bottom"></div>')

		$phone.append($top)
		$phone.append($screen)
		$phone.append($bottom)

		var $desktop = $('<div class="desktop"><div class="top"><i class="fa fa-arrow-left"></i><i class="fa fa-arrow-right"></i><i class="fa fa-refresh"></i><i class="fa fa-home"></i><div class="address"><a href="http://' + adres + '">' + adres + '</a></div></div><div class="screen"><img src="img/portfolio/' + screenshot.desktop + '" alt="' + nazwa + ' Desktop Version"></div></div>')

		if (screenshot.desktop !== '') $browsers.append($desktop)
		if (screenshot.telefon !== '') $browsers.append($phone)

		$portfolioItem
			.append($description)
			.append($browsers)

		return $portfolioItem
	}

	const wygenerujListePortfolio = (tablicaPortfolio) => {
		var $listaPortfolio = $()
		$.each(tablicaPortfolio, function(key, value) {
			var $elementPortfolio = new ElementPortfolio(key, value)
			$('#main_portfolio .container').append($elementPortfolio)
		})
	}

	const pobierszPortfolio = () => {
		$.getJSON('../baza/portfolio.json')
			.done(tablicaPortfolio => wygenerujListePortfolio(tablicaPortfolio))
	}

	pobierszPortfolio()
}

$(document).ready(initApp())

$(window).load(() => { $('.rk').removeClass('rk') })
