//Dodać zabezpiecznia
//Usunąłem required z textarea - zobaczyć czy da sie to jakoś zastapić w WYSIWYG
//Dodać sprawdzanie przed edycją wpisu czy zaszły jakieś zmiane w treści
//Deaktywować przyciski na czas animacji, żeby nie można było klikać na inne strony czy wpisy
$(function() {

	function aktywnyLink() {
		$('main > header nav a').removeClass('active');
		var adres = document.URL.split('=');
		if (adres[0].slice(-1) != 'p') {
			if (adres[1] !== undefined) {
				$('main > header nav [data=' + adres[1] + ']').addClass('active');
			} else {
				$('main > header nav a').eq(0).addClass('active');
			}
		}
	}
	aktywnyLink();

	function bodyId() {
		if ($('body').attr('id') != 'panel_administracyjny') {
			var adres = document.URL.split('?')[1];
			if (adres !== undefined) {
				switch (adres[0]) {
					case 's':
						id = 'strona';
						break;
					case 'p':
						id = 'wpis';
						break;
				}
				$('body').attr('id', id);
			} else {
				$('body').attr('id', 'strona_glowna');
			}
		}
	}
	bodyId();

	$(document).on('click', 'a.przejdz', function(e) {
		e.preventDefault();
		var $this = $(this),
			adres = $this.attr('href');
		loading($this, $this, 'on');
		$.ajax({
			type: 'GET',
			url:  'skrypty/pobierz_wpisy.php' + adres,
			success: function(daneZwrotne) {
				loading($this, $this, 'off');
				window.history.pushState(null, null, adres);
				$('main > header nav a').removeClass('active');
				zmienZawartosc($('.wpisy'), daneZwrotne, 'wpis');
			}
		});
	});

	$(document).on('click', 'main > header nav a:not(.active), aside .btn', function(e) {
		e.preventDefault();
		var $this = $(this),
			adres = $this.attr('href');
		$('main > header nav a').removeClass('active');
		$this.addClass('active');
		loading($this, $this, 'on');
		$.ajax({
			type: 'GET',
			url:  'skrypty/pobierz_wpisy.php' + adres,
			success: function(daneZwrotne) {
				loading($this, $this, 'off');
				window.history.pushState(null, null, adres);
				zmienZawartosc($('.wpisy'), daneZwrotne, 'strona');
			}
		});
	});
	
	$(document).on('click', 'a.strona_glowna', function(e) {
		e.preventDefault();
		var $this = $(this),
			adres = $(this).attr('href');
		loading($this, $this, 'on');
		$.ajax({
			type: 'GET',
			url:  'skrypty/pobierz_wpisy.php',
			success: function(daneZwrotne) {
				loading($this, $this, 'off');
				window.history.pushState(null, null, adres);				
				$('main > header nav a').eq(0).addClass('active');
				zmienZawartosc($('.wpisy'), daneZwrotne, 'strona_glowna');
			}
		});
	});

	$(window).on('popstate', function() {
		var link = document.URL.replace(/^.*[\\/]/, ''),
			id = '';
		$.ajax({
			type: 'GET',
			url:  'skrypty/pobierz_wpisy.php/' + link,
			success: function(daneZwrotne) {
				aktywnyLink();
				zmienZawartosc($('.wpisy'), daneZwrotne);
			}
		});
	});

	function zmienZawartosc(elementAnimowany, tresc) {
		elementAnimowany
			//Wykonaj animację ukrycia elementu
			.addClass('animated bounceOutRight')
			//Po zakończeniu animacji...
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				elementAnimowany
					//Zmień zawartość elementu
					.html(tresc)
					//Usuń klasę animacji
					.removeClass('animated bounceOutRight')
					//Wykonaj animację pojawienia się nowego elementu
					.addClass('animated bounceInRight')
					//Po zakończeniu animacji...
					.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
						//Usuń klasę animacji
						elementAnimowany.removeClass('animated bounceInRight');
					});
			});
		//Zmień id elementu body
		bodyId();
	}

	$('.lista_plikow').on('click', '.usun', function(e) {
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url:  '../skrypty/usuwanie.php',
			data: 'sciezka=' + $(this).next('img').attr('src'),
			success: function(daneZwrotne) {
				$('.lista_plikow ul').html(daneZwrotne);
			}
		});
	});

	//http://www.matlus.com/html5-file-upload-with-progress/
	//http://www.html5rocks.com/en/tutorials/file/dndfiles/
	//http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
	$('#dodawanie_pliku').on('change', 'input[type=file]', function(e) {
		var files = this.files;
		if (files) {
			$('.pliki_info').val(files[0].name);
		}
	});

	$('#dodawanie_pliku').on('submit', function(e) {
		e.preventDefault();
		//Formularz zawiera pliki, więc musi zostać zebrany do objektu FormData
		var formData = new FormData($(this)[0]);
		$.ajax({
			type: 'POST',
			url:  '../skrypty/dodaj_zdjecie.php',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(daneZwrotne) {
				$(daneZwrotne).prependTo($('.lista_plikow')).hide().fadeIn();
			}
		});
	});

	$('.lista_plikow').on('click', '.usun_zdjecie', function(e) {
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url:  '../skrypty/usun_zdjecie.php',
			data: sdfsd,
			success: function(daneZwrotne) {}
		});
	});

	function loading(element, przycisk, stan) {
		stan = stan || 'on';
		if (stan == 'on') {
		timeout = setTimeout(function() {
			element.css('opacity', 0.3).wrap('<div class="loading cf" />');
			element.parent('.loading').css('float', element.css('float'));
			przycisk.attr('disabled', 'disabled');
		}, 500);
		} else if (stan == 'off') {
			clearTimeout(timeout);
			if (element.parent().hasClass('loading')) {
				element.css('opacity', 1).unwrap();
			}
			przycisk.removeAttr('disabled');
		}
	}

	var logowanie = {
		panel      : $('.panel_logowania'),
		logo       : $('.panel_logowania img'),
		formularz  : $('.panel_logowania form'),
		login      : $('.panel_logowania :text'),
		przycisk   : $('.panel_logowania :submit'),
		informacja : $('.panel_logowania .informacja'),
		init : function() {
			//Pokaż przycisk powrotu i panel logowania
			logowanie.panel.fadeIn(800);
			logowanie.panel.next().fadeIn(800);
			//Po kliknięciu na przycisk "Zaloguj"...
			logowanie.formularz.on('submit', function(e) {
				//Anuluj domyślne działanie przycisku
				e.preventDefault();
				//Włącz efekt loading
				loading(logowanie.logo, logowanie.przycisk, 'on');
				//Wyślij ajax
				$.ajax({
					type: 'GET', //Metoda
					url:  '../skrypty/logowanie.php', //Lokalizacja skryptu PHP
					data: logowanie.formularz.serialize(), //Zbierz dane formularza
					success: function(daneZwrotne) {
						//Zbierz do obiektu dane JSON zwrócone przez skrypt PHP
						var json = $.parseJSON(daneZwrotne); 
						//Jeśli dane logowania są błędne...
						if (json.stan == false) {
							//Wyłącz efekt loading
							loading(logowanie.logo, logowanie.przycisk, 'off');
							//Ustaw kursor na polu logowania
							logowanie.login.select();
							//Animuj panel
							logowanie.panel
								.addClass('animated rubberBand')
								.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
									$(this).removeClass('animated rubberBand');
								});
						//Jeśli logowanie się powiodło...
						} else if (json.stan == true) {
							//Wyłącz efekt loading
							loading(logowanie.logo, logowanie.przycisk, 'off');
							//Ukryj przycisk powrotu i formularz logowania
							logowanie.panel.next().fadeOut(500);
							logowanie.panel.fadeOut(500, function() {
								//Odśwież stronę
								window.location.reload();
							});
						}
					},
					error: function() { alert('Błąd AJAX przy logowaniu'); },
				});
			});
		}
	};

	logowanie.init();

	function ustalTytulProsty(pelny, prosty) {
		pelny.on('keyup', function() {
			var tytul_pelny = $(this).val(),
				tytul_prosty = tytul_pelny.replace(/\s+/g, '_').toLowerCase();
			tytul_prosty = tytul_prosty.replace('ą', 'a');
			tytul_prosty = tytul_prosty.replace('ę', 'e');
			tytul_prosty = tytul_prosty.replace('ć', 'c');
			tytul_prosty = tytul_prosty.replace('ł', 'l');
			tytul_prosty = tytul_prosty.replace('ń', 'n');
			tytul_prosty = tytul_prosty.replace('ó', 'o');
			tytul_prosty = tytul_prosty.replace('ś', 's');
			tytul_prosty = tytul_prosty.replace('ź', 'z');
			tytul_prosty = tytul_prosty.replace('ż', 'z');
			prosty.val(tytul_prosty);
		});
	}

	ustalTytulProsty($('#dodawanie_strony_tytul_pelny'), $('#dodawanie_strony_tytul_prosty'));
	ustalTytulProsty($('#edycja_strony_tytul_pelny'), $('#edycja_strony_tytul_prosty'));

	function animujTloTabeli(id, kolor, tabela) {
		var komorkiWiersza = tabela.find('[data-id=' + id + ']').find('td'),
			pierwotnyKolor = komorkiWiersza.css('background-color');
		komorkiWiersza.css('background-color', kolor).hide().fadeIn().animate({ 'background-color': pierwotnyKolor, }, 1000);
	}

	function wyswietlError(error) {
		//{ rodzaj: 'modal/popover', tresc: 'Tresc wiadomosci', element: $('element tylko dla popover') }
		if (error.rodzaj == 'modal') {
			$('#errorModal').find('.modal-body').html(error.tresc).end().modal('show');
		} else if (error.rodzaj == 'popover') {
			error.element.popover({
				content: error.tresc,
				container: error.element.parent().parent().parent(),
				placement: 'bottom'
			})
			.popover('show')
			.on('focus', function () {
				error.element.popover('destroy');
			});
		}
	}

	function wyswietlStatus(element, klasa, ikona) {
		element.parent().parent().removeClass('has-success has-error').addClass(klasa + ' has-feedback');
		element.next('.glyphicon').remove().end().after('<span class="glyphicon ' + ikona + ' form-control-feedback"></span>');
	}

	var wpisy = {
		tytuly: [],
		lista: $('.lista_wpisow'),
		dodawanie: {
			panel: $('.panel_dodawanie_wpisu'),
			formularz: $('#dodawanie_wpisu'),
			tytul_pelny: $('#dodawanie_wpisu_tytul_pelny'),
			tytul_prosty: $('#dodawanie_wpisu_tytul_prosty'),
			data: $('#dodawanie_wpisu_data'),
			tresc: $('#dodawanie_wpisu_tresc')
		},
		edycja: {
			panel: $('.panel_edycja_wpisu'),
			formularz: $('#edycja_wpisu'),
			tytul_pelny: $('#edycja_wpisu_tytul_pelny'),
			tytul_prosty: $('#edycja_wpisu_tytul_prosty'),
			data: $('#edycja_wpisu_data'),
			tresc: $('#edycja_wpisu_tresc')
		},
		pobierzTytuly: function() {
			$.ajax({
				type: 'GET',
				url:  '../skrypty/ajax_wpisy.php',
				data: '&element=wpis&dzialanie=sprawdz',
				success: function(daneZwrotne) {
					var json = $.parseJSON(daneZwrotne);
					//Zapisz listę tytułów
					wpisy.tytuly = json.tytuly;
				}
			});
		},
		ustalTytulProsty: function(pelny, prosty) {
			pelny.on('keyup', function() {
				var tytul_pelny = $(this).val(),
					tytul_prosty = tytul_pelny.replace(/\s+/g, '_').toLowerCase();
				tytul_prosty = tytul_prosty.replace('ą', 'a');
				tytul_prosty = tytul_prosty.replace('ę', 'e');
				tytul_prosty = tytul_prosty.replace('ć', 'c');
				tytul_prosty = tytul_prosty.replace('ł', 'l');
				tytul_prosty = tytul_prosty.replace('ń', 'n');
				tytul_prosty = tytul_prosty.replace('ó', 'o');
				tytul_prosty = tytul_prosty.replace('ś', 's');
				tytul_prosty = tytul_prosty.replace('ź', 'z');
				tytul_prosty = tytul_prosty.replace('ż', 'z');
				prosty.val(tytul_prosty);

				wpisy.dodawanie.formularz.bootstrapValidator('revalidateField', 'tytul_prosty');
			});
		},
		//Funkcja przełączania widoczności paneli dodawania i edycji
		ukryjPokaz: function(ukrywany, pokazywany) {
			ukrywany.fadeOut('normal', function() {
				pokazywany.fadeIn();
			});
		},
		start: function() {
			//Pobierz listę tytułów prostych do sprawdzania ich dostępności w czasie wypełniania formularza
			wpisy.pobierzTytuly();
			//Automatycznie przerabiaj tytuł długi na tytuł prosty
			wpisy.ustalTytulProsty(wpisy.dodawanie.tytul_pelny, wpisy.dodawanie.tytul_prosty);
			wpisy.ustalTytulProsty(wpisy.edycja.tytul_pelny, wpisy.edycja.tytul_prosty);

			//Rozpoczecie edycji wpisu
			wpisy.lista.on('click', '.edycja_wpisu', function(e) {
				e.preventDefault();
				wpisy.edycja.formularz.bootstrapValidator('resetForm');

				//Pokaż panel edycji jeśli nie jest w tej chwili widoczny
				if (!wpisy.edycja.panel.is(':visible')) {
					wpisy.ukryjPokaz(wpisy.dodawanie.panel, wpisy.edycja.panel);
				}
				//Pobierz numer ID edytowanego wpisu
				var id = $(this).parent().parent().parent('.wpis').attr('data-id');
				$.ajax({
					type: 'GET',
					url: '../skrypty/ajax_wpisy.php',
					data: { element: 'wpis', dzialanie: 'pobierz', id: id },
					success: function(daneZwrotne) {
						var json = $.parseJSON(daneZwrotne);
						//Wypełnij formularz zwróconymi danymi
						wpisy.edycja.tytul_pelny.val(json.tytul_pelny);
						wpisy.edycja.tytul_prosty.val(json.tytul_prosty);
						wpisy.edycja.data.val(json.data);
						wpisy.edycja.tresc.val(json.tresc);
						wpisy.edycja.formularz.find('input[name="id"]').val(json.id);
					},
					error: function() { alert('Błąd AJAX przy pobieraniu danych wpisu'); }
				});
			});

			//Anulowanie edycji wpisu
			wpisy.edycja.formularz.on('click', '.anuluj', function(e) {
				e.preventDefault();
				wpisy.ukryjPokaz(wpisy.edycja.panel, wpisy.dodawanie.panel);
			});

			//Usunięcie wpisu AJAX
			wpisy.lista.on('click', '.usuniecie_wpisu', function(e) {
				e.preventDefault();
				//if (confirm('Czy na pewno usunąć wpis?')) {
					var $this = $(this),
					id = $this.parent().parent().parent('.wpis').attr('data-id');
					$.ajax({
						type: 'POST',
						url:  '../skrypty/ajax_wpisy.php',
						data: { element: 'wpis', dzialanie: 'usun', id: id },
						success: function() {
							//Pobierz aktualną listę wpisów do sprawdzania dostępności ich tytułów
							wpisy.pobierzTytuly();
							//Podświetl u usuń wybrany wpis z listy
							$this.parent().parent().siblings().addBack().css('background-color', '#c9302c').parent('.wpis').fadeOut('normal', function() {
								$(this).remove();
							});
						},
						error: function() { alert('Błąd przy usuwaniu wpisu'); }
					});
				//}
			});

			//Dodawanie wpisu
			wpisy.dodawanie.formularz.bootstrapValidator({
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					tytul_prosty: {
						validators: {
							callback: {
								message: 'Wartość niepoprawna',
								callback: function(value, validator, $field) {
									if (value === '') {
										return true;
									}
									for (var i = 0; i < wpisy.tytuly.length; i++) {
										if (value == wpisy.tytuly[i]) {
											return {
												valid: false,
												message: 'Ten tytuł jest już zajęty'
											}
										}
									}
									return true;
								}
							}
						}
					},
					data: {
						trigger: 'focus blur',
						validators: {
							date: {
								format: 'DD.MM.YYYY',
								separator: '.',
								message: 'Wymagana data w formacie dd.mm.rrrr'
							}
						}
					}
				}
			})
			.on('success.form.bv', function(e) {
            	// Prevent form submission
	            e.preventDefault();
	            // Get the form instance
	            var $form = $(e.target);
	            // Get the BootstrapValidator instance
	            var bv = $form.data('bootstrapValidator');
	            // Use Ajax to submit form data
	            $.post($form.attr('action'), $form.serialize() + '&element=wpis&dzialanie=dodaj', function(result) {
	                // ... Process the result ...
					//Wyświetl ewentualną informację o błędzie
					if (result.error) {
						wyswietlError({ rodzaj: 'popover', tresc: result.wiadomosc, element: wpisy.dodawanie.tytul_prosty });
					} else {
						//Aktualizuj listę wpisów
						wpisy.lista.find('tbody').html(result.zawartosc);
						//Podświetl dodany wpis na liscie
						animujTloTabeli(result.id, '#5cb85c', wpisy.lista);
						//Wymuś pobranie listy wpisów przy następnym sprawdzaniu dostępności tytułu
						wpisy.pobierzTytuly();
						//Wyczyść formularz
						wpisy.dodawanie.tytul_pelny.val('');
						wpisy.dodawanie.tytul_prosty.val('');
						wpisy.dodawanie.tresc.val('');
						wpisy.dodawanie.formularz.bootstrapValidator('resetForm');
					}
	            }, 'json');
        	});

			//Edycja wpisu AJAX
			wpisy.edycja.formularz.bootstrapValidator({
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					data: {
						trigger: 'focus blur',
						validators: {
							date: {
								format: 'DD.MM.YYYY',
								separator: '.',
								message: 'Wymagana data w formacie dd.mm.rrrr'
							}
						}
					}
				}
			})
			.on('success.form.bv', function(e) {
				// Prevent form submission
	            e.preventDefault();
	            // Get the form instance
	            var $form = $(e.target);
	            // Get the BootstrapValidator instance
	            var bv = $form.data('bootstrapValidator');
	            // Use Ajax to submit form data
				//Pobierz ID edytowane wpisu
				var id = wpisy.edycja.formularz.find('[name=id]').val();
				//loading(wpisy.lista, wpisy.edycja.formularz.find('input:submit'), 'on');
	            $.post($form.attr('action'), $form.serialize() + '&element=wpis&dzialanie=zapisz', function(result) {
					if (result.error) {
						wyswietlError({ rodzaj: 'popover', tresc: result.wiadomosc, element: wpisy.edycja.tytul_prosty });
					} else {
						//Pobierz aktualną listę wpisów do sprawdzania dostępności ich tytułów
						wpisy.pobierzTytuly();
						//Aktualizuj listę wpisów i podświetln edytowany wpis
						wpisy.lista.find('tbody').html(result.tresc);
						animujTloTabeli(id, '#5cb85c', wpisy.lista);
						//Ukryj panel edycji wpisów i pokaż panel dodawania nowego wpisu
						wpisy.edycja.tytul_pelny.val('');
						wpisy.edycja.tytul_prosty.val('');
						wpisy.edycja.tresc.val('');
						wpisy.ukryjPokaz(wpisy.edycja.panel, wpisy.dodawanie.panel);
						wpisy.edycja.formularz.bootstrapValidator('resetForm');
					}
					//loading(wpisy.lista, wpisy.edycja.formularz.find('input:submit'), 'off');
				}, 'json');
			});
		}
	};

	var strony = {
		tytuly: [],
		lista: $('.lista_stron'),
		dodawanie: {
			panel: $('.panel_dodawanie_strony'),
			formularz: $('#dodawanie_strony'),
			tytul_pelny: $('#dodawanie_strony_tytul_pelny'),
			tytul_prosty: $('#dodawanie_strony_tytul_prosty'),
			tresc: $('#dodawanie_strony_tresc')
		},
		edycja: {
			panel: $('.panel_edycja_strony'),
			formularz: $('#edycja_strony'),
			tytul_pelny: $('#edycja_strony_tytul_pelny'),
			tytul_prosty: $('#edycja_strony_tytul_prosty'),
			tresc: $('#edycja_strony_tresc')
		},
		start: function() {
			//Dodanie strony
			strony.dodawanie.formularz.on('submit', function(e) {
				e.preventDefault();
				//loading($('.lista_stron'), $('#dodawanie_strony input:submit'), 'on');
				$.ajax({
					type: 'POST',
					url:  '../skrypty/ajax_wpisy.php',
					data: strony.dodawanie.formularz.serialize() + '&element=strona&dzialanie=dodaj',
					success: function(daneZwrotne) {
						//loading($('.lista_stron'), $('#dodawanie_strony input:submit'), 'off');
						var json = $.parseJSON(daneZwrotne);
						if (json.error) {
							wyswietlError({rodzaj: 'popover', tresc: json.wiadomosc, element: strony.dodawanie.tytul_prosty});
						} else {
							strony.lista.find('tbody').html(json.zawartosc);
							strony.lista.find('[data-id=' + json.id + ']').hide().fadeIn();
							animujTloTabeli(json.id, '#5cb85c', $('.lista_stron'));
							strony.dodawanie.tytul_pelny.val('');
							strony.dodawanie.tytul_prosty.val('');
						}
					},
					error: function() { alert('Błąd AJAX przy dodawaniu strony'); }
				});
			});
			//Rozpoczęcie edycji strony
			strony.lista.on('click', '.edycja_strony', function(e) {
				e.preventDefault();
				if (!strony.edycja.panel.is(':visible')) {
					strony.dodawanie.panel.fadeOut('normal', function() {
						strony.edycja.panel.fadeIn();
					});
				}
				var id = $(this).parent().parent().parent('.strona').attr('data-id');
				$.ajax({
					type: 'GET',
					url: '../skrypty/ajax_wpisy.php',
					data: { element: 'strona', dzialanie: 'pobierz', id: id },
					success: function(daneZwrotne) {
						var json = $.parseJSON(daneZwrotne);
						strony.edycja.tytul_pelny.val(json.tytul_pelny);
						strony.edycja.tytul_prosty.val(json.tytul_prosty);
						strony.edycja.tresc.val(json.tresc);
						strony.edycja.formularz.find('input[name="id"]').val(json.id);
					},
					error: function() { alert('Błąd AJAX przy pobieraniu danych strony'); }
				});
			});
			//Edycja strony AJAX
			$('#edycja_strony').on('submit', function(e) {
				e.preventDefault();
				var $formularz = $('#edycja_strony'),
					id = $formularz.find('[name=id]').val();
				// loading($('.lista_stron'), $('#edycja_strony input:submit'), 'on');
				$.ajax({
					type: 'POST',
					url:  '../skrypty/ajax_wpisy.php',
					data: $('#edycja_strony').serialize() + '&element=strona&dzialanie=zapisz', //serialize: id, tytul, tresc
					success: function(daneZwrotne) {
						console.log(daneZwrotne);
						$('.lista_stron tbody').html(daneZwrotne);
						// loading($('.lista_stron'), $('#edycja_strony input:submit'), 'off');
						$('.panel_edycja_strony').fadeOut('normal', function() {
							$('.panel_dodawanie_strony').fadeIn();
						});
						animujTloTabeli(id, '#5cb85c', $('.lista_stron'));
					},
					error: function() { alert('Błąd przy edycji strony'); }
				});
			});
			//Usunięcie strony AJAX
			$('.lista_stron').on('click', '.usuniecie_strony', function(e) {
				e.preventDefault();
				//if (confirm('Czy na pewno usunąć stronę?')) {
					var $this = $(this),
					id = $this.parent().parent().parent('.strona').attr('data-id');
					$.ajax({
						type: 'POST',
						url:  '../skrypty/ajax_wpisy.php',
						data: { element: 'strona', dzialanie: 'usun', id: id },
						success: function() {
							$this.parent().parent().siblings().addBack().css('background-color', '#c9302c').parent('.strona').fadeOut('normal', function() {
								$(this).remove();
							});
						},
						error: function() { alert('Błąd przy usuwaniu strony'); }
					});
				//}
			});
			//Anulowanie edycji strony
			$('#edycja_strony').on('click', '.anuluj', function(e) {
				e.preventDefault();
				$('.panel_edycja_strony').fadeOut('normal', function() {
					$('.panel_dodawanie_strony').fadeIn();
				});
			});
			strony.dodawanie.formularz.bootstrapValidator({
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				}
			});
		}
	};

	if ($('body').attr('id') == 'panel_administracyjny') {
		wpisy.start();
		strony.start();
	}

//PLUGINY

	/* Polish initialisation for the jQuery UI date picker plugin. */
	/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
	jQuery(function($) {
		$.datepicker.regional['pl'] = {
			closeText: 'Zamknij',
			prevText: '&#x3c;Poprzedni',
			nextText: 'Następny&#x3e;',
			currentText: 'Dziś',
			monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
			monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze','Lip','Sie','Wrz','Pa','Lis','Gru'],
			dayNames: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
			dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
			dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
			weekHeader: 'Tydz',
			dateFormat: 'dd.mm.yy',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: ''
		};
		$.datepicker.setDefaults($.datepicker.regional['pl']);
	});

	$('input[name=data]').datepicker();

});