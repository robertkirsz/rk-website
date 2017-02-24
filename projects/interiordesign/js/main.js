//Wyjustować pakiety

$(function() {

var collapsing = {
	navButton: $('.fa-bars'),
	navBar: $('.fa-bars').prev(),
	init: function() {
		this.navButton.on('click', function() {
			collapsing.navBar.toggleClass('collapsed');
		});
	}
};
collapsing.init();

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

var naglowek = $('header.main');

$(window).scroll(function() {
	if ($(window).scrollTop() >= 560) {
		naglowek.addClass('scrolled zjazd').removeClass('powrot');
	} else if ($(window).scrollTop() <= 1) {
		naglowek.removeClass('scrolled zjazd').addClass('powrot');
	}
});

var domek = {
	$domek: $('.domek'),
	init: function() {
		var dSzer = window.screen.width,
			dWys = window.screen.height;

		$(document).on('mousemove', function(e) {
			var X = Math.floor(e.screenX),
				Y = Math.floor(e.screenY);
			domek.$domek.css('transform', 'rotateY('+ (X-dSzer/2)/250 + 'deg) rotateX(' + -(Y-dWys/2)/250 +'deg)');
		});
	}
};
domek.init();

$('#wymierz .footer').on({
	mouseenter: function() {
		$(this).parent().css('background-color', '#858585');
	},
	mouseleave: function() {
		$(this).parent().css('background-color', '#FFF');
	}
});

var galeria = {
	$galeria: $('#galeria'),
	$wrapy: $('#galeria .wrap'),
	iloscZdjec: $('#galeria .wrap').length,

	losujLiczbe: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	losujZdjecia: function() {
		var arr = [], //Utwórz pustą tablicę na liczby
			losowaLiczba;
		
		losowaLiczba = galeria.losujLiczbe(1, galeria.iloscZdjec);
		//console.log('Losowanie... Tablica będzie miała %i elementów. Obecnie ma ich %i', losowaLiczba, arr.length);
		while (arr.length < losowaLiczba) {
			var randomnumber = galeria.losujLiczbe(0,7),
				found = false;
			//console.log('Zaczynam wypełniać tablicę...');
			//Przeszukaj każdy element tablicy
			for (var i = 0; i < arr.length; i++) {
				//Jeśli tablica zawiera już wylosowaną liczbę, zapamiętaj to i wyjdź z pętli
				if (arr[i] == randomnumber) {
					found = true;
					break;
				}
			}
			//Jeśli nie znaleziono zdublowanej wartości, zapisz wylosowaną, nową wartość
			if (!found) {
				arr[arr.length] = randomnumber;
				//console.log('Dodano do tablicy liczbę %i, tablica ma teraz %i elementy(ów)', randomnumber, arr.length)
			}
		}
		return arr;
	},

	animujZdjecie: function(indeks) {
		galeria.$wrapy.eq(indeks).toggleClass('hover'); //Wylosuj zdjęcie i animuj je
	},
	
	init: function(sposob) {
		//console.log('Uruchamiam galerię');
		var tablicaZdjec = galeria.losujZdjecia(); //Utwórz tablicę o losowej długości zawierającą losowe, niepowtarzające się liczby
	
		if (sposob) {
			function lolol() {
				for (var i = 0; i < tablicaZdjec.length; i++) {
					//console.log('Animuję wartość: ' + tablicaZdjec[i]);
					galeria.animujZdjecie(tablicaZdjec[i]);
				}
				if (i >= tablicaZdjec.length) {
					setTimeout(function() {
						//i = 0;
						tablicaZdjec = galeria.losujZdjecia();
						//console.log("Zaczynam od nowa");
						lolol();
					}, 2000);
				}
			}
			lolol();
		} else {
			var i = 0;
			// console.log(tablicaZdjec);
			function lolol2() {
				// console.log('Funkcja lolol: indeks = %i, wartość = %i', i, tablicaZdjec[i]);
				galeria.animujZdjecie(tablicaZdjec[i]);
				i++;
				if (i < tablicaZdjec.length) {
					// console.log("Wchodzę do while...");
					setTimeout(function() {
						// console.log('Timeout: indeks = %i, wartość = %i', i, tablicaZdjec[i]);
						lolol2();
					}, 400);
				} else {
					setTimeout(function() {
						i = 0;
						tablicaZdjec = galeria.losujZdjecia();
						// console.log("Zaczynam od nowa");
						lolol2();
					}, 2500);
				}
			}
			lolol2();
		}
	}
};
galeria.init(0); //1 - animowane jednocześnie, 0 - animowane pojedyńczo

var testimonials = {
	$cytaty: $('.testimonial'),
	$prev: $('.prev'),
	$next: $('.next'),
	wysOkna: $('.strip').height(),
	setup: function() {

		var $aktywny = this.$cytaty.first();

		$aktywny.siblings().hide();
		
		this.$cytaty.each(function(i, el) {
			var top = (testimonials.wysOkna - $(el).outerHeight()) / 2;
			$(el).css('top', top);
		});

		this.$prev.on('click', function() {

			var $nastepny = $aktywny.next().length ? $aktywny.next() : testimonials.$cytaty.first();

			$aktywny.addClass('animated fadeOutLeft').one(animationEnd, function() {
				$(this).removeClass('animated fadeOutLeft').hide();
			});
			$nastepny.show().addClass('animated fadeInRight').one(animationEnd, function() {
				$(this).removeClass('animated fadeInRight');
				$aktywny = $(this);
			});
		});

		this.$next.on('click', function() {

			var $poprzedni = $aktywny.prev().length ? $aktywny.prev() : testimonials.$cytaty.last();

			$aktywny.addClass('animated fadeOutRight').one(animationEnd, function() {
				$(this).removeClass('animated fadeOutRight').hide();
			});
			$poprzedni.show().addClass('animated fadeInLeft').one(animationEnd, function() {
				$(this).removeClass('animated fadeInLeft');
				$aktywny = $(this);
			});
		});
	}
}
testimonials.setup();

/* Kodowanie svg i dodawanie ich jako tło */
var svg_gora = "<svg xmlns='http://www.w3.org/2000/svg' width='8700' height='900' style='fill: #CBE9E4;'><polygon points='3170,0 7800,0 3940,840'></polygon></svg>",
	svg_dol  = "<svg xmlns='http://www.w3.org/2000/svg' width='6900' height='890' style='fill: #000;'><polygon points='0,890 4670,890 3830,0'></polygon></svg>",
	svg_dol2 = "<svg xmlns='http://www.w3.org/2000/svg' width='6900' height='890' style='fill: #FFF;'><polygon points='0,890 4670,890 3830,0'></polygon></svg>",
	grafiki  = "<svg xmlns='http://www.w3.org/2000/svg' width='228' height='56' viewbox='0 0 228 56' preserveAspectRatio='none'><polygon points='0,0 228,0 202,33 50,56 0,0' /></svg>",
	svg_gora64 = window.btoa(svg_gora),
	svg_dol64  = window.btoa(svg_dol),
	svg_dol264 = window.btoa(svg_dol2),
	grafiki64  = window.btoa(grafiki);

$('#main').css('background', "url('data:image/svg+xml;base64," + svg_gora64 + "') no-repeat center top, url('data:image/svg+xml;base64," + svg_dol64 + "') no-repeat center bottom");
$('.grafiki').css('background-image', "url('data:image/svg+xml;base64," + grafiki64 + "')");
$('#szukasz .content').css('background', "#CAE9E4 url('data:image/svg+xml;base64," + svg_dol264 + "') no-repeat center 85px");

/* COOKIES */

	/*
	var $cookies = $('<div class="cookies"><div class="wrap"><p class="header"><span>puk ?!</span><span>puk ?!</span></p><p class="info">Używamy ciasteczek.<br>Takich niejadalnych. Dzięki nim wiemy jak chcielibyście mieszkać.</p><a href="ciasteczka.html" class="wiecej">Więcej informacji</a><br><a href="#" class="zamknij"><i class="fa fa-times-circle"></i>Ok <span>zamknij</span></a></div><svg viewbox="0 0 10 10" preserveAspectRatio="none"><polygon points="0,10 10,10 10,5 5,0 0,5" /></svg></div>');

	$cookies.on('click', '.zamknij', function(e) {
		e.preventDefault();
		$('.cookies').fadeOut('normal', function() {
			$(this).remove();
			//localStorage.setItem('cookies_alert', 'hidden');
		});
	});

	//if (localStorage['cookies_alert'] !== 'hidden') {
		// if (localStorage['cookies_visible'] == 'visible') {
		// 	$cookies.prependTo($('body'));
		// } else {
			setTimeout(function() {
				$cookies.prependTo($('body')).hide().fadeIn('normal', function() {
					//localStorage.setItem('cookies_visible', 'visible');
				});
			}, 3000);
		// }
	//}
	*/

var aktywnaPodstrona = $('#main').attr('class');
$('header.main').find('a.' + aktywnaPodstrona).addClass('active');

$(['../interiordesign/img/lista2normal.png', '../interiordesign/img/lista2plus.png']).preload();

$('.aplikacja .panel').prepend('<div class="inputs"><section class="metraz"><h1>Podaj metraż pomieszczenia</h1><input type="number" min="0" step="1" name="metraz"> m<sup>2</sup></section><section class="budzet"><h1>Określ budżet</h1><input type="number" min="0" step="10"  name="budzet"> PLN</section><section class="preferencje"><h1>Określ swoje preferencje</h1><textarea name="preferencje" cols="30" rows="5"></textarea></section></div>');

//Kliknięcie na element list z ikoną domku
$('#main.wycena').on('click', '.opcje li', function() {
	var $this = $(this);
	//Jeśli jest to element który ma rozwinąć listę...
	if ($this.hasClass('clickable')) {
		//Rozwiń/zwiń listę
		$this.next('ul').slideToggle();
	//Jeśli jest to normalny element..
	} else {
		var $domekRozwijany = $this.parent('ul').prev('li'),
			$allElems = $this.siblings().addBack(),
			$opcje = $this.closest('.opcje'),
			$panel = $opcje.parent();
		//Aktywuj kliknięty element
		$this.toggleClass('active');
		//Jeśli któryś z elementów jest aktywny, aktywuj również przycisk rozwijania listy dla tej listy
		$allElems.hasClass('active') ? $domekRozwijany.add($opcje).add($panel).addClass('active') : $domekRozwijany.add($opcje).add($panel).removeClass('active');
		podlicz($panel);
	}
});

//Funkcja podliczająca cenę wybranych elementów
function podlicz(panel) {

	//Ustal cenę bazową za metr
	var cenaBazowa = panel.data('cenabazowa'),
		iloscMetrow = panel.find('[name=metraz]').val(),
		mini = Math.ceil(cenaBazowa[0] * iloscMetrow / 10) * 10,
		midi = Math.ceil(cenaBazowa[1] * iloscMetrow / 10) * 10,
		maxi = Math.ceil(cenaBazowa[2] * iloscMetrow / 10) * 10;

	//Dodaj ceny aktywnych elementów
	panel.find('.opcje li[data-cena].active').each(function() {
		var cena = $(this).data('cena');
		mini += cena[0];
		midi += cena[1];
		maxi += cena[2];
	});

	panel.data('cenakoncowa', [mini, midi, maxi]);

	//Zaktualizuj wartości na stronie
	$('#main.wycena .pakiety .mini .cena').text(panel.data('cenakoncowa')[0]);
	$('#main.wycena .pakiety .midi .cena').text(panel.data('cenakoncowa')[1]);
	$('#main.wycena .pakiety .maxi .cena').text(panel.data('cenakoncowa')[2]);

	panel.find('.wybierz-pakiet .mini .cena').text(mini);
	panel.find('.wybierz-pakiet .midi .cena').text(midi);
	panel.find('.wybierz-pakiet .maxi .cena').text(maxi);

	panel.find('.wybierz-pakiet .mini .kwota').text(mini);
	panel.find('.wybierz-pakiet .midi .kwota').text(midi);
	panel.find('.wybierz-pakiet .maxi .kwota').text(maxi);
}

//Zmiana ilości metrów w formularzu
$('#main.wycena [name=metraz]').on('change keyup', function() {
	var metraz = parseInt($(this).val());
	if (isNaN(metraz) || metraz < 0) {
		$(this).val('');
	} else {
		podlicz($(this).parent().parent().parent());
	}
});

//Wybór pomieszczenia
$('#main.wycena .wybierz_pomieszczenie').on('click', 'li', function() {
	przelaczPomieszczenie($(this));
});

//Przycisk "Przejdź do kolejnego pomieszczenia"
$('#main.wycena').on('click', '.przyciski .kolejne-pomieszczenie', function() {
	var $next = $('#main.wycena .wybierz_pomieszczenie li.active').next('li');
	if ($next.length == 0) {
		$next = $('#main.wycena .wybierz_pomieszczenie li:first');
	}
	przelaczPomieszczenie($next);
	window.scrollTo(0, 0);
});

//Funkcja porzełączania aktywnych pomieszczeń
function przelaczPomieszczenie(link) {
	link.activate();
	var panelDoPokazania = link.data('panel');
	$('#main.wycena .listy .panel').hide().filter('.' + panelDoPokazania).show();

	var $panel = $('#main.wycena .listy .' + panelDoPokazania);

	if (typeof $panel.data('cenakoncowa') !== 'undefined') {
		$('#main.wycena .pakiety .mini .cena').text($panel.data('cenakoncowa')[0]);
		$('#main.wycena .pakiety .midi .cena').text($panel.data('cenakoncowa')[1]);
		$('#main.wycena .pakiety .maxi .cena').text($panel.data('cenakoncowa')[2]);
	} else {
		$('#main.wycena .pakiety .mini .cena').text('0');
		$('#main.wycena .pakiety .midi .cena').text('0');
		$('#main.wycena .pakiety .maxi .cena').text('0');
	}
}

//Dodanie do strony wspólnych paneli (kolorystyka, styl itd.)
$('<div>').load('../interiordesign/pakiety.html', function() {
	$('.panel').append($(this).html());
});

//Wybór koloru z palety
$('#main.wycena').on('click', '.dostepne li', function() {
	var $this = $(this),
		bgc = $this.css('background-color');
	$this.parent().prev('.wybrane').find('li').each(function() {
		if (!$(this).hasClass('wybrany')) {
			$(this)
				.css('background-color', bgc)
				.addClass('wybrany')
				.find('.fa').css('color', bgc);
			return false;
		}
	});
});

$('#main.wycena').on('click', '.wybierz-pakiet .pakiet', function() {
	$(this).activate();
});

//Wybranie samego koloru z palety nie tworzy wpisu w zamówieniu (bo panel nie ma klasy opcje, trzeba to jakoś obejść)
//Pozwolić na wpisanie w metrażu tylko liczb dodatnich, zająć się rozpoznawaniem przecinka
//ZRobić aneks kuchenny w salonie

$('#main.wycena').on('click', '.wybrane li', function() {
	$(this).css({
		'background-color' : '#FFF',
		'color' : '#FFF'
	}).removeClass('wybrany');
});

$('#zamow').on('click', function() {
	zbierzZamowienie();
	$('#zamowienie').fadeIn();
});

$('#formularz_zamowienia').on('click', '.powrot', function() {
	$('#formularz_zamowienia').fadeOut('normal', function() {
		$('.pomieszczenie-wrap').fadeIn();
	});
});

$('#zamowienie').on('click', function() {
	$(this).fadeOut('normal', function() {
		wyczyscZamowienie();
	});
});

var $regulamin = $('#regulamin');

$('#main.wycena').on('click', '.przyciski .zamow', function() {
	//Dodanie regulaminu
	$regulamin.load('../interiordesign/regulamin.html', function() {
		$regulamin.css('display', 'flex').hide().fadeIn();
	});
});

$('#main.wycena .pakiety .uwagi').on({
	click : function() {
		$(this).addClass('active');
	},
	mouseleave : function() {
		$(this).removeClass('active');
	}
});

$regulamin.on('click', 'button', function() {
	if ($(this).data('regulamin') === 'tak') {
		$('.pomieszczenie-wrap').hide();
		$('#formularz_zamowienia').show();
		window.scrollTo(0, 0);
	}
	$regulamin.fadeOut();
});

$regulamin.on('click', '> .fa', function() {
	$regulamin.fadeOut();
});

// *** Wysyłanie zamówienia
$('form[name=zamowienie]').on('submit', function(e) {
	e.preventDefault();
	zbierzZamowienie();
	var $this = $(this),
		$submit = $this.find('.submit'),
		$realSubmit = $this.find('[type=submit]');
	//Pokaż animację ładowania
	$submit.addClass('loading active');
	//Deaktywuj wysyłanie kolejnych wiadomości kiedy trwa przetwarzanie
	$realSubmit.attr('disabled', 'disabled');
	//Zbierz zawartość formularza
	var data = $this.serializeArray();
	//Dodanie zawartości zamówienia
	data.push({name: "zamowienie", value: $('#zamowienie').html()});
	$.ajax({
		type: 'POST',
		url: this.action,
		data: $.param(data),
		success: function(daneZwrotne) {
			//Zbierz dane zwrotne
			var json = $.parseJSON(daneZwrotne);
			//Wyczyść formularz jeśli udało się wysłać wiadomość
			if (json.stan === 'ok') { $this.find('input').val(''); }
			//Zmień wygląd przycisku
			$submit.removeClass('loading').addClass(json.stan).find('.done-state').removeClass('fa-check fa-times').addClass(json.ikona);
			//Przywróć domyślny wygląd przycisku
			setTimeout(function() {
				$submit.removeClass('active');
				setTimeout(function() {
					$submit.removeClass('ok error');
					$realSubmit.removeAttr('disabled');
				}, 1000);
			}, 5000);
		}
	});
});

//Wysyłanie wiadomości
$('form[name=wiadomosc]').on('submit', function(e) {
	e.preventDefault();
	var $this = $(this),
		$submit = $(this).find('.submit');
	//loading($this, $this, 'on');
	$.ajax({
		type: 'POST',
		url:  'skrypty/wiadomosc.php',
		data: $this.serialize(),
		success: function(daneZwrotne) {
			//loading($this, $this, 'off');
			var json = $.parseJSON(daneZwrotne);
			//Wyczyść formularz
			$this.find('textarea').val('');
			//Zmień tekst przycisku
			$submit.addClass('zwrot ' + json.stan).find('.fa').removeClass('fa-check fa-times').addClass(json.ikona);
			setTimeout(function() {
				$submit.removeClass('zwrot ' + json.stan);
			}, 8000);
		}
	});
});

/* MAPA */
//http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
var googleMap = {
	stylesArray : [
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [{color: "#000000"}, {lightness: 17}]},
		{
			featureType: "landscape",
			elementType: "geometry",
			stylers: [{color : "#000000"}, {lightness : 20}]},
		{
			featureType: "road.highway",
			elementType: "geometry.fill",
			stylers: [{color : "#000000"}, {lightness : 17}]},
		{
			featureType: "road.highway",
			elementType: "geometry.stroke",
			stylers: [{color : "#000000"}, {lightness : 29}, {weight : 0.2}]},
		{
			featureType: "road.arterial",
			elementType: "geometry", 
			stylers: [{color : "#000000"}, {lightness : 18}]},
		{
			featureType: "road.local",
			elementType: "geometry", 
			stylers: [{color : "#000000"}, {lightness : 16}]},
		{
			featureType: "poi",
			elementType: "geometry", 
			stylers: [{color : "#000000"}, {lightness : 21}]},
		{
			elementType: "labels.text.stroke", 
			stylers: [{"visibility" : "on"}, {color : "#000000"}, {lightness : 16}]},
		{
			elementType: "labels.text.fill", 
			stylers: [{"saturation" : 36}, {color : "#000000"}, {lightness : 40}]},
		{
			elementType: "labels.icon", 
			stylers: [{"visibility" : "off"}]},
		{
			featureType: "transit",
			elementType: "geometry", 
			stylers: [{color : "#000000"}, {lightness : 19}]},
		{
			featureType: "administrative",
			elementType: "geometry.fill", 
			stylers: [{color : "#000000"}, {lightness : 20}]},
		{
			featureType: "administrative",
			elementType: "geometry.stroke", 
			stylers: [{color : "#000000"}, {lightness : 17}, {weight : 1.2}]}
	],
	start: function() {
		var telefonMediaQUery = 768;

		if ($(window).width() >= telefonMediaQUery) {
			google.maps.event.addDomListener(window, 'load', this.initialize());
		}
	},
	initialize: function() {
		var mapCanvas = document.getElementById('map-canvas'),
			wspolrzedne = new google.maps.LatLng(52, 21);
		var mapOptions = {
			center: wspolrzedne,
			zoom: 15, //0 - 22
			scrollwheel: false, //Zoom kółkiem myszy
			mapTypeId: google.maps.MapTypeId.ROADMAP, //ROADMAP, SATELLITE, HYBRID, TERRAIN
			backgroundColor: '#000000',
			mapTypeControl: false, //Zmiana sposobu wyswietlania - mapa, satelita, teren
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL //Mały przycisk zoom
			},
			disableDefaultUI: true,
			styles: this.stylesArray
		}

		var map = new google.maps.Map(mapCanvas, mapOptions)

		// https://developers.google.com/maps/documentation/javascript/markers#add
		var marker = new google.maps.Marker({
			position: wspolrzedne,
			icon: '/portfolio/interiordesign/img/marker.png',
			map: map
		});

		$('#map-canvas').click(function() {
			map.set('scrollwheel', true);
		});
	}
}
googleMap.start();

