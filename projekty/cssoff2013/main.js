$(function() {

$('.doll-box').click(function() {
	$('.doll-box').toggleClass('closed opened');
	$('.lid').toggleClass('closed opened');
})

var dynamicznyTekst = {
	el: {
		childSzer: 0,
		parentSzer: 0
	},
	testRozmiaru: function(to) {
		to.each(function() {
			var $this = $(this);
			dynamicznyTekst.getWymiary($this);
			while (dynamicznyTekst.el.childSzer < dynamicznyTekst.el.parentSzer) {
				dynamicznyTekst.getWymiary($this);
				$this.css('font-size', '+=1');
			}
		});
	},
	getWymiary: function(to) {
		this.el.childSzer = to.outerWidth(),
		this.el.parentSzer = to.parent().width();
	}
};
//dynamicznyTekst.testRozmiaru($('.specs span'));
//dynamicznyTekst.testRozmiaru($('.details span'));

var suwaki = {
	el: {
		strona: $('#main')
	},
	init: function() {
		var tloOpacity = localStorage['przezroczystosc-tla'] || 1,
		stronaOpacity = localStorage['przezroczystosc-strony'] || 1;
		
		$('body').append('<div class="suwak tlo"><span>Background</span></div><div class="suwak strona"><span>Strona</span></div><div id="tlo"></div>');

		this.el.tlo = $('#tlo');
		this.el.tlo.css('opacity', tloOpacity);
		this.el.strona.css('opacity', stronaOpacity);
		
		$('.suwak.tlo').slider({
			orientation: 'vertical',
			min: 0,
			max: 10,
			value: tloOpacity * 10,
			slide: function(event, ui) {
				suwaki.el.tlo.css('opacity', ui.value / 10);
			}
		});
		
		$('.suwak.strona').slider({
			orientation: 'vertical',
			min: 0,
			max: 10,
			value: stronaOpacity * 10,
			slide: function(event, ui) {
				suwaki.el.strona.css('opacity', ui.value / 10);
			}
		});
		
		$(window).unload(function() {
			localStorage.setItem('przezroczystosc-tla', suwaki.el.tlo.css('opacity'));
			localStorage.setItem('przezroczystosc-strony', suwaki.el.strona.css('opacity'));
		});
	}
};
// suwaki.init();

var plywanie = {
	el: {
		pl: $('#overflow p'),
		interwal: null,
		pudelko: null,
		akapit: null
	},
	pudelko: {
		szer: $('#overflow').width(),
		wys: $('#overflow').height()
	},
	init: function() {
		this.el.akapit = {
			x2: plywanie.el.pl.width(),
			y2: plywanie.el.pl.height()
		};
		this.el.interwal = setInterval(function() { plywanie.ruch() }, 1200);
		this.klik();
	},
	ruch: function() {
		//Dla każdego paragrafu...
		$('#overflow p').each(function() {
			var x = $(this).position().left, //Lewa krawędź
				y = $(this).position().top,	//Górna krawędź
				szer = $(this).width(), //Prawa krawędź/szerokość
				wys = $(this).height(),	//Dolna krawędź/wysokość
				ruchPoziomy = plywanie.licz(5), //Wylosowana wartość przesunięcia w poziomie
				ruchPionowy = plywanie.licz(5);	//Wylosowana wartość przesunięcia w pionie

			//Jeżeli element przekroczyłby lewą krawędź...
			if (x + ruchPoziomy < 0) {
				//Umieść go przy tej krawędzi
				$(this).css('left', 0);
			//Jeżeli element przekroczyłby prawą krawędź...
		} else if (x + szer + ruchPoziomy > plywanie.pudelko.szer) {
				//Umieść go przy tej krawędzi
				$(this).css('left', plywanie.pudelko.szer - szer);
			//W przeciwnym razie...
		} else {
				//Aktualizuj ruch w poziomie o wylosowaną wartość
				$(this).css('left', '+=' + ruchPoziomy);
			}

			//Jeżeli element przekroczyłby górną krawędź...
			if (y + ruchPionowy < 0) {
				//Umieść go przy tej krawędzi
				$(this).css('top', 0);
			//Jeżeli element przekroczyłby dolną krawędź...
		} else if (y + wys + ruchPionowy > plywanie.pudelko.wys) {
				//Umieść go przy tej krawędzi
				$(this).css('top', plywanie.pudelko.wys - wys);
			//W przeciwnym razie...
		} else {
				//Aktualizuj ruch w pionie o wylosowaną wartość
				$(this).css('top', '+=' + ruchPionowy);
			}
		});
	},
	klik: function() {
		$('#overflow').on('click', function() {
			clearInterval(plywanie.el.interwal);
		});
	},
	licz: function(liczba, minimum) {
		//Wartość domyślna parametru
		minimum = minimum || 0;
		var zmienna = Math.random() * liczba + minimum; //Losowa liczba z podanego zakresu (od 'minimum' do 'liczba' + 'minimum')
		//Wylosuj wartość ujemną lub dodatnią dla powyższej liczby
		zmienna = (Math.random() < 0.5) ? -zmienna : zmienna;
		//Zwróć wynik
		return zmienna;
	}
};
plywanie.init();

$('#abbey-road').on('click', '.map', function() {
	$(this).toggleClass('full');
});

});