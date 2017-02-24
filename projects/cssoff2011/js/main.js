$(function() {
	
	//Obstacle viewer
	
	var viewer = $('.obstacle-viewer img'),
		subtitle = $('.obstacle-viewer p');
	
	$('.obstacle-list').on('click', 'figure', function() {
		$(this).addClass('active').siblings().removeClass();
		var kid = $(this).children('img');
		subtitle.html(kid.attr('alt') + '<br><span>' + kid.attr('title') + '</span>');
        viewer.attr({
			src: kid.attr('src'),
			alt: kid.attr('alt')
		});
    });
	
	//Custom form select elements
	
	$('select').each(function() {
		var title = $(this).attr('title');
		$(this).after('<span>' + title + '</span>')
			   .change(function() {
				   val = $('option:selected', this).text();
				   $(this).next().text(val);
			   })
	});

	$('nav a').smoothScroll({
		speed: 500
	});

	//Countdown

	var countDown = {
		timer : $('#counter p'),
		time : 60,
		counting : false,
		button : $('#counter').next(),
		start : function() {
			this.counting = true;
			this.timer.text(this.time);
			this.countdown();
		},
		countdown : function() {
			if (this.time > 0) {
				timeout = setTimeout(function() {
					countDown.time--;
					countDown.timer.text(countDown.time);
					countDown.countdown();
				}, 1000);
			} else {
				this.counting = false;
				countDown.button.html('Click here to<br>try again!');
			}
		},
		init : function() {
			$('form input, form select').focus(function() {
				if ($('#timer').is(':visible')) {
					if (!countDown.counting) { countDown.start(); }
				}
			});
			countDown.button.click(function() {
				if (!countDown.counting) {	
					$(this).html('The clock<br>is ticking!');
					countDown.time = 60;
					countDown.start();
				}
			});
		}
	}

	countDown.init();
		
});