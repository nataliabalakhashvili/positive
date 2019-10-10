$(document).ready(function(){

	var playing = false;
	var playerVolume = 0.5;
	var pastVolume;

	AOS.init();

	var transEffect = Barba.BaseTransition.extend({
    start: function(){
      this.newContainerLoading.then(val => this.fadeInNewcontent($(this.newContainer)));
    },
    fadeInNewcontent: function(nc) {
      nc.hide();
      var _this = this;
      $(this.oldContainer).addClass("out").fadeOut(800).promise().done(() => {
        nc.removeClass('out');
        nc.fadeIn(0, function(){
          _this.done();
        })
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return transEffect;
  }

  Barba.Pjax.start();

  var links = document.querySelectorAll('a[href]');
	var cbk = function(e) {
	 if(e.currentTarget.href === window.location.href) {
	   e.preventDefault();
	   e.stopPropagation();
	 }
	};

	for(var i = 0; i < links.length; i++) {
	  links[i].addEventListener('click', cbk);
	}

  // tooltip script
	$('.tooltipped').tooltip({delay: 0});
	
	$('.music-menu, .music-list-close, .menu-list-close').on('click', function(){
		$('.music-list-close, .music-list-fixed').toggleClass('active');
	});

	$('.burger-menu, .nav-fixed ul a').on('click', function(){
		$('.nav-fixed, .burger-menu').toggleClass('active');
	});

	$('.owl-content .owl-carousel').owlCarousel({
	    loop: false,
	    dots: false,
	    navSpeed: 700,
	    navText: [
	      '<img src="assets/images/pink-arrow.svg"/>',
	      '<img src="assets/images/pink-arrow.svg"/>'
	    ],
	    responsive: {
	      0: {
	        items: 4
	      },
	      300: {
	        items: 5
	      }
	    },
	    nav: true
	});

	Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container) {
	  
	  newPageReadyScript();

	});
	  

	function newPageReadyScript(){

		$('.slider-bg .owl-carousel').owlCarousel({
				autoplaySpeed: 3000,
		    loop: true,
		    dots: false,
		    nav: false,
		    autoplay: true,
		    items: 1,
			  animateIn: 'fadeIn', // add this
			  animateOut: 'fadeOut' // and this
		});

		$('.image-mode').on('click', function(){
			$('.image-mode, .slider-bg').addClass('active');
			$('.blue-mode').removeClass('active');
		});

		$('.blue-mode').on('click', function(){
			$('.image-mode, .slider-bg').removeClass('active');
			$('.blue-mode').addClass('active');
		});

	}

	newPageReadyScript();

	$(function() {
		$('audio').audioPlayer();
	});


 	var indPlaying = false;
	$('.play-music, .live').on('click', function(){
		$('.play-music, .live').toggleClass('active');
		// pauseMusic();
		musicPlay($(this));
		if (indPlaying == false) {
			document.getElementById('indexAudio').play();
			document.getElementById('mainAudio').volume = playerVolume;
			indPlaying = true;
			playing = true;
	  	} else {
	   		document.getElementById('indexAudio').pause();
		   	indPlaying = false;
		   	pauseMusic();
		   	pauseLive();
	 	}
	});

	function pauseLive(){
		document.getElementById('indexAudio').pause();
	   	indPlaying = false;
 		$('.play-music, .live').removeClass('active');
	}

	function pauseMusic(){
		document.getElementById('mainAudio').pause();
	   	playing = false;
 		$('.music-control .pause, .mus-play').removeClass('active');
	}

	$('.each-music').on('click', function(){
		playing = true;
		pauseLive();
		$('.live').removeClass('active');
		musicPlay($(this));
		buttonsDisable();
	});

	$('.mus-next, .music-control .next').on('click', function(){
		pauseLive();
		playing = true;
		$('.live').removeClass('active');
		let currentId = $('.cover .info .title').attr('data-id');
		for (var i = 1; i < $('.each-music').length; i++) {
			if($('.each-music:nth-child(' + i + ')').attr('data-id') == currentId){
				musicPlay($('.each-music:nth-child(' + (i + 1) + ')'));
			}
		}
		buttonsDisable();
	});

	$('.mus-prev, .music-control .prev').on('click', function(){
		pauseLive();
		playing = true;
		$('.live').removeClass('active');
		let currentId = $('.cover .info .title').attr('data-id');
		for (var i = 2; i <= $('.each-music').length; i++) {
			if($('.each-music:nth-child(' + i + ')').attr('data-id') == currentId){
				musicPlay($('.each-music:nth-child(' + (i - 1) + ')'));
			}
		}
		buttonsDisable();
	});

	function musicPlay(element){
		let liveSrc = element.attr('data-src');
		let liveTitle = element.attr('data-title');
		let liveSong = element.attr('data-song');
		let liveImg = element.attr('data-img');
		let liveId = element.attr('data-id');
		element.addClass('active').siblings().removeClass('active');
		$('.cover .info .title .author').text(liveTitle);
		$('.cover .info .title').attr('data-id',liveId);
		$('.cover .info .title .song').text(liveSong);
		$('.cover .info .image').css('background-image','url(' + liveImg + ')');
		$('.audio-src').attr('src', liveSrc);
		$('.main-audio .audioplayer').addClass('audioplayer-playing');
		$('#mainAudio').load();
		var audio = document.getElementById('mainAudio');
		audio.play();
		document.getElementById('mainAudio').volume = playerVolume;
		$('.main-audio .audioplayer').addClass('audioplayer-playing');
		$('.music-control .pause, .mus-play').addClass('active');
	}

	function buttonsDisable(){
		if($('.each-music:last-child').hasClass('active')){
			$('.mus-next, .music-control .next').addClass('disable');
		} else {
			$('.mus-next, .music-control .next').removeClass('disable');
		}

		if($('.each-music:first-child').hasClass('active')){
			$('.mus-prev, .music-control .prev').addClass('disable');
		} else {
			$('.mus-prev, .music-control .prev').removeClass('disable');
		}
	}

 	$('.music-control .pause, .mus-play').click(function () {
		pauseLive();
 		$('.music-control .pause, .mus-play').toggleClass('active');
		$('menu-audio .audioplayer').toggleClass('audioplayer-playing');
	  	if (playing == false) {
			document.getElementById('mainAudio').play();
			document.getElementById('mainAudio').volume = playerVolume;
			playing = true;
	  	} else {
	   		document.getElementById('mainAudio').pause();
		   	playing = false;
	 	}
	});

	$( '.music-block' ).hover(
	  function() {
	    $( this ).find($('.music-tooltip')).addClass('active');
	  }, function() {
	    $('.music-tooltip').removeClass('active');
	  }
	);



	$('input[type=range]').wrap("<div class='range'></div>");
	var i = 1;

	$('.range').each(function() {
	  var n = this.getElementsByTagName('input')[0].value;
	  var x = (n / 100) * (this.getElementsByTagName('input')[0].offsetWidth - 8) - 12;
	  this.id = 'range' + i;
	  if (this.getElementsByTagName('input')[0].value == 0) {
	    this.className = "range"
	  } else {
	    this.className = "range rangeM"
	  }
	  this.innerHTML += "<style>#" + this.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #ed217c 0%, #ed217c " + n + "%, #ed217c " + n + "%)} #" + this.id + ":hover input[type=range]:before{content:'" + n + "'!important;left: " + x + "px;} #" + this.id + ":hover input[type=range]:after{left: " + x + "px}</style>";
	  i++
	});

	$('input[type=range]').on("input", function() {
	  var a = this.value;
	  var p = (a / 100) * (this.offsetWidth - 8) - 12;
	  if (a == 0) {
	    this.parentNode.className = "range"
	  } else {
	    this.parentNode.className = "range rangeM"
	  }
	  this.parentNode.getElementsByTagName('style')[0].innerHTML += "#" + this.parentNode.id + " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #ed217c 0%, #ed217c " + a + "%, #ed217c " + a + "%)} #" + this.parentNode.id + ":hover input[type=range]:before{content:'" + a + "'!important;left: " + p + "px;} #" + this.parentNode.id + ":hover input[type=range]:after{left: " + p + "px}";
	});

	var $slider = $('input[type="range"]');

	$slider.bind('change', function(e) {
	    $slider.val($(this).val());
	    playerVolume = $(this).val() / 100;
	    document.getElementById('mainAudio').volume = playerVolume;
	    e.preventDefault();
	});
	
	// var muteMode = false;
	// $('.volume-images').on('click', function(){
	// 	if(muteMode == true){
	// 		pastVolume = playerVolume;
	// 		$('.volume-images').addClass('active');
	// 		playerVolume = 0;
	//     // document.getElementById('mainAudio').volume = playerVolume;	
	//     muteMode = false;	
	// 	} else {
	// 		playerVolume = pastVolume;
	//     // document.getElementById('mainAudio').volume = playerVolume;		
	// 		$('.volume-images').removeClass('active');
	//     muteMode = true;	
	// 	}
	// });

});
