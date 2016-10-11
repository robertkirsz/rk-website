$(function() {

// ---------- ZMIENNE -----------------
	var gryf = $('#gryf'),
		progi = gryf.find('td').not('td.strum'), //Progi gryfu, bez ostatniej kolumny
		gitara = $('#gitary .gitara'),
		ciemneTlo = $('#ciemne-tlo'),
		trzeciProg = gryf.find('tr:first-child').find('td:nth-child(4)'),
		szerokoscProgu = trzeciProg.width(), //Szerokość trzeciego progu - do obliczania rozmiaru gryfu
		akordy = $('.akord'), //Przyciski akordów
		tabulatura = $('.wskazniki'), //Tabulatura
		wskaznikiTabulatury = $('.wskazniki li'), //Wskaźniki tabulatury
		glosnosc = $('#poziom-glosnosci'), //Wartość liczbowa poziomu głośności
		suwak = $('#suwak'), //Suwak głośności, slider z jQuery UI
		kosz = $('.kosz'), //Kosz :)
		aktywnaGitara = '', //Nazwa wybranej gitary
		przegladarka = navigator.userAgent, //Nazwa przeglądarki
		wyciszenie = false, //Wyciszenie gryfu
		kliknieto = [false, false], //Okienko z informacją
		//NAGRYWANIE
		nagrywanie = false, //Przy true zapisywane są dźwięki po kliknięciu na progu
		mierzenieCzasu = false, //True - mierzenie czasu przerw zatrzymane; false - mierzenie włączone
		zapisaneStruny = [], //Tablica z numerami zebranych strun
		zapisaneProgi = [], //Tablica z numerami zebranych progów
		poczatki = [], //Tablica z wartościami 'start' zebranych dźwięków
		bazaOdstepow = [], //Tablica z odstepami czasowymi pomiędzy dźwiękami
		czasOdstepow = 0, //Pierwszy odstęp jest równy 0, dźwięk odgrywany od razu
		interwalMierzeniaPrzerw, //Interwał mierzenia przerw w dźwiękach
		//DŹWIĘKI
		interwalyDzwiekow = [null, null, null, null, null, null], //Tablica sześciu interwalów, dla każdej struny osobno
		rozszerzenieDzwieku = Modernizr.audio.m4a ? '.m4a' : Modernizr.audio.ogg ? '.ogg' : '.mp3', //Rozszerzenie pliku audio
		zestawDzwiekow = { 'acoustic' : [], 'les-paul' : [], 'strat' : [] }, //Tablice z dzwiękami dla każdej gitary osobno, po sześć kanałów dla sześciu strun
		dlugoscDzwieku = 1000; //Czas odgrywania pojedynczego dźwięku

// ---------- INICJALIZACJA -----------
	
	//Wykrycie przeglądarki
	if (/firefox/i.test(przegladarka)) { 
		$('html').addClass('firefox');
	} else if (/opera/i.test(przegladarka)) {
		$('html').addClass('opera');
		var opera = true;
	}

	//Utwórz elementy etykiet z opisami pobranymi z atrybutu 'title' przycisków
	$('#panel-nagrywania button, #tabulatura button, #panel-dolny button').each(function() {
		$(this)
			.append($('<span class="title">' + $(this).attr('title') + '</span>'))
			.removeAttr('title');
	});

	//Dodaj znaczniki span elementów, dzięki czemu można będzie modyfikować ich wygląd w CSS
	progi.wrapInner('<p />').prepend('<span />');
	gitara.append('<span />');
	$('.podpis').append('<div class="kolor" />');

	//Wymagane w Firefoxie do wypozycjonowania liter na gryfie
	if ($('html').hasClass('firefox')) {
		gryf.find('p').wrap('<div />');
	}

	//Dla przeglądarek nieobsługujących border-image
	if ($('html').hasClass('no-borderimage')) {
		gryf.wrap('<div class="border-image" />');
	}

	//Jeżeli w pamięci zapisana jest aktywna gitara...
	if (localStorage['gitara'] != null) {
		//Aktualizuj zmienne
		aktywnaGitara = localStorage['gitara'];
		$('body').addClass(aktywnaGitara);
		//Pokaż gryf
		$('#gryf-wrap').fadeIn(1000);
		
		//Dostosuj rozmiar gryfu do wymiarów okna przeglądarki
		if (aktywnaGitara == 'strat') {
			gryf.css('background-size', '21px 21px, 21px 21px, 21px 21px, 21px 21px, 21px 21px, 21px 21px, 1309px 240px');
		} else if (aktywnaGitara == 'acoustic') {
			gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
		} else {
			gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
		}
	} else {
		//Wykonaj efekt pojawiania się zawartości strony
		$('#gitary').fadeIn(1000);
	}

	//Funkcja zmiany ułożenia znaczników na gryfie w zależności od rozmiaru okna
	$(window).resize(function() {
		szerokoscProgu = trzeciProg.width();
		if (szerokoscProgu < 124) {
			if ($('body').hasClass('acoustic')) {
				gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
			} else if ($('body').hasClass('les-paul')) {
				gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
			}
	 	}
	});

// ---------- WYBÓR GITARY ------------

	//Pojawienie się okienka z informacją o wyborze gitary
	if (localStorage['infoGitarowe'] == 'nie') {
		$('#gitary + .info').remove();
	} else {
		var infoTimeout = setTimeout(function() {
			if ($('#gryf-wrap').is(':hidden')) {
				$('#gitary + .info').fadeIn();
			}
		}, 1500);
	}

	//Jeśli wybrano gitarę i kliknięto w podpis, usuń okienko z instrukcją
	var usuwanieInfo = function() {
		if (kliknieto[0] == true && kliknieto[1] == true) {
			$('#gitary + .info').fadeOut('normal', function() {
				$(this).remove();
				localStorage.setItem('infoGitarowe', 'nie');
			});
		}
	}

	//Po kliknięciu na gitarę...
	gitara.on('click', function() {
		//Gryfowi przypisz klasę taką samą, jak id klikniętej gitary
		$('body').removeClass('acoustic les-paul strat').addClass(this.id);
		//Ukryj gitary
		$('#gitary').fadeOut(300);
		//Sprawdzenie czy można już usunąć instrukcję
		clearTimeout(infoTimeout);
		kliknieto[0] = true;
		usuwanieInfo();
		$('#gitary + .info').fadeOut(300);
		//Pokaż gryf
		$('#gryf-wrap').delay(400).fadeIn(300);
		ciemneTlo.removeClass('wiecej');
		//Jeśli nie jest to pierwszy wybór gitary...
		if (aktywnaGitara != this.id) {
			//Zatrzymaj dźwięki jeśli trwa odgrywanie
			if ($('.play').hasClass('stop') || $('#nagrania li').hasClass('stop')) {
				for (var i = 0; i < 6; i++) {
					zestawDzwiekow[aktywnaGitara][i].pause();
				}
			}
			//Uczyń wybraną gitarę aktywną
			aktywnaGitara = this.id;
			//Ustaw odpowiedni rozmiar elementów tła zależnie od wybranej gitary
			if (aktywnaGitara == 'strat') {
				gryf.css('background-size', '21px 21px, 21px 21px, 21px 21px, 21px 21px, 21px 21px, 21px 21px, 1309px 240px');
			} else if (aktywnaGitara == 'acoustic') {
				gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
			} else {
				gryf.css('background-size', szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.613 + 'px 132px, ' + szerokoscProgu * 0.508 + 'px 147px, ' + szerokoscProgu * 0.524 + 'px 150px, ' + szerokoscProgu * 0.451 + 'px 165px, 848px 240px');
			}
		}
		//Zapisywanie stanu aplikacji dla Opery
		if (opera) { localStorage.setItem('gitara', aktywnaGitara); }
	});

	//Po kliknięciu na podpis...
	gitara.on('click', '.podpis', function(e) {
		e.stopPropagation();
		//Sprawdzenie czy można już usunąć instrukcję
		kliknieto[1] = true;
		usuwanieInfo();
		//Pobierz drugą z klas klikniętego podpisu, pokaż odpowiadające mu okienko z gitarą i ukryj pozostałe
		$('#ciemne-tlo .' + $(this).attr('class').split(' ')[1]).addClass('active').siblings('.artysta').removeClass('active');
		//Wyświetl okienko z informacjami o gitarze
		$('.zamkniecie').show();
		ciemneTlo.addClass('wiecej').fadeIn();
		//Przyciemnij tło
		$('body').addClass('ukryj');
		//Wyzeruj stan galerii i uruchom automatyczne przewijanie
		galeria.zerowanie($(this).attr('class').split(' ')[1]);
		galeria.loading();
		galeria.autoPrzewijanie($(this).attr('class').split(' ')[1]);
	});

// ---------- CIEMNE TŁO --------------

	//Po kliknięciu na tło...
	ciemneTlo.add($('.zamkniecie')).on('click', function() {
		if ($(this).hasClass('wiecej')) { galeria.czyszczenieInterwalow(); }
		ciemneTlo.fadeOut('normal', function() {
			$(this).removeClass('pomoc wiecej');
		});
		$('body').removeClass('ukryj');
	});

	//ZatrzyDur propagację przy kliknięciu nie na tło, gdy jest przyciemnione
	ciemneTlo.on('click', '.pomoc, .artysta', function(e) { e.stopPropagation(); });

	var pomoc = {
		el: {
			pomoc: $('#ciemne-tlo .pomoc'),
			pasek: $('#ciemne-tlo .pomoc .slajdy'),
			slajdy: $('#ciemne-tlo .pomoc .slajdy li'),
			instrukcje: $('#ciemne-tlo .pomoc .instrukcje'),
			podswietlenie: $('#ciemne-tlo .pomoc .podswietlenie'),
			nawigacja: $('#ciemne-tlo .pomoc nav li')
		},
		inicjalizacja: function() {
			//Nadaj oknu pomocy szerokość równą sumie szerokości jego elementów - utworzy się pasek z elementów ułożonych jeden obok drugiego
			this.el.pasek.width(this.el.slajdy.width() * this.el.slajdy.size());
			this.el.nawigacja.on('click', function() { pomoc.klikniecie($(this)); });
			//Zapisz różnicę wymiaru elementów jako ograniczenie ruchu przy przesuwaniu obrazka
			this.el.ograniczenieLeft = $('#ciemne-tlo .obrazek').width() - $('#ciemne-tlo .grafika').width();
			this.el.ograniczenieTop = $('#ciemne-tlo .obrazek').height() - $('#ciemne-tlo .grafika').height();
			//Podświetlanie wskaźników po najechaniu kursorem na instrukcję
			this.el.instrukcje.on({
				mouseenter: function() { pomoc.ruchPodswietlenia($(this)); },
				mouseleave: function() { pomoc.powrotPodswietlenia($(this)); }
			}, 'li');
			//Jeśli w localStorage nie jest zapisane inaczej, utwórz strzałkę w oknie pomocy
			if (localStorage['strzalka'] != 'false') {
				this.el.instrukcje.eq(0).append('<div id="strzalka" />');
			}
			//Usuń strzałkę po najechaniu kursorem w jej pobliżu
			this.el.instrukcje.on('mouseenter', function() {
				$('#strzalka').fadeOut('normal', function() {
					$(this).remove();
				});
				//Zapisz informacje o tym w Local Storage
				localStorage.setItem('strzalka', 'false');
			});
		},
		klikniecie: function(to) {
			//Zmień szerokość i przesuń podświetlenie
			this.el.podswietlenie.width(to.outerWidth())
							   	  .css('left', to.position().left);
			//Przesuń pasek z elementami - zostanie przesunięty w lewo o szerokość pojedynczego elementu razy indeks kliknietego przycisku
			this.el.pasek.css('left', - to.index() * $('.slajdy li').outerWidth());
		},
		ruchPodswietlenia: function(to) {
			var obrazek = to.parent().siblings('.obrazek'),
				grafika = obrazek.find('.grafika'),
				wskaznik = obrazek.find('.' + to.data('wskaznik')),
				pozycja = wskaznik.position(),
				wskaznikSzer = wskaznik.outerWidth() / 2,
				wskaznikWys = wskaznik.outerHeight() / 2,
				//Wyśrodkuj widok na wskaźniku
				top = -pozycja.top + obrazek.height() / 2 - wskaznikWys,
				left = -pozycja.left + obrazek.width() / 2 - wskaznikSzer;
			//Ogranicza ruch w pionie
			if (top < pomoc.el.ograniczenieTop) { top = pomoc.el.ograniczenieTop; }
			else if (top > 0) { top = 0; }
			//Ogranicza ruch w poziomie
			if (left < pomoc.el.ograniczenieLeft) { left = pomoc.el.ograniczenieLeft; }
			else if (left > 0) { left = 0; }
			//Przesuń widok na wskaźnik
			grafika.css({
				'top'  : top,
				'left' : left
			});
			//Podświetl wskaźnik
			wskaznik.addClass('active');
		},
		powrotPodswietlenia: function(to) {
			to.parent().siblings('.obrazek')
				.find('.grafika').css({ 'top' : 0, 'left' : 0 })
				.find('.' + to.data('wskaznik')).removeClass('active');
		}
	};
	pomoc.inicjalizacja();

	var lupa = {
		lupa: {},
		rozmiar: { szer: 0, wys: 0 },
		offset: {},
		ramka: { lupa: 0, zdjecie: 0 },
		duzy: { szer: 0, wys: 0 },
		maly: { szer: 0, wys: 0 },
		kursor: { X: 0, Y: 0 },
		inicjalizacja: function(element) {
			//Dodatkowy element dla przeglądarek bez wsparcia dla pointer-events
			if (!Modernizr.pointerevents) {	element.prepend($('<div />', { class: 'ekran' })); }
			element.on({
				mouseenter: function() {
					var $this = $(this);
					lupa.lupa = $this.find('.lupa');
					//Pozycja elementu względem okna przeglądarki
					lupa.offset = $this.offset();
					//Szerokość ramek
					lupa.ramka.lupa = parseInt(lupa.lupa.css('border-top-width'), 10);
					lupa.ramka.zdjecie = parseInt($this.css('border-top-width'), 10);
					//Utwórz element Image, żeby pobrać wartości obrazka elementu
					var zdjecie = new Image(),
						sciezka = $this.find('img').attr('src').replace(/url\(|\)$|"/ig, '');
					//Podmień obrazek mały na duży
					zdjecie.src = sciezka.replace('.png', '-big.png');
					//Pobierz wymiary obrazków
					$(zdjecie).on('load', function() {
						lupa.duzy.szer = zdjecie.width;
						lupa.duzy.wys = zdjecie.height;
					});
					lupa.maly.szer = $this.outerWidth();
					lupa.maly.wys = $this.outerHeight();
					lupa.rozmiar.szer = lupa.lupa.outerWidth() / 2;
					lupa.rozmiar.wys = lupa.lupa.outerHeight() / 2;
				},
				mousemove: function(e) {
					//Pozycja kursora wewnątrz elementu = pozycja kursora względem dokumentu - pozycja elementu względem dokumentu
					lupa.kursor.X = Math.round(e.pageX - lupa.offset.left);
					lupa.kursor.Y = Math.round(e.pageY - lupa.offset.top);
					//Pozycja lupy = pozycja kursora - szerokość ramki gitary - połowa rozmiaru lupy
					var lupaX = lupa.kursor.X - lupa.ramka.zdjecie - lupa.rozmiar.szer,
						lupaY = lupa.kursor.Y - lupa.ramka.zdjecie - lupa.rozmiar.wys,
						//Pozycja tła = pozycja kursora * stosunek dużego obrazka do małego - połowa rozmiaru lupy - szerokość ramki lupy
						tloX = Math.round(lupa.kursor.X * lupa.duzy.szer / lupa.maly.szer - lupa.rozmiar.szer) + lupa.ramka.lupa,
						tloY = Math.round(lupa.kursor.Y * lupa.duzy.wys / lupa.maly.wys - lupa.rozmiar.wys) + lupa.ramka.lupa,
						tlo = -tloX + 'px ' + -tloY + 'px';
					//Aktualizuj lupę
					lupa.aktualizacja(lupaY, lupaX, tlo);
				}
			});
		},
		aktualizacja: function(gora, lewo, tlo) {
			//Aktualizuj położenie lupy
			this.lupa.css({
				top: gora,
				left: lewo,
				backgroundPosition: tlo
			});
		},
	};
	lupa.inicjalizacja($('.artysta .gitara'));

	var galeria = {
		el: {
			galeria: $('.galeria'),
			slajdy: $('.galeria .slajd'),
			okienko: $('.galeria .okienko'),
			nawigacja: $('.galeria nav'),
			loading: $('.galeria .loading')
		},
		zmienneInterwalu: {
			'lennon'  : 1,
			'slash'   : 1,
			'hendrix' : 1
		},
		szerokoscSlajdu: 0,
		czasInterwalu: 0,
		interwalFunkcja: {},
		przesuniecie: 0,
		inicjalizacja: function(szerokosc, czas, przesuniecie) {
			$('#ciemne-tlo').prepend('<div id="log"></div>');
			//Zapisz przekazane parametry
			galeria.szerokoscSlajdu = szerokosc;
			galeria.czasInterwalu = czas;
			if (typeof przesuniecie !== 'undefined') {
				galeria.przesuniecie = przesuniecie;
			}
			//Ustawienie rozmiaru elementów
			this.el.slajdy.css('background-size', galeria.szerokoscSlajdu + 'px')
						  .add(this.el.okienko).css('width', galeria.szerokoscSlajdu + 'px');
			//Dla każdej galerii osobno...
			this.el.galeria.each(function() {
				var $this = $(this);
				//Ustaw szerokość paska ze slajdami
				$this.find('.pasek').width(
						galeria.szerokoscSlajdu * $this.find('.slajd').size()
				);
				//Utwórz przyciski nawigacji
				for (var i = 1, l = $this.find('.slajd').size(); i <= l; i++) {
					$this.find('nav').append($('<a />', { href: '#' }));
				}
				//Zapisz przyciski do zmiennej i aktywuj pierwszy
				galeria.el.przycisk = galeria.el.nawigacja.find('a');
			});
			//Przy przewijaniu okienka...
			this.el.okienko.on('scroll', this.przewijanie);
			//Po kliknięciu na przycisk...
			this.el.przycisk.on('click', function(e) {
				e.preventDefault();
				galeria.klikniecie($(this));
			});
			//Po kliknięciu na galerię
			this.el.galeria.on('click', function() {
				galeria.czyszczenieInterwalow();
			});
		},
		zerowanie: function(autograf) {
			var $this = $('.artysta.' + autograf);
			//Ustal wysokość slajdu
			this.ustalWysokosc($this.find('.slajd').eq(0));
			//Przesuń na początek
			$this.find('.okienko').scrollLeft(0);
			//Aktywuj pierwszy przycisk
			$this.find('nav a').removeClass('active');
			$this.find('nav a:first-child').addClass('active');
		},
		klikniecie: function(to) {
			//Jeśli przycisk nie jest już aktywny...
			if (!to.is('.active')) {
				this.ustalWysokosc(to.parent().siblings('.okienko').find('.slajd').eq(to.index()));
				//Przesuń pasek o odpowiednią szerokość
				to.parent().siblings('.okienko').animate({
					scrollLeft: to.index() * galeria.szerokoscSlajdu
				}, 700);
				//Aktywuj odpowiedni przycisk
				to.addClass('active').siblings('a').removeClass('active');
			}
		},
		ustalWysokosc: function(slajd) {
			//Jeśli obrazek nie ma jeszcze zapisanej wysokości...
			if (!slajd.data('wysokosc')) {
				//Utwórz tymczasowy obrazek
				var img = new Image();
				//Przypisz mu ścieżkę do obrazka tła slajdu
				img.src = slajd.css('background-image').replace(/url\(|\)$|"/ig, '');
				//Po załadowaniu obrazka
				$(img).on('load', function() {
					//Pobierz jego wysokość i nadaj ją elementowi ze slajdami
					var wysokosc = parseInt(slajd.css('background-size'), 10) / img.width * img.height;
					slajd.height(wysokosc).parent('.pasek').height(wysokosc);
					//Zapisz wysokość
					slajd.data('wysokosc', wysokosc);
				});
			} else {
				//Wczytaj wysokość
				slajd.height(slajd.data('wysokosc')).parent('.pasek').height(slajd.data('wysokosc'));
			}
		},
		przewijanie: function() {
			var slajdy = $(this).find('.slajd'),
				iloscSljd = slajdy.size(), //Ilość slajdów
				szerSljd = galeria.szerokoscSlajdu, //Szerokość pojedyńczego slajdu
				pozScrl = $(this).scrollLeft(), //Aktualna wartość przesunięcia okienka
				szerScrl = szerSljd * (iloscSljd - 1), //Maksymalna wartość przesunięcia okienka
				lewy = Math.floor(pozScrl / szerSljd), //Indeks slajdu widocznego po lewej stronie
				prawy = Math.ceil(pozScrl / szerSljd); //Indeks slajdu widocznego po prawej stronie
				//Jeśli zadeklarowano przesunięcie przy inicjowaniu funkcji...
				if (galeria.przesuniecie) {
					var przesuwanie = (pozScrl - szerSljd * lewy) * galeria.przesuniecie / szerSljd, //Wraz z ruchem scrollbara zmienia wartość od 0 do 'maxPrzesuniecie' dla każdego slajdu od nowa
						przesuniecie = galeria.przesuniecie, //O tyle maksymalnie będzie przesuwane tło
						wzmocnienie = 1; //Wzmocnienie efektu - domyślnie 1 (bez wzmocnienia)
				//Jeśli nie zadeklarowano wartości przesunięcia...
				} else {
					var przesuniecie = szerSljd - szerScrl / iloscSljd, //O tyle maksymalnie będzie przesuwane tło
						przesuwanie = (pozScrl - szerSljd * lewy) * przesuniecie / szerSljd, //Wraz z ruchem scrollbara zmienia wartość od 0 do 'przesuniecie' dla każdego slajdu od nowa
						wzmocnienie = iloscSljd * 0.75; //Wzmocnienie efektu - domyślnie 1 (bez wzmocnienia)
						/* Efekt po wzmocnieniu różny w zależności od ilości slajdów:
						wzmocnienie == 1 && < iloscSljd : efekt normalny, im większa liczba, tym bardziej widoczne przesunięcie tła
						wzmocnienie == iloscSljd 		: efekt przejścia bez przesunięcia tła
						wzmocnienie == 2 * iloscSljd	: efekt ściskania się slajdu
						Wartości z innych zakresów dają różne dziwne przejścia */
				}
			//Jeśli jest widoczny tylko jeden slajd...
			if (lewy == prawy) {
				//Nie zmieniaj pozycji tła
				slajdy.css({ 'background-position': '0 0' });
			} else {
				//W przeciwnym razie przesuń odpowiednio tło
				slajdy.eq(lewy).css({ 'background-position': + przesuwanie * wzmocnienie + 'px 0' });
				slajdy.eq(prawy).css({ 'background-position': + (przesuwanie - przesuniecie) * wzmocnienie + 'px 0' });
			}
		},
		autoPrzewijanie: function(podpis) {
			interwalFunkcja = setInterval(function() { galeria.interwal(podpis) }, galeria.czasInterwalu);
		},
		interwal: function(artysta) {
			//Wyczyść pomocniczą zmienną z indeksami slajdów
			var zmienneInterwaluString = '';
			$.each(galeria.zmienneInterwalu, function(i, val) {
				zmienneInterwaluString += i + ' = ' + val + ' ';
			});
			var $this = $('.artysta.' + artysta);
			//Aktualizuj podświetlenie przycisków
			$this.find('a').eq(galeria.zmienneInterwalu[artysta]).addClass('active').siblings('a').removeClass('active');
			//Ustal wysokość slajdu
			galeria.ustalWysokosc($this.find('.slajd').eq(galeria.zmienneInterwalu[artysta]));
			//Przesuń slajdy
			$this.find('.okienko').animate({
				scrollLeft: galeria.zmienneInterwalu[artysta] * galeria.szerokoscSlajdu
			}, 1000);
			galeria.loading($this);
			//Zwiększ indeks slajdu
			galeria.zmienneInterwalu[artysta]++;
			//Jesli to ostatni slajd, wróc na początek
			if (galeria.zmienneInterwalu[artysta] > $this.find('.slajd').size() - 1) { galeria.zmienneInterwalu[artysta] = 0; }
		},
		czyszczenieInterwalow: function() {
			//Wyczyść interwał
			clearInterval(interwalFunkcja);
			//Zmiennym przypisz początkowe wartości
			galeria.zmienneInterwalu = {
				'lennon'  : 1,
				'slash'   : 1,
				'hendrix' : 1
			};
			if ($('.loading').is(':visible')) {
				$('.loading').stop().fadeOut('normal', function() {
					$(this).width(0);
				});
			}
		},
		loading: function(artysta) {
			artysta = artysta || $('.artysta');
			if (this.el.loading.is(':hidden')) {
				this.el.loading.show();
				//Animuj szerokość paska do długości slajdu
				artysta.find('.loading').animate({
					width: galeria.szerokoscSlajdu + 'px'
				}, galeria.czasInterwalu, 'linear', function() {
					//Po osięgnięciu pełnej długości wróć do początku
					$(this).width(0);
				});
			}
		}
	};
	//Ustal szerokość galerii w zależności od rozmiaru okna
	($(window).width() > 1366) ? galeria.inicjalizacja(500, 5000) : galeria.inicjalizacja(400, 5000);

// ---------- DŹWIĘKI -----------------

	//Zapełnij tablicę plikami Audio i dodaj do nich ścieżki do pliku
	for (var i = 0; i < 6; i++) {
		zestawDzwiekow['acoustic'].push(new Audio('dzwieki/acoustic' + rozszerzenieDzwieku));
		zestawDzwiekow['les-paul'].push(new Audio('dzwieki/les-paul' + rozszerzenieDzwieku));
		zestawDzwiekow['strat'].push(new Audio('dzwieki/strat' + rozszerzenieDzwieku));
	}

	//Ustawienie początku odgrywania dźwięku zależnie od progu
	gryf.find('td:not(td.strum)').each(function(i) {
		var start = (i * 1.6);
		//Jeśli wartość jest zmiennoprzecinkowa, zaokraglij ją do jednego miejsca po przecinku
		start = (start % 1 === 0) ? (i * 1.6) : ((i * 1.6).toFixed(1))
		$(this).data('start', start);
	});

	//Funkcja odgrywania dźwięku
	var zagraj = function(struna, start) {
			var dzwiek = zestawDzwiekow[aktywnaGitara][struna];
			clearInterval(interwalyDzwiekow[struna]);
			//Ustaw początek odgrywania
			dzwiek.currentTime = start;
			//Zagraj
			dzwiek.play();
			//Wstrzymaj odgrywanie po odpowiednim czasie
			interwalyDzwiekow[struna] = setInterval(function() {
				dzwiek.pause();
			}, dlugoscDzwieku);
		};

	//Funkcja odgrywania zapisanych dżwieków
	var odegrajZapisane = function(struny, poczatki, progi, odstepy, przycisk, deaktywacja, callback) {
		//Wyczyść aktywny akord, jeśli jakiś jest
		if (typeof aktywnyAkord !== 'undefined') {
			aktywnyAkord.removeClass();
			akordy.removeClass('active');
			$('.akord-info').text('Akord');
		}
		//Ustaw licznik i status odgrywania
		var numerDzwieku = 0;
		odgrywanie = true;
		przycisk.addClass('stop');
		//Dezaktywuj przyciski
		if (deaktywacja) { $('.usunOstatnie, .usunPamiec').attr('disabled', 'disabled'); }
		//Wewnętrzna funkcja rekurencyjna
		var petlaOdgrywania = function() {
			gryf.find('td').removeClass('active');
			//Jeśli rozpoczęto odgrywanie...
			if (odgrywanie) {
				//Wyświetl informację
				informacja('Odgrywam dzwiek ' + (numerDzwieku + 1) + ' z ' + struny.length);
				//Wyczyść aktualną pozycje w tabulaturze
				aktualizujWskazniki();
				//Odegraj dźwięk
				zagraj(struny[numerDzwieku], poczatki[numerDzwieku]);
				//Zaznaczaj progi
				$('tr').eq(struny[numerDzwieku]).find('td').eq(progi[numerDzwieku]).addClass('active');
				aktualizujWskazniki();
				//Jeśli dalej są jeszcze jakieś dźwięki...
				if (numerDzwieku < struny.length - 1) {
					//Zwiększ licznik
					numerDzwieku += 1;
					//Wywołaj ponownie funkcję
					setTimeout(petlaOdgrywania, odstepy[numerDzwieku]);
				//Jeśli nie ma więcej dźwięków...
				} else {
					//Z opóźnieniem równym długości dźwięku...
					setTimeout(function() {
						//Jeśli nie zastopowano ostatniego dźwięku, wyświetl informację
						if (odgrywanie) { informacja('Odtwarzanie zakonczone'); }
						//Wyłącz odgrywanie
						odgrywanie = false;
						gryf.find('td').removeClass('active');
						aktualizujWskazniki();
						przycisk.removeClass('stop');
						//Aktywuj przyciski
						if (deaktywacja) { $('.usunOstatnie, .usunPamiec').removeAttr('disabled'); }
						//Jeżeli jako callback podano jakąś funkcję
						if (typeof callback == 'function') { callback.call(this); }
					}, dlugoscDzwieku);
				}
			//Jeśli zakończono odgrywanie...
			} else {
				przycisk.removeClass('stop');
				if (deaktywacja) { $('.usunOstatnie, .usunPamiec').removeAttr('disabled'); }
			}
		};
		//Wywołaj funkcję po raz pierwszy
		petlaOdgrywania();
	}

// ---------- STRUNY ------------------

	//Po kliknięciu w próg...
	gryf.on('click', 'td:not(td.strum)', function() {
		var struna = $(this).parent('tr').index(),
			numerProgu = $(this).index(),
			start = $(this).data('start');
		//Zagraj dźwięk
		if (!wyciszenie) {
			zagraj(struna, start);
		}
		//Aktywuj próg, oraz zdezaktywuj wszystkie inne na tej samej strunie
		$(this).toggleClass('active').siblings().removeClass('active');
		//Zdezaktywuj przyciski akordów
		akordy.removeClass('active');
		aktualizujWskazniki();
		//Jeśli włączone jest nagrywanie...
		if (nagrywanie) {
			//Dodaj numer struny oraz współrzędne początku dźwięku do tablicy
			zapisaneStruny.push(struna);
			zapisaneProgi.push(numerProgu);
			poczatki.push(start);
			informacja('Dlugosc nagrywania: ' + zapisaneStruny.length);
			//Jeśli liczenie czasu jest w tej chwili zatrzymane...
			if (!mierzenieCzasu) {
				mierzenieCzasu = true;
				//Uruchom liczenie
				interwalMierzeniaPrzerw = setInterval(function() {
					$('#czas').text(czasOdstepow);
					czasOdstepow += 100; //Dokładność 0,1 sekundy
				}, 100);
			}
			//Zapisz czas odstepu do tablicy
			bazaOdstepow.push(czasOdstepow);
			//Wyzeruj licznik
			czasOdstepow = 0;
		}
	});

	//Po najechaniu kursorem lub kliknięciu struny...
	gryf.on('mouseenter click', 'td.strum', function() {
		//Pobierz wartości struny i progu
		struna = $(this).parent('tr').index();
		start = $(this).siblings('td.active').data('start');
		//Jeśli jest zaznaczony próg
		if (typeof start !== 'undefined') {
			zagraj(struna, start);
		}
	});

	//Funkcje sterujące błyskiem po najechaniu kursorem na struny
	gryf.on({
		mouseenter: function() {
			$(this).siblings('td.active').addClass('blysk');
		},
		mouseleave: function() {
			$(this).siblings('td.active').removeClass('blysk');
		},
	}, 'td.strum');

// ---------- KLAWIATURA --------------

	var bazaPowerChordow = {
			akordA : $('#struna3 td:nth-child(3), #struna4 td:nth-child(3), #struna5 td:nth-child(1)'),
			akordB : $('#struna3 td:nth-child(5), #struna4 td:nth-child(5), #struna5 td:nth-child(3)'),
			akordC : $('#struna3 td:nth-child(6), #struna4 td:nth-child(6), #struna5 td:nth-child(4)'),
			akordD : $('#struna2 td:nth-child(4), #struna3 td:nth-child(3), #struna4 td:nth-child(1)'),
			akordE : $('#struna4 td:nth-child(3), #struna5 td:nth-child(3), #struna6 td:nth-child(1)'),
			akordF : $('#struna4 td:nth-child(4), #struna5 td:nth-child(4), #struna6 td:nth-child(2)'),
			akordG : $('#struna4 td:nth-child(6), #struna5 td:nth-child(6), #struna6 td:nth-child(4)')
		},
		bazaAkordowKlawiatura = {
			'A Dur' : $('#struna1 td:eq(0), #struna2 td:eq(2), #struna3 td:eq(2), #struna4 td:eq(2), #struna5 td:eq(0)'),
			'B Dur' : $('#struna1 td:eq(2), #struna2 td:eq(4), #struna3 td:eq(4), #struna4 td:eq(4), #struna5 td:eq(2)'),
			'C Dur' : $('#struna1 td:eq(0), #struna2 td:eq(1), #struna3 td:eq(0), #struna4 td:eq(2), #struna5 td:eq(3)'),
			'D Dur' : $('#struna1 td:eq(2), #struna2 td:eq(3), #struna3 td:eq(2), #struna4 td:eq(0)'),
			'E Dur' : $('#struna1 td:eq(0), #struna2 td:eq(0), #struna3 td:eq(1), #struna4 td:eq(2), #struna5 td:eq(2), #struna6 td:eq(0)'),
			'F Dur' : $('#struna1 td:eq(1), #struna2 td:eq(1), #struna3 td:eq(2), #struna4 td:eq(3), #struna5 td:eq(3), #struna6 td:eq(1)'),
			'G Dur' : $('#struna1 td:eq(3), #struna2 td:eq(0), #struna3 td:eq(0), #struna4 td:eq(0), #struna5 td:eq(2), #struna6 td:eq(3)') 
		};

	//Po naciśnięciu klawisza
	$(document).on('keypress', function(e) {
		switch(e.which)	{
		case 97: //A
			klawiatura(bazaAkordowKlawiatura['A Dur'], $('[akord="A Dur"]'), 'klawiatura');
			break;
		case 98: //B
			klawiatura(bazaAkordowKlawiatura['B Dur'], $('[akord="B Dur"]'), 'klawiatura');
			break;
		case 99: //C
			klawiatura(bazaAkordowKlawiatura['C Dur'], $('[akord="C Dur"]'), 'klawiatura');
			break;
		case 100: //D
			klawiatura(bazaAkordowKlawiatura['D Dur'], $('[akord="D Dur"]'), 'klawiatura');
			break;
		case 101: //E
			klawiatura(bazaAkordowKlawiatura['E Dur'], $('[akord="E Dur"]'), 'klawiatura');
			break;
		case 102: //F
			klawiatura(bazaAkordowKlawiatura['F Dur'], $('[akord="F Dur"]'), 'klawiatura');
			break;
		case 103: //G
			klawiatura(bazaAkordowKlawiatura['G Dur'], $('[akord="G Dur"]'), 'klawiatura');
			break;
		case 65: //Shift + A
			klawiatura(bazaPowerChordow.akordA, $('[akord="A Dur"]'), 'power-chord');
			break;
		case 66: //Shift + B
			klawiatura(bazaPowerChordow.akordB, $('[akord="B Dur"]'), 'power-chord');
			break;
		case 67: //Shift + C
			klawiatura(bazaPowerChordow.akordC, $('[akord="C Dur"]'), 'power-chord');
			break;
		case 68: //Shift + D
			klawiatura(bazaPowerChordow.akordD, $('[akord="D Dur"]'), 'power-chord');
			break;
		case 69: //Shift + E
			klawiatura(bazaPowerChordow.akordE, $('[akord="E Dur"]'), 'power-chord');
			break;
		case 70: //Shift + F
			klawiatura(bazaPowerChordow.akordF, $('[akord="F Dur"]'), 'power-chord');
			break;
		case 71: //Shift + G
			klawiatura(bazaPowerChordow.akordG, $('[akord="G Dur"]'), 'power-chord');
			break;
		}
	 });
		
	//Funkcja uruchamiana po naciśnięciu odpowiedniego klawisza na klawiaturze
	var klawiatura = function(baza, akord, klasa) {
		//Odegraj dżwięki danego akordu
		$.each(baza, function() {
			zagraj($(this).parent('tr').index(), $(this).data('start'));
		});
		//Zaznacz progi na gryfie
		akord.addClass(klasa);
		baza.addClass(klasa);
		//Odznacz je po odegraniu akordu
		setTimeout(function() {
			akord.removeClass(klasa);
			baza.removeClass(klasa);
		}, dlugoscDzwieku);
	}

// ---------- GŁOŚNOŚĆ ----------------

	//Ustawienia suwaka
	suwak.slider({
		orientation: 'vertical',
		range: 'min',
		min: 0,
		max: 100,
		animate: true,
		slide: function(event, ui) {
			glosnosc.text(ui.value);
			for (var i = 0; i < 6; i++) {
				zestawDzwiekow['acoustic'][i].volume = (ui.value / 100);
				zestawDzwiekow['les-paul'][i].volume = (ui.value / 100);
				zestawDzwiekow['strat'][i].volume = (ui.value / 100);
			}
			glosnosc.css('bottom', (ui.value * 0.94) + '%');
		},
		start: function(event, ui) { glosnosc.addClass('active'); },
		stop: function(event, ui) {
			glosnosc.removeClass('active');
			//Zapisywanie stanu aplikacji dla Opery
			if (opera) { localStorage.setItem('glosnosc', ui.value); }
		}
	});

	//Wczytanie poziomu głośności
	if (localStorage['glosnosc']) {
		suwak.slider('option', 'value', localStorage['glosnosc']);
		for (var i = 0; i < 6; i++) {
			zestawDzwiekow['acoustic'][i].volume = (localStorage['glosnosc'] / 100);
			zestawDzwiekow['les-paul'][i].volume = (localStorage['glosnosc'] / 100);
			zestawDzwiekow['strat'][i].volume = (localStorage['glosnosc'] / 100);
		}
	} else {
		suwak.slider('option','value', 100);
	}

// ---------- WYŚWIETLACZ -------------

	//Funkcja aktualizowania wskaźników wciśniętych progów
	var spisAkordow = {
			'A Dur' : [0, 2, 2, 2, 0,-1], 'A Mol' : [0, 1, 2, 2, 0,-1], 'A 7' : [0, 2, 0, 2, 0,-1],
			'B Dur' : [2, 4, 4, 4, 2,-1], 'B Mol' : [2, 3, 4, 4, 2,-1], 'B 7' : [2, 0, 2, 1, 2,-1],
			'C Dur' : [0, 1, 0, 2, 3,-1], 'C Mol' : [3, 1, 0, 1, 3,-1], 'C 7' : [0, 1, 3, 2, 3,-1],
			'D Dur' : [2, 3, 2, 0,-1,-1], 'D Mol' : [1, 3, 2, 0,-1,-1], 'D 7' : [2, 1, 2, 0,-1,-1],
			'E Dur' : [0, 0, 1, 2, 2, 0], 'E Mol' : [0, 0, 0, 2, 2, 0], 'E 7' : [0, 0, 1, 0, 2, 0],
			'F Dur' : [1, 1, 2, 3, 3, 1], 'F Mol' : [1, 1, 1, 3, 3, 1], 'F 7' : [-1,1, 2, 1,-1, 1],
			'G Dur' : [3, 0, 0, 0, 2, 3], 'G Mol' : [3, 3, 3, 5, 5, 3], 'G 7' : [1, 0, 0, 0, 2, 3]
		};

	var informacja = function(wiadomosc) {
		$('.glowne-info').html(wiadomosc);
	}

// ---------- NAGRYWANIE --------------

	//Jeśli w Local Storage jest zapisana baza nagrań...
	if (localStorage['bazaNagran'] != null) {
		//Wczytaj bazę
		var bazaNagran = JSON.parse(localStorage['bazaNagran']),
			//Ustaw indeks poza ostatni element bazy
			indeksNagrania = parseInt(localStorage['indeksNagrania']);
	//Jeśli nie ma zapisanej bazy nagrań, utwórz nową z przykładowymi nagraniami
	} else {
		var bazaNagran = [{
			'struny'   : [3, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3],
			'początek' : [70.4, 46.4, 49.6, 70.4, 46.4, 51.2, 49.6, 70.4, 46.4, 49.6, 46.4, 70.4],
			'progi'    : [5, 3, 5, 5, 3, 6, 5, 5, 3, 5, 3, 5],
			'odstępy'  : [0, 500, 500, 750, 500, 500, 300, 900, 500, 500, 700, 500],
			'kolor'    : 'hsl(346, 80%, 50%)',
			'kaseta'   : 'hsl(0, 0%, 75%)',
			'tytuł'    : 'Smoke on the Water',
			'indeks'   : 0
		},
		{
			'struny'   : [3, 2, 1, 3, 3, 4, 5, 4,
						  3, 2, 1, 3, 3, 4, 5, 4,
						  4, 4, 3, 3, 3, 3, 3, 4, 5, 5,
						  4, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2],
			'początek' : [76.8, 52.8, 33.6, 73.6, 70.4, 91.2, 104, 94.4,
						  76.8, 52.8, 33.6, 73.6, 70.4, 91.2, 104, 94.4,
						  91.2, 94.4, 70.4, 73.6, 75.2, 73.6, 70.4, 83.2, 104, 108.8,
						  94.4, 70.4, 73.6, 75.2, 70.4, 73.6, 70.4, 62.4, 76.8, 52.8, 52.8, 56],
			'progi'    : [9, 7, 8, 7, 5, 5, 0, 7,
						  9, 7, 8, 7, 5, 5, 0, 7,
						  5, 7, 5, 7, 8, 7, 5, 0, 0, 3,
						  7, 5, 7, 8, 5, 7, 5, 0, 9, 7, 7, 9],
			'odstępy'  : [0, 300, 300, 300, 1100, 300, 300, 300,
						  1100, 300, 300, 300, 1100, 300, 300, 300,
						  1100, 200, 200, 300, 300, 300, 1000, 300, 300, 300,
						  1100, 300, 300, 300, 300, 200, 800, 300, 300, 300, 300, 300],
			'kolor'    : 'hsl(279, 100%, 38%)',
			'kaseta'   : 'hsl(0, 0%, 30%)',
			'tytuł'    : 'Purple Haze',
			'indeks'   : 1
		},
		{
			'struny'   : [3, 1, 2, 2, 0, 2, 0, 2, 3, 1, 2, 2, 0, 2, 0, 2,
						  3, 1, 2, 2, 0, 2, 0, 2, 3, 1, 2, 2, 0, 2, 0, 2,
						  2, 1, 2, 2, 0, 2, 0, 2, 2, 1, 2, 2, 0, 2, 0, 2,
						  0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1],
			'początek' : [76.8, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2, 76.8, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2,
						  80, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2, 80, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2,
						  56, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2, 56, 40, 59.2, 56, 19.2, 59.2, 17.6, 59.2,
						  14.4, 59.2, 40, 59.2, 14.4, 59.2, 17.6, 59.2, 19.2, 59.2, 17.6, 59.2, 14.4, 59.2, 40],
			'progi'    : [9, 12, 11, 9, 12, 11, 11, 11, 9, 12, 11, 9, 12, 11, 11, 11,
						  11, 12, 11, 9, 12, 11, 11, 11, 11, 12, 11, 9, 12, 11, 11, 11,
						  9, 12, 11, 9, 12, 11, 11, 11, 9, 12, 11, 9, 12, 11, 11, 11,
						  9, 11, 12, 11, 9, 11, 11, 11, 12, 11, 11, 11, 9, 11, 12],
			'odstępy'  : [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250,
						  250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250,
						  250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250,
						  250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
			'kolor'    : 'hsl(102, 100%, 43%)',
			'kaseta'   : 'hsl(0, 0%, 50%)',
			'tytuł'    : 'Sweet Child O\' Mine',
			'indeks'   : 2
		}],
		indeksNagrania = 3;
	}

	//Funkcja tworzenia elementu kasety
	var dodajKasete = function(indeks, kaseta, kolor, tytuł) {
		$('#nagrania').append(
			$('<li />', { class : 'nagranie' }).append(
				$('<div />', { class : 'kaseta', style : 'background-color: ' + kaseta }).append(
					$('<div />', { class : 'kolor', style : 'background-color: ' + kolor })
				).append(
					$('<p />', { class : 'tytul', text : tytuł })
				)
			).data('numer', indeks).hide().fadeIn()
		);
	}

	//Dla każdego z elementów bazy utwórz element html
	for (i = 0; i < bazaNagran.length; i++) {
		dodajKasete(bazaNagran[i].indeks, bazaNagran[i].kaseta, bazaNagran[i].kolor, bazaNagran[i].tytuł);
	}

	//Funkcja dostososowująca rozmiar okienka z nagraniami
	var sprawdzNagrania = function() {
		($('.nagranie').size() > 10) ? $('#nagrania').addClass('overflow') : $('#nagrania').removeClass('overflow');
	};
	sprawdzNagrania();

	//Przeciąganie nagrań
	$('.nagranie').draggable({
		distance: 10,
		revert: true
	});

	//Włączenie nagrywania
	$('.nagrywanie').on('click', function() {
		//Przełącz stan nagrywania
		nagrywanie = !nagrywanie;
		//Aktualizuj tekst elementu
		if (nagrywanie) {
			$(this).addClass('active');
			informacja('Trwa nagrywanie');
		} else {
			$(this).removeClass('active');
			informacja('Nagrywanie zatrzymane');
			clearInterval(interwalMierzeniaPrzerw);
			mierzenieCzasu = false;
		}
	});

	//Odegranie nagranej sekwencji
	var odgrywanie = false;
	//Po klinięciu na przycisk odgrywania...
	$('.play').on('click', function() {
		//Jeśli trwa odgrywanie...
		if ($(this).hasClass('stop')) {
			//Przerwij odgrywanie
			for (var i = 0; i < 6; i++) {
				zestawDzwiekow[aktywnaGitara][i].pause();
			}
			gryf.find('td').removeClass('active');
			aktualizujWskazniki();
			odgrywanie = false;
			informacja('Odtwarzanie zatrzymane');
			$('#nagrania li').removeAttr('disabled');
		} else {//Jeśli nie trwa odgrywanie...
			//Sprawdź czy są zapisane jakieś dźwięki
			if (zapisaneStruny.length < 1) {
				informacja('W pamieci nie ma zapisanych zadnych dzwiekow');
			} else {
				//Wyczyść liczniki tak, żeby po kliknięciu Play nagrywanie się zapauzowało
				clearInterval(interwalMierzeniaPrzerw);
				mierzenieCzasu = false;
				czasOdstepow = dlugoscDzwieku;
				$('#nagrania li').attr('disabled', 'disabled');
				odegrajZapisane(zapisaneStruny, poczatki, zapisaneProgi, bazaOdstepow, $(this), true, function() {
					$('#nagrania li').removeAttr('disabled');
				});
			}
		}
	});

	//Cofnięcie ostatniego zapisu
	$('.usunOstatnie').on('click', function() {
		$('#czas').text(czasOdstepow);
		//Jeśli nic jeszcze nie nagrano, wyświetl komunikat
		if (zapisaneStruny.length < 1) {
			clearInterval(interwalMierzeniaPrzerw);
			mierzenieCzasu = false;
			informacja('Nie ma czego usunac');
		} else {
			//W przeciwnym razie usuń ostatnią wartość z tablic
			zapisaneStruny.pop();
			bazaOdstepow.pop();
			poczatki.pop();
			zapisaneProgi.pop();
			informacja('Usunieto ostatni zapis<br>Długosc nagrywania: ' + zapisaneStruny.length);
		}
	});

	//Wyczyszczenie nagrywania
	$('.usunPamiec').on('click', function() {
		//Zeruj licznik
		czasOdstepow = 0;
		$('#czas').text(czasOdstepow);
		//Jeśli nic jeszcze nie nagrano, wyświetl komunikat
		if (zapisaneStruny.length < 1) {
			informacja('Nie ma czego usunac');
		} else {
			//W przeciwnym razie usuń wszystkie wartości z tablic
			clearInterval(interwalMierzeniaPrzerw);
			mierzenieCzasu = false;
			zapisaneStruny.length = 0;
			bazaOdstepow.length = 0;
			poczatki.length = 0;
			zapisaneProgi.length = 0;
			informacja('Wyczyszczono pamiec nagrywania');
		}
	});

	//Zapisywanie nagrania
	$('.zapisz').on('click', function() {
		//Jeśli w pamięci są jakieś dźwięki...
		if (zapisaneStruny.length >= 1) {
			//Wyświetl z prośbą o podanie tytułu
			var tytul = prompt('Podaj tytuł nagrania');
			tytul = tytul || "";
			//Utwórz elementy kasety
			var cssKolor = 'hsl(' + Math.floor(Math.random() * 360) + ', 80%, 50%)',
				cssKaseta = 'hsl(0, 0%, ' + Math.floor(Math.random() * 100) + '%)';
			//Zapisz kolejność progów, odstępy czasowe i indeks
			bazaNagran.push({
				struny   : zapisaneStruny.slice(), //.slice() tworzy kopię
				progi    : zapisaneProgi.slice(),
				początek : poczatki.slice(),
				odstępy  : bazaOdstepow.slice(),
				indeks   : indeksNagrania,
				kolor    : cssKolor,
				tytuł    : tytul,
				kaseta   : cssKaseta
			});
			//Zapisywanie stanu aplikacji dla Opery
			if (opera) { localStorage.setItem('bazaNagran', JSON.stringify(bazaNagran)); }
			//Umieść element w html i nadaj mu wygląd
			dodajKasete(indeksNagrania, cssKaseta, cssKolor, tytul);
			//Dodaj przeciąganie elementów
			$('.nagranie').draggable({
				distance: 10,
				revert: true
			});
			//Sprawdź rozmiar okna
			sprawdzNagrania();
			//Zwiększ indeks nagrania i zapisz go do Local Storage
			indeksNagrania++;
			//Zapisywanie stanu aplikacji dla Opery
			if (opera) { localStorage.setItem('indeksNagrania', indeksNagrania); }
			//Wyświetl informację
			informacja('Nagranie zostalo zapisane');	
		//Jeśli nie ma dźwięków w pamięci, wyświetl informację
		} else {
			informacja('Nie ma czego zapisac');	
		}
	});
	
	//Przyciski z nagraniami
	$('#nagrania').on('click', 'li:not([disabled="disabled"])', function() {
		var $this = $(this)
		//Jeśli nie jest włączone usuwanie nagrań...
		if (!usuwanieElementow) {
			//Utwórz zmienną indeks, która na podstawie wartości data-numer nagrania odnajduje obiekt z takim samym indeksem w tablicy bazaNagran
			var indeks = bazaNagran.map(function(el) { return el.indeks; }).indexOf($this.data('numer'));
			//Przenieś element na pierwszy plan, a pozostałe przyciemnij
			$this.addClass('active').siblings('li').removeClass('active').attr('disabled', 'disabled');
			//Dezaktywuj przycisk play
			$('.play').attr('disabled', 'disabled');
			//Jeśli trwa odgrywanie...
			if ($this.hasClass('stop')) {
				//Przerwij odgrywanie
				for (var i = 0; i < 6; i++) {
					zestawDzwiekow[aktywnaGitara][i].pause();
				}
				gryf.find('td').removeClass('active');
				aktualizujWskazniki();
				odgrywanie = false;
				informacja('Odtwarzanie zatrzymane');
				//Przywróc elementom neutralny wygląd i aktywuj przycisk play
				$this.removeClass('active').siblings().removeAttr('disabled');
				$('.play').removeAttr('disabled');
			} else {//Jeśli nie trwa odgrywanie...
				//Odegraj dźwięki z obiektu odpowiadającemu klikniętemu elementowi
				odegrajZapisane(bazaNagran[indeks].struny, bazaNagran[indeks].początek, bazaNagran[indeks].progi, bazaNagran[indeks].odstępy, $this, false, function() {
					//Przywróc elementom neutralny wygląd i aktywuj przycisk play
					$this.removeClass('active').siblings().removeAttr('disabled');
					$('.play').removeAttr('disabled');
				});
			}
		//Jeśli jest włączone usuwanie...
		} else {
			//Usuń obiekt, którego indeks jest taki sam, jak data-numer klikniętego nagrania
			bazaNagran.splice(bazaNagran.map(function(el) { return el.indeks; }).indexOf($this.data('numer')), 1);
			//Zapisz zmodyfikowaną bazę w Local Storage
			localStorage.setItem('bazaNagran', JSON.stringify(bazaNagran));
			//Usuń element
			$this.fadeOut('normal', function() {
				$(this).remove();
			});
			animacjaKosza();
			sprawdzNagrania();
		}
	});

// ---------- AKORDY ------------------

	//bazaAkordow - nazwa akordu, tablica z numerami progów
	//bazaAkordowObiektowa - nazwa akordu, tablica ze wskazaniami na elementy td gryfu

	//Jeśli w Local Storage zapisano jakieś akordy, wczytaj je
	if (localStorage['zapisaneAkordy'] != null) {
		bazaAkordow = JSON.parse(localStorage['zapisaneAkordy']);
	} else { //Jeśli nie, ustaw je jak poniżej
		var bazaAkordow = {
			'A Dur' : [0, 2, 2, 2, 0, -1],
			'B Dur' : [2, 4, 4, 4, 2, -1],
			'C Dur' : [0, 1, 0, 2, 3, -1],
			'D Dur' : [2, 3, 2, 0, -1, -1],
			'E Dur' : [0, 0, 1, 2, 2, 0],
			'F Dur' : [1, 1, 2, 3, 3, 1],
			'G Dur' : [3, 0, 0, 0, 2, 3] 
		};
	}

	//Jeśli początkowy numer akordu jest zapisany w localStorage...
	if (localStorage['numerAkordu'] != null) {
		//Wczytaj numer
		var numerAkordu = parseInt(localStorage['numerAkordu']);
	} else {
		//Ustal numer
		var numerAkordu = 1;
	}

	var bazaAkordowObiektowa = {};
	//Przerabia bazę tekstową na bazę obiektową
	var aktualizujBazeAkordow = function() {
		var stringPomocniczny = '';
		$.each(bazaAkordow, function(nazwa, wartosc) {
			for (var i = 0; i < 6; i++) {
				if (wartosc[i] > -1) {
					stringPomocniczny += '#struna' + (i + 1) + ' td:eq(' + wartosc[i] + '), ';
				}
			}
			bazaAkordowObiektowa[nazwa] = $(stringPomocniczny.slice(0, -2));
			stringPomocniczny = '';
		});
	};

	aktualizujBazeAkordow();

	//Utworzenie przycisków
	$.each(bazaAkordow, function(i) {
		$('#akordy .wrap').append($('<div />', {
			class: 'akord',
			text: i,
			akord: i
		}));
	});

	function aktualizujAkordy() {
		akordy = $('.akord');
		//Włączenie funkcji przeciągania elementów
		akordy.draggable({
			distance: 10,
			revert: 'invalid',
			appendTo: 'body',
			containment: 'window',
			scroll: false,
			helper: 'clone',
			start: function(e, ui) {
				$(ui.helper).addClass('ui-draggable-helper-akordy');
				$(this).css('opacity', 0);
			},
			stop: function(e, ui) {
				$(this).css('opacity', 1);
			}
		});
	}
	aktualizujAkordy();

	//Dodanie przycisku dodawania akordów
	$('#akordy .wrap').append($('.dodajAkord'));

	//Obsługa akordów
	$('#akordy').on({
		mouseenter: function() {
			if (!usuwanieElementow) {
				//Jeśli wybrany akord nie był aktywny...
				if (!$(this).hasClass('active')) {
					//Przypisz wartości na podstawie id
					aktywnyAkord = bazaAkordowObiektowa[$(this).attr('akord')];
					//Podświetl progi przypisane danemu akordowi
					aktywnyAkord.addClass('hover');
					//Zapisz progi, które były aktywne przed najechaniem kursorem nad przycisk...
					aktywneProgi = gryf.find('td.active');
					//...a następnie je dezaktywuj
					aktywneProgi.removeClass('active');
				}
			}
		},
		mouseleave: function() {
			if (!usuwanieElementow) {
				//Wyłącz podświetlenie progów
				aktywnyAkord.removeClass('hover');
				//Przywróć zapisane cześniej aktywne progi tylko jeśli przycisk akordu nie zostanie wciśnięty
				if (aktywneProgi != null) {
					aktywneProgi.addClass('active');
				}		
			}
		},
		click: function() {
			if (!usuwanieElementow) {
				//Dezaktywuj inne przyciski (tylko jeden może być aktywny)
				akordy.not(this).removeClass('active');
				//Dezaktywuj wszystkie inne progi
				progi.not(aktywnyAkord).removeClass('active');
				//Wyczyść progi zapisane przed kliknięciem
				aktywneProgi = null;
				//Jeśli ten akord jest aktywny..
				if ($(this).hasClass('active')) {
					//Dezaktywuj jego progi
					aktywnyAkord.removeClass('active'); 
				} else {
					//Jeśli nie jest, aktywuj je
					aktywnyAkord.addClass('active');
				}
				//Zmień status aktywności tego przycisku
				$(this).toggleClass('active').siblings().removeClass('active');
				//Aktualizuj wszystkie struny i wskaźniki
				aktualizujWskazniki();
			} else {
				$(this).fadeOut('normal', function() {
					$(this).remove();
				});
				//Animacja
				animacjaKosza();
				delete bazaAkordow[$(this).attr('akord')];
				localStorage.setItem('zapisaneAkordy', JSON.stringify(bazaAkordow));
				sprawdzAkordy();
			}
		}
	}, '.akord');

	//Dodawanie akordów
	$('.dodajAkord').on('click', function() {
		var przejdzDalej = true,
			nazwaAkordu = '';
		//Jeśli jakieś progi są zaznaczone...
		if (progi.hasClass('active')) {
			var bazaPomocnicza = [];
			$('#gryf tr').each(function(i) {
				bazaPomocnicza.push($(this).find('td.active').index());
			});
			//Sprawdzenie, czy jest już taki akord
			$.each(bazaAkordow, function(nazwa, wartosc) {
				//Przerabia obie tablice na tekst i porównuje
				if (bazaPomocnicza.toString() == wartosc.toString()) {
					informacja('Taki akord juz istnieje');
					$('.akord[akord="' + nazwa +'"]').addClass('migotanie').delay(1600).queue(function(next) {
						$(this).removeClass('migotanie');
						next();
					});
					przejdzDalej = false;
				}
			});
			//Jeśli nowy akord nie powtarza się z już istniejącymi...
			if (przejdzDalej) {
				//Dodaj zaznaczone progi do obiektu bazaAkordow
				if ($('.akord-info').text() == "Akord") {
					nazwaAkordu = 'Własny ' + numerAkordu;
					//Zwiększ numer akordu
					numerAkordu++;
				//Jeśli jest znany (jest w bazie), podaj jego nazwę
				} else {
					nazwaAkordu = $('.akord-info').text()
				}
				//Dodaj nowy akord do bazy
				bazaAkordow[nazwaAkordu] = bazaPomocnicza;
				aktualizujBazeAkordow();
				//Dodaj nowy przycisk dla utworzonego akordu
				var nowyAkord = $('<div />', {
						class: 'akord',
						text: nazwaAkordu,
						akord: nazwaAkordu
					});
				if ($('.akord').size() == 0) {
					nowyAkord.appendTo($('#akordy .wrap')).hide().fadeIn();
					$('#akordy .wrap').append($('.dodajAkord'));
				} else {
					nowyAkord.insertAfter($('.akord').last()).hide().fadeIn();
				}
				//Dezaktywuj inne akordy
				akordy.removeClass('active');
				//Aktywuj utworzony akord
				$('.akordy[akord="' + nazwaAkordu +'"]').addClass('active');
				//Aktualizuj zmienną z akordami
				aktualizujAkordy()
				//Zapisywanie stanu aplikacji dla Opery
				if (opera) { localStorage.setItem('zapisaneAkordy', JSON.stringify(bazaAkordow)); localStorage.setItem('numerAkordu', numerAkordu); }
			}
		} else {
			//Jesli nie ma zaznaczonych progów, wyświetl wiadomość
			informacja('Nie zaznaczono zadnych progow');
		}
		sprawdzAkordy();
	});

	var jestScrollbar = false;
	var sprawdzAkordy = function() {
		//Jeśli jest więcej, niż 14 akordów
		if ($('.akord').size() > 14) {
			if (!jestScrollbar) {
				//Dodaj scrollbar
				$('#akordy .wrap').mCustomScrollbar({ advanced: { updateOnContentResize: true } });
				$('#akordy .wrap').addClass('scrollbar');
				jestScrollbar = true;
			}
			$('#akordy .wrap').mCustomScrollbar('update');
		} else {
			//Usuń scrollbar
			$('#akordy .wrap').mCustomScrollbar('destroy');
			$('#akordy .wrap').removeClass('scrollbar');
			jestScrollbar = false;
		}
	};
	sprawdzAkordy();

// ---------- TABULATURA --------------

	//Obsługa przycisków tabulatury
	$('#tabulatura').on('click', 'button', function() {
		switch($(this).attr('class')) {
		case 'dodaj': //Jeśli kliknięto "Zapisz"...
			tabulatura.find('.aktualna-pozycja').each(function(i) {
				//Skopiuj ich wartości, zmień klasy i wstaw do elementu '.znaki'
				$(this).clone().removeClass('aktualna-pozycja').addClass('pozycja').appendTo($('.znaki')[i]);
			});
			//Wyprostuj element, jeśli jego szerokość jest większa, niż 400px
			if (tabulatura.width() > 400) { tabulatura.removeClass('obrot'); }
			break;
		case 'usun': //Jeśli kliknięto "Usuń"...
			//Usuń ostatnią z zapisanych pozycji
			$('.pozycja:last-child').remove();
			//Obróć element, jeśli jego szerokość jest mniejsza, niż 400px
			if (tabulatura.width() < 400) { tabulatura.addClass('obrot'); }
			break;
		case 'drukuj': //Jeśli kliknięto "Otwórz do druku"...
			//Otwórz nowe okno i wyświetl w nim zawartość tabulatury
			$(window.open().document.body).html('<style>body { font-family: monospace; list-style: none; }</style>' + tabulatura.html());
		}
	});

	function aktualizujWskazniki() {
		//Jeśli nie zaznaczono żadnych progów...
		if ($('#gryf td.active').length == 0) {
			//Wyczyść wskaźniki tabulatury
			$('.aktualna-pozycja').each(function() {
				$(this).text('');
			});
		//Jeśli jakieś progi są zaznaczone...
		} else {
			//Każdemu ze wskaźników przypisz zawartość odpowiadającej mu struny
			wskaznikiTabulatury.each(function(n) {
				var prog = $('#struna' + (n + 1) + ' td.active'),
					pozycjaProgu = prog.index();
				$(this).find('.aktualna-pozycja')
					.addClass('znak')
					.text(function() {
						//Jeśli jest zaznaczony jakiś próg i jego pozycja jest mniejsza niż 10...
						if (pozycjaProgu != -1 && pozycjaProgu < 10) {
							//Wyświetl jego pozycję
							return '-' + pozycjaProgu + '-';
						//Jeśli pozycja progu jest większa bądź równa 10...
						} else if (pozycjaProgu >= 10) {
							//Wyświetl jego pozycję
							return pozycjaProgu + '-';
						//Jeśli nie jest zaznaczony żaden próg...
						} else {
							$(this).removeClass('znak');
							//Wyświetl puste miejsce
							return '---';
					}
				});
			});
		}

		var tablicaUkladu = [];
		//Zapisz pozycje progów do tablicy
		$('tr').each(function(n) {
			tablicaUkladu[n] = $(this).find('td.active').index();
		});
		//Przerób tablicę na string
		var aktualnyUklad = tablicaUkladu.join();
		//Porównaj go z danymi z obiektu
		$.each(spisAkordow, function(nazwa, uklad) {
			if (aktualnyUklad == uklad.join()) {
				//Wyświetl nazwę znalezionego akordu
				$('.akord-info').text(nazwa);
				return false;
			} else {
				$('.akord-info').text('Akord');
			}
		});
	}

	//Odczytywanie tabulatury z nagrania
	$('#tabulatura').droppable({
		accept: '.nagranie',
		//Po przeciągnięciu nagrania nad tabulaturę...
		drop: function(event, ui) {
			//Wyczyść tabulaturę
			$('.pozycja').remove();
			//Pobierz wartości
			var indeks = $(ui.draggable).data('numer'), //Numer nagrania
				dlugosc = bazaNagran[indeks].progi.length, //Długość nagrania
				struny = bazaNagran[indeks].struny, //Numery strun
				progi = bazaNagran[indeks].progi.slice(); //Numery progów
			//Dla każdego zapisanego dźwięku...
			for (var x = 0; x < dlugosc; x++) {
				//Dla każdej struny...
				for (var i = 0; i < 6; i++) {
					//Utwórz puste elementy
					$('<span class="pozycja" />').text('---').appendTo($('.znaki')[i]);
				}
				//Dodaj odpowiednią ilość myślników w zależności od cyfry progu
				progi[x] = (progi[x] > 9) ? progi[x] + '-' : '-' + progi[x] + '-';
				//Zapisz pozycję progów na odpowiedniej strunie
				tabulatura.find('li:eq(' + struny[x] + ') .pozycja:last').text(progi[x]);
			}
			//Dostosuj wygląd tabulatury w zależności od jej rozmiaru
			tabulatura.width() > 400 ? tabulatura.removeClass('obrot') : tabulatura.addClass('obrot');
			//Ukryj nowe elementy
			$('.pozycja').hide();
			//Tablica pomocnicza
			var tablica = [];
			//Zbierz elementy w kolumny i zapisz je do tablicy
			for (var i = 1; i < dlugosc + 1; i++) {
				tablica.push($('.pozycja:nth-child(' + i + ')'));
			}
			//Kolejno odkrywaj elementy tabulatury
			$(tablica).each(function(i) {
				$(this).delay(50 * i).fadeIn(200);
			});
		}
	});

// ---------- KOSZ I INNE -------------
	
	//Przeciąganie elementow do kosza
	kosz.droppable({
		//Akceptuj akordy i nagrania
		accept: '.akord, .nagranie',
		//Dodaj klasę .dragged koszowi na czas przeciągania elementów
		activeClass: 'dragged',
		drop: function(event, ui) {
			//Jeśli akord...
			if ($(ui.draggable).hasClass('akord')) {
				//Usuń podświetlenie
				aktywnyAkord.removeClass('hover');
				//Usuń akord z bazy
				delete bazaAkordow[$(ui.draggable).attr('akord')];
				//Usuń go z dokumentu
				$(ui.draggable).remove();
				//Uruchom animację bujania kosza
				animacjaKosza();
				//Zapisz zmodyfikowaną bazę do localStorage
				localStorage.setItem('zapisaneAkordy', JSON.stringify(bazaAkordow));
			//Jeśli nagranie...
			} else {
				//Ukryj upuszczony element
				$(ui.draggable).fadeOut('normal', function() {
					//Usuń element z bazy nagrań
					bazaNagran.splice(bazaNagran.map(function(el) { return el.indeks; }).indexOf($(this).data('numer')), 1);
					//Usuń go z dokumentu
					$(this).remove();
					//Uruchom animację bujania kosza
					animacjaKosza();
					//Zapisz zmodyfikowaną bazę do localStorage
					localStorage.setItem('bazaNagran', JSON.stringify(bazaNagran));
				});
			}
			setTimeout(function() {
				sprawdzAkordy();
				sprawdzNagrania();
			}, 100);
		}
	});

	//Usuwanie akordow i nagrań
	var usuwanieElementow = false;
	//Po kliknięciu na kosz...
	kosz.on('click', function() {
		//Aktywuj go
		$(this).toggleClass('active');
		usuwanieElementow = !usuwanieElementow;
		//Nadaj klasy elementom do usunięcia, dzięki którym zmieni się kursor
		$('#akordy').toggleClass('bin');
		$('#nagrania').toggleClass('bin');
		//Wyświetl informację
		if (usuwanieElementow) {
			informacja('Kliknij na akord lub nagranie aby je usunac');
		} else {
			informacja('');
		}
	});

	var animacjaKosza = function() {
		kosz.addClass('usuwanie').delay(700).queue(function(next) {
			$(this).removeClass('usuwanie');
			next();
		});
	}

	$('#akordy, #nagrania, #tabulatura').prepend($('<button class="minimalizuj"><span class="znak">-</span><span class="tekst">Minimalizuj</span></button>'));

	//Przyciski minimalizowania okien panelu głównego
	$('.minimalizuj').on('click', function(){
		var $this = $(this);
		//Ukryj okno z klikniętym przyciskiem
		$this.parent().fadeOut('normal', function() {
			//Zapisywanie stanu aplikacji dla Opery
			if (opera) {
				if ($('#akordy').is(':hidden')) { localStorage.setItem('akordy', 'hidden'); }
				else { localStorage.setItem('akordy', 'visible'); }
				if ($('#nagrania').is(':hidden')) { localStorage.setItem('nagrania', 'hidden'); }
				else { localStorage.setItem('nagrania', 'visible'); }
				if ($('#tabulatura').is(':hidden')) { localStorage.setItem('tabulatura', 'hidden'); }
				else { localStorage.setItem('tabulatura', 'visible'); }
			}
		});
		//Umieść w panelu dolnym odpowiednią ikonkę zminimalizowanego okna
		$('#panel-dolny').find('.' + $this.parent().attr('id')).fadeIn();
	});

// ---------- PANEL DOLNY -------------
	
	//Po klinięciu w przycisk powrotu...
	$('.powrot').on('click', function() {
		//Ukryj gryf
		$('#gryf-wrap').fadeOut(300);
		//Pokaż gitary
		$('#gitary').add($('#gitary + .info')).delay(400).fadeIn(300);
	});

	//Usuwanie oznaczeń nut z gryfu
	$('.oznaczenia').on('click', function() {
		$('#gryf').toggleClass('ukryte');
		$(this).toggleClass('active');
		//Zapisywanie stanu aplikacji dla Opery
		if (opera) {
			if ($('.oznaczenia').hasClass('active')) { localStorage.setItem('ukryte', 'tak');
			} else { localStorage.setItem('ukryte', 'nie'); }
		}
	});

	//Czyszczenie gryfu z zaznaczonych progów
	$('.wyczysc').on('click', function() {
		progi.add(akordy).removeClass('active');
		tabulatura.find('.aktualna-pozycja').html('');
	});

	//Wyciszenie gryfu
	$('.wyciszGryf').on('click', function() {
		wyciszenie = !wyciszenie;
		$(this).toggleClass('active');
		//Zapisywanie stanu aplikacji dla Opery
		if (opera) {
			if ($('.wyciszGryf').hasClass('active')) { localStorage.setItem('wyciszenie', 'tak');
			} else { localStorage.setItem('wyciszenie', 'nie'); }
		}
	});

	//Przycisk pomocy
	$('#panel-dolny .pomoc').on('click', function() {
		ciemneTlo.fadeIn().addClass('pomoc');
		//Jeśli podświetlenie nie ma jeszcze nadanych rozmiarów (czyli uruchom to tylko raz na początku)...
		if ($('.podswietlenie').height() == 0) {
			//Nadaj podświetleniu wysokość taką samą, jak wysokość przycisków
			$('.podswietlenie').height($('.pomoc nav ul li').outerHeight())
			//Ustaw podświetlenie na pierwszą pozycję
							   .width($('.pomoc nav li').eq(0).outerWidth())
							   .css('left', $('.pomoc nav li').eq(0).position().left);
			//Zsumuj szerokość wszystkich przycisków i następnie użyj jej jako szerokości footera
			var footerSzerokosc = 1;
			$('#ciemne-tlo .pomoc footer ul li').each(function() {
				footerSzerokosc += $(this).outerWidth(true);
			});

			$('#ciemne-tlo .pomoc footer').width(footerSzerokosc);
		}
	});

	//Ustaw migotanie zgodnie z informacją z Local Storage
	var miganie, czyMigac = true;
	if (localStorage['czyMigac'] == 'false') {
		czyMigac = false;
	}

	//Miganie przycisku pomocy po wybraniu gitary
	$('.gitara').on('click', function() {
		if (czyMigac) {
			//Dodaj klasę z animacją - po 3 sekundach zacznij migać po pół sekundy przez 5 sekund
			$('#panel-dolny').find('.pomoc').addClass('migotanie');
		}
	});

	//Po najechaniu kursorem na przycisk pomocy
	$('#panel-dolny .pomoc').on('mouseenter', function() {
		//Wyłącz migotanie i zapisz informację o tym w Local Storage
		localStorage.setItem('czyMigac', 'false');
		czyMigac = false;
		$(this).removeClass('active migotanie');
	});

	//Usuwanie danych z Local Storage
	var czyZachowacDane = true;
	$('.usunLocal').on('click', function() {
		localStorage.clear();
		czyZachowacDane = false;
		location.reload();
	});

	//Po kliknięciu na przycisk zminimalizowanego okna...
	$('#panel-dolny').on('click', '.min', function() {
		//Przywróć okno o id takim samym, jak klasa klikniętej miniaturki
		$('#' + $(this).attr('class').split(' ')[1]).fadeIn(); //Pobiera tylko drugą klasę elementu
		//Schowaj miniaturkę
		$(this).fadeOut('normal', function() {
			//Zapisywanie stanu aplikacji dla Opery
			if (opera) {
				if ($('#akordy').is(':hidden')) { localStorage.setItem('akordy', 'hidden'); }
				else { localStorage.setItem('akordy', 'visible'); }
				if ($('#nagrania').is(':hidden')) { localStorage.setItem('nagrania', 'hidden'); }
				else { localStorage.setItem('nagrania', 'visible'); }
				if ($('#tabulatura').is(':hidden')) { localStorage.setItem('tabulatura', 'hidden'); }
				else { localStorage.setItem('tabulatura', 'visible'); }
			}
		});
	});

	//Funkcje sterujące podświetleniem pod przyciskami panelu dolnego
	$('#panel-dolny')
		.append($('<div class="swiatelko" />'))
		.on({
		//Po najechaniu kursorem...
		mouseenter: function() {
			//Parametrowi 'left' przypisz wartość parametru wskazanego kursorem
			var pozLewa = $(this).parent('.wrapper').position().left,
				szerWr = $(this).parent('.wrapper').width(),
				szerSw = $('.swiatelko').width(),
				obliczone = pozLewa + (szerWr - szerSw) / 2;
			$('.swiatelko').css('left', obliczone).addClass('active');
		},
		mouseleave: function() {
			$('.swiatelko').removeClass('active');
		},
	}, 'button');

// ---------- LOCAL STORAGE -----------

	// Zapisywanie przy zamykaniu okna przeglądarki
	$(window).unload(function() {
		if (czyZachowacDane) {
			//Zachowanie bazy akordów i numeru ostatniego akordu
			localStorage.setItem('zapisaneAkordy', JSON.stringify(bazaAkordow));
			localStorage.setItem('numerAkordu', numerAkordu);
			localStorage.setItem('glosnosc', suwak.slider('value'));
			localStorage.setItem('bazaNagran', JSON.stringify(bazaNagran));
			localStorage.setItem('indeksNagrania', indeksNagrania);
			//Zachowanie aktywnej gitary
			if (aktywnaGitara != '') { localStorage.setItem('gitara', aktywnaGitara); }
			//Zminimalizowane okna
			if ($('#panel-glowny').is(':visible')) {
				if ($('#akordy').is(':hidden')) { localStorage.setItem('akordy', 'hidden'); }
				else { localStorage.setItem('akordy', 'visible'); }
				if ($('#nagrania').is(':hidden')) { localStorage.setItem('nagrania', 'hidden'); }
				else { localStorage.setItem('nagrania', 'visible'); }
				if ($('#tabulatura').is(':hidden')) { localStorage.setItem('tabulatura', 'hidden'); }
				else { localStorage.setItem('tabulatura', 'visible'); }
			}
			//Onzaczenia progów gryfu
			if ($('.oznaczenia').hasClass('active')) { localStorage.setItem('ukryte', 'tak');
			} else { localStorage.setItem('ukryte', 'nie'); }
			//Wyciszenie gryfu
			if ($('.wyciszGryf').hasClass('active')) { localStorage.setItem('wyciszenie', 'tak');
			} else { localStorage.setItem('wyciszenie', 'nie'); }
		}
	});

	//Wczytywanie ustawien z Local Storage
	if (localStorage['akordy'] == 'hidden') {
		$('#akordy').hide();
		$('.akordy').show();
	}

	if (localStorage['nagrania'] == 'hidden') {
		$('#nagrania').hide();
		$('.nagrania').show();
	}

	if (localStorage['tabulatura'] == 'hidden') {
		$('#tabulatura').hide();
		$('.tabulatura').show();
	}

	if (localStorage['wyciszenie'] == 'tak') {
		wyciszenie = true;
		$('.wyciszGryf').addClass('active');
	}

	if (localStorage['ukryte'] == 'tak') {
		gryf.addClass('ukryte');
		$('.oznaczenia').addClass('active');
	}

});