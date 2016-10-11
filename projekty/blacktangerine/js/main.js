$(document).ready(function(){
	
	//Pobranie szerokości elementów i ich ilości
	var imageWidth = $(".slider").width();
	var imageSum = $(".reel div").size();
	
	//Przypisanie reelowi nowej szerokości
	$(".reel").css({'width' : imageWidth * imageSum});
	
	rotate = function(){
		var triggerID = $active.attr("rel") - 1; //Ilość potrzebnych przesunięć
		var image_reelPosition = triggerID * imageWidth; //Ustalenie odległości o jaką trzeba przesunąć element
	
		$("#nav ul li a").removeClass('active'); //Usunięcie klasy active
		$active.addClass('active'); //Dodanie klasy active
	
		//Animacja przesunięcia
		$(".reel").animate({
			left: -image_reelPosition
		}, 500 );
	};
	
	//Kliknięcie
	$("#nav a").click(function() {
		$active = $(this); //Aktywuj link
		rotate(); //Przesuń element
		return false;
	});
	
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-24232014-2']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();