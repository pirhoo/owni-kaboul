$(function(){
	
	//SOUND
	soundManager.onready(function() {
		if (soundManager.supported()) {
			soundManager.createSound('ambiantSound','./data/ambiant_sound.mp3');
			soundManager.play('ambiantSound');
		} else {
			//TODO
		}
	});
	$('.btnPlay').click( function(){
		soundManager.togglePause('ambiantSound');
		return false;
	}).toggle(
		function(){ $(this).removeClass('btnOff').addClass('btnOn'); },
		function(){ $(this).removeClass('btnOn').addClass('btnOff'); }
	);
	$('.btnSound').click( function(){
		soundManager.toggleMute('ambiantSound');
		return false;
	}).toggle(
		function(){ $(this).removeClass('btnSonOn').addClass('btnSonOff'); },
		function(){ $(this).removeClass('btnSonOff').addClass('btnSonOn'); }
	);


	//NAV
	$('#nav li a').click( function(){
		$('#nav li').removeClass('active');
		$(this).parent().addClass('active');
	}).mouseover( function(){
		var txt = $(this).text();
		var dxy = $(this).offset();
		
		$('#nav-slide p').empty().html(txt);
		$('#nav-slide').css('top', dxy.top)
					   .animate({ 
							width: "250px"
						  }, 500 );
	}).mouseout( function(){
		$('#nav-slide').stop()
					   .css('width', '0px');
	});
	//NAV BTN DESSIN
	$('#nav .ico1').click( function(){
		$('#fond').fadeTo('slow', 0.2, function() {
			$('#fond').fadeTo('slow', 1).css('background', 'url(img/map_dessin2.jpg)')
		});
	});
	//NAV BTN IMAGE
	$('#nav .ico2').click( function(){
		$('#fond').fadeTo('slow', 0.2, function() {
			$('#fond').fadeTo('slow', 1).css('background', 'url(img/map_image.jpg)')
		});
	});
	//NAV BTN VIDEO
	$('#nav .ico3').click( function(){
		$('#overlay').slideToggle('slow', function(){
			soundManager.mute('ambiantSound');
			$('#player').delay(250).show();
		});
	});
	
	
	//MARKER
	$('.marker').click( function(){
		$('.marker').removeClass('markerActive');
		$(this).addClass('markerActive');
		$('#overlay').slideToggle();
		soundManager.mute('ambiantSound');
		
		var id = $(this).attr('id');
		$.ajax({
			type: "GET",
			url: "data/"+id+"/data.xml",
			dataType: "xml",
			success: function(xml) {
				//SLIDE
				$("#slider").livequery( function(){
					$(this).easySlider({
						auto: false,
						speed: 4500
					});
				});

				
 				var node = $(xml).find('node');
				var title = $(node).find('title').text();
				var description = $(node).find('description').text();
				
				var pics = '';
				$(node).find('pic').each( function() {
					pics += "<li><span class=\"delay\">"+$(this).attr('temp')+"</span><span class=\"imgg\"><img height=\"400\" src=\"data/"+id+"/img/"+$(this).attr('src')+"\" /></span><span class=\"legend\">"+$(this).text()+"</span></li>";
				});
				
				var html = "<div id='top-slider'><h2>"+title+"</h2>"+description+"</div><div id='slider'><ul>"+pics+"</ul></div>";
				
				$('#overlay #slideshow').livequery( function(){
					$(this).empty().html(html).css('display', 'block');
					var mp3 = 'data/'+id+'/'+id+'.mp3';
					soundManager.createSound('rSound','./data/'+id+'/'+id+'.mp3');
					soundManager.play('rSound');
				});
				
				$('#nextBtn a').livequery( function(){
					$('#slider li').each(function(){ 
						var delay = $(this).children('.delay').text() * 1000;
						//alert(delay);
						setTimeout('$("#nextBtn a").click();', delay);
						
					});
				});
			}
		});
	}).mouseover( function(){
		var id = $(this).attr('id');
		$.ajax({
			type: "GET",
			url: "data/"+id+"/data.xml",
			dataType: "xml",
			success: function(xml) {
 				var node = $(xml).find('node');
				var title = $(node).find('title').text();
				var description = $(node).find('description').text();
				
				var html = "<h2>"+title+"</h2>"+description;
						
				$('#boxInfos').css({ 
					left:	300+"px", 
					top:  	50+"px"                       
				}); 
				
				$('#boxInfos .content').empty().html(html);
			}
		});
		$('#boxInfos').css('display', 'block');
	}).mouseout( function(){
		$('#boxInfos').css('display', 'none');
	});
	
	//CLOSE OVERLAY
	$('#overlay #close').livequery( function(){
		$(this).click( function() {
			soundManager.toggleMute('ambiantSound');
			soundManager.stop('rSound')
			soundManager.destroySound('rSound');
			$('.inline-playable').css('display', 'none');
			$('#overlay #player').css('display', 'none');
			$('#overlay #slideshow').css('display', 'none');
			$(this).parent().slideToggle('slow');
			
			$("#slider").empty();
		});
	});
})