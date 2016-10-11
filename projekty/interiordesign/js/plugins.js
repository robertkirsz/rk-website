// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	//Dodaje klasę 'active' do elementu i usuwa ją z siblingów
	$.fn.activate = function() {
		this.addClass('active').siblings().removeClass('active');
		return this;
	};

	//Funkcja do preloadowania plików
	$.fn.preload = function() {
		this.each(function() {
			$('<img/>')[0].src = this;
		});
	};

}());

/* SUWAKI */
var suwaki = {
	strona: $('#main'), //Główny element zawierający całą stronę
	grafiki: [], //tablica przetrzymująca ścieżki i wymiary szablonów
	init: function(sciezkaImg) {

		//Utwórz suwaki i dodaj tło		
		$('body').append('<div id="suwaki"><div class="suwak tlo"><span class="opis">Background</span></div><div class="suwak strona"><span class="opis">Strona</span></div><div class="przyciski"></div></div><div id="tlo"></div>');
		
		//Zapisz element tła
		this.tlo = $('#tlo');

		//Pobierz ewentualne dane zapisane w pamięci
		var tloOpacity = localStorage['przezroczystosc-tla'] || 0,
			stronaOpacity = localStorage['przezroczystosc-strony'] || 1;

		//Ustaw przezroczystość strony i tła (jeśli zostały wcześniej zapisane) i ustaw domyślne style
		this.tlo.css({
			'opacity': tloOpacity,
			'position': 'absolute',
			'left': '50%',
			'z-index': 1
		});

		this.strona.css({
			'opacity': stronaOpacity,
			'position': 'absolute',
			'top': 0,
			'width': '100%',
			'z-index': 2
		});
		
		//Dla każdej z przekazanych grafik utwórz przycisk i zapisz wymiary grafiki w suwaki.grafiki
		$(sciezkaImg).each(function(i, sciezka) {
			var przycisk = '<input type="radio" name="tlo" value="' + i + '" title="' + sciezka + '">';
			$('#suwaki .przyciski').append(przycisk);
			var img = new Image();
			img.src = sciezka;
			$(img).on('load', function() {
				suwaki.grafiki.push({'index' : i, 'sciezka' : sciezka, 'width' : img.width, 'height' : img.height});
				//Aktywuj pierwszy przycisk
				if (i == 0) $('#suwaki .przyciski input').eq(i).trigger('click');
			});
		});

		//Po kliknięciu na przycisk pobierz jego wymiary i ścieżkę i zaktualizuj na stronie
		$('#suwaki .przyciski').on('click', 'input', function() {
			var index = $(this).val(),
				sciezka = suwaki.grafiki[index].sciezka,
				width = suwaki.grafiki[index].width,
				height = suwaki.grafiki[index].height;
			suwaki.tlo.css({
				'background': 'white url(' + sciezka + ') no-repeat center top',
				'width': width,
				'height': height,
				'margin-left': -width / 2
			});
		});

		//Obsługa suwaków
		$('.suwak.tlo').slider({
			orientation: 'vertical',
			min: 0,
			max: 10,
			value: tloOpacity * 10,
			slide: function(event, ui) {
				suwaki.tlo.css('opacity', ui.value / 10);
			}
		});
		
		$('.suwak.strona').slider({
			orientation: 'vertical',
			min: 0,
			max: 10,
			value: stronaOpacity * 10,
			slide: function(event, ui) {
				suwaki.strona.css('opacity', ui.value / 10);
			}
		});
		
		//Zapisz poziom przezroczystości przy zamykaniu strony
		$(window).on('unload', function() {
			localStorage.setItem('przezroczystosc-tla', suwaki.tlo.css('opacity'));
			localStorage.setItem('przezroczystosc-strony', suwaki.strona.css('opacity'));
		});
	}
};

// Place any jQuery/helper plugins in here.