$('body').css('opacity', 1);

$(document).on('DOMMouseScroll mousewheel', '#regulamin > section', function(ev) {
    var $this = $(this),
        scrollTop = this.scrollTop,
        scrollHeight = this.scrollHeight,
        height = $this.height(),
        delta = (ev.type == 'DOMMouseScroll' ?
            ev.originalEvent.detail * -40 :
            ev.originalEvent.wheelDelta),
        up = delta > 0;

    var prevent = function() {
        ev.stopPropagation();
        ev.preventDefault();
        ev.returnValue = false;
        return false;
    }

    if (!up && -delta > scrollHeight - height - scrollTop) {
        // Scrolling down, but this will take us past the bottom.
        $this.scrollTop(scrollHeight);
        return prevent();
    } else if (up && delta > scrollTop) {
        // Scrolling up, but this will take us past the top.
        $this.scrollTop(0);
        return prevent();
    }
});

function zbierzZamowienie() {
	$('#zamowienie').empty();
	$('section.listy section.panel').each(function() {
		//Jeśli dane pomieszczenie zostało zaznaczone...
		if ($(this).hasClass('active')) {
			var nazwaPomieszczenia = $(this).attr('class').split(' ')[1],
				pelnaNazwaPomieszczenia = $(this).children('h1').text();
				//Przerobić na coś w tym stylu
				//var $pozycjaZamowienia = $('<div style="font-size: 12p...').appendTo($('#zamowienie'));
			$('#zamowienie').append('<div style="font-size: 12px; border: 1px solid; padding: 5px; margin-bottom: 10px; background: rgba(0,0,0,0.05);" class="pomieszczenie ' + nazwaPomieszczenia + '"><h2 class="nazwa_pomieszczenia">' + pelnaNazwaPomieszczenia + '</h2><div><h3>Metraż</h3><p class="wybrany_metraz"></p></div><div><h3>Budżet</h3><p class="wybrany_budzet"></p></div><div><h3>Preferencje</h3><p class="opisane_preferencje"></p></div><div><h3>Wybrane opcje</h3><ul style="list-style: none;" class="wybrane_opcje"></ul></div><div><h3>Wybrane kolory</h3><ul style="list-style: none;" class="kolorystyka"></ul></div><div class="pakiet"><h3>Wybrany pakiet</h3><p><span class="nazwa"></span> <span class="cena"></span> PLN</p></div></div>');
			var $pozycjaZamowienia = $('#zamowienie .' + nazwaPomieszczenia);

			//Dla każdej opcji, która została zaznaczona w danym pomieszczeniu...
			$('.listy .panel.' + nazwaPomieszczenia + ' .opcje.active').each(function(i) {
				var $opcja = $(this);
				$pozycjaZamowienia.find('.wybrane_opcje').append('<li>'+$opcja.find('legend').text()+'<ul style="list-style: none;" class="kategoria kategoria_' + i + '"></ul></li>');
				$opcja.find('> ul > li.active').each(function(n) {
					if ($(this).hasClass('clickable')) {
						$pozycjaZamowienia.find('.kategoria_' + i).append('<li>'+$(this).text()+'<ul style="list-style: none;" class="podkategoria_'+n+'"></ul></li>');
						$(this).next('ul').find('li.active').each(function() {
							$pozycjaZamowienia.find('.podkategoria_' + n).append('<li>'+$(this).text()+'</li>');
						});
					} else {
						$pozycjaZamowienia.find('.kategoria_' + i).append('<li>'+$(this).text()+'</li>');
					}
				});
			});

			var $wybraneKolory = $(this).find('.kolory .wybrane .wybrany').clone();
			$wybraneKolory.each(function() {
				$(this)
					.text($(this).css('background-color'))
					.css({
						'color' : 'black',
						'display' : 'inline-block',
						'height' : '40px',
						'margin' : '5px',
						'padding' : '4px'
					});
			});
			$wybraneKolory.appendTo($pozycjaZamowienia.find('.kolorystyka'));
			
			$pozycjaZamowienia.find('.pakiet .nazwa').text($(this).find('.wybierz-pakiet .pakiet.active .nazwa').text());
			$pozycjaZamowienia.find('.pakiet .cena').text($(this).find('.wybierz-pakiet .pakiet.active .cena').text());

			$pozycjaZamowienia.find('.wybrany_metraz').html($(this).find('[name=metraz]').val() + ' m<sup>2</sup>');
			$pozycjaZamowienia.find('.wybrany_budzet').text($(this).find('[name=budzet]').val() + ' PLN');
			$pozycjaZamowienia.find('.opisane_preferencje').text($(this).find('[name=preferencje]').val());
		}
	});
}

function wyczyscZamowienie() {
	$('#zamowienie').empty();
}

//suwaki.init(['/portfolio/interiordesign/img/szablon.png', '/portfolio/interiordesign/img/kontakt.jpg', '/portfolio/interiordesign/img/aplikacja.jpg']);

});