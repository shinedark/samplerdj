var KeyMapper = {
	_keyMap: {},
	_valueMap: {},
	_effectMap: {},
	create: function(code, value, effect) {
		this._keyMap[code] = value;
		this._valueMap[value] = code;
		this._effectMap[effect] = { value: value, code: code };
	},
	getValue: function(codeOrEffect) {
		return this._keyMap[codeOrEffect] || this._effectMap[codeOrEffect].value;
	},
	getCode: function(valueOrEffect) {
		return this._valueMap[valueOrEffect] || this._effectMap[valueOrEffect].code;
	}
}

KeyMapper.create(81, 'Q');
KeyMapper.create(87, 'W');
KeyMapper.create(69, 'E');
KeyMapper.create(82, 'R');
KeyMapper.create(84, 'T');
KeyMapper.create(89, 'Y');
KeyMapper.create(85, 'U');
KeyMapper.create(73, 'I');
KeyMapper.create(79, 'O');
KeyMapper.create(80, 'P');
KeyMapper.create(65, 'A');
KeyMapper.create(83, 'S');
KeyMapper.create(68, 'D');
KeyMapper.create(70, 'F');
KeyMapper.create(71, 'G');
KeyMapper.create(72, 'H');
KeyMapper.create(74, 'J');
KeyMapper.create(75, 'K');
KeyMapper.create(76, 'L');
KeyMapper.create(90, 'Z', 'Delay2');
KeyMapper.create(88, 'X', 'Delay');
KeyMapper.create(67, 'C', 'Filter');
KeyMapper.create(86, 'V', 'Reverb');
KeyMapper.create(66, 'B', 'PingDelay');
KeyMapper.create(78, 'N', 'Flanger');
KeyMapper.create(77, 'M', 'Hfilter');
KeyMapper.create(32, 'SPACE');


$(document).ready(function() {

  	
  	for (var i = 18; i >= 0; i--) {
  		createSampler(i).render();
  	}
  

  	$('#search-term').submit( function(event){
		event.preventDefault();
       	
       	var query= $(this).find("input[name='song']").val();
        searchSongs(query);
  	});
  	
  	$('.token').click(function(){
  		getToken();
  	});

});


var keyQueue = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
// Factory pattern 
function createSampler(i) {

	if (!keyQueue.length){
		throw new Error (' Max Samplers already created.');
	}
	var keyCode = KeyMapper.getCode(keyQueue.shift());
	var sampler = {
		keyCode: keyCode,
		isPlaying: false,
		isLooping: false,
		sound: function(audioSrc, name, source) {
			this._aud = new Pizzicato.Sound({ 
		    	source: 'file',
		    	options: {
		    		path: audioSrc,
		    	}
			});
			this.name = name;
			this.audioSrc = audioSrc;
			this.source = source;
		},
		play: function() {
          this._aud.play();
          this.isPlaying = true;
		},
		stop: function(){
		  this._aud.stop();
		  this._aud.loop = false;
		  this.isPlaying = false;
		  this.isLooping = false;
		},
		loop: function(){
		  this._aud.loop = true;
		  this.isLooping = true;
		},
		render: function(){
			var node = $('<li class="sampler-'+ i + '">Press ' + KeyMapper.getValue(this.keyCode) + '</li>').appendTo('.artwork');
			var self = this;
			node.on('touchstart', function(evt){
				self.play();
			}).on('touchend', function(evt){
				self.stop();
			}).on("drop", function(evt, ui){
				self.sound(ui.draggable[0].children[0].attributes[2].nodeValue,'song');
				$(evt.target).css("background-image","url('" + ui.draggable[0].children[1].attributes[1].nodeValue + "')");
				$(ui.draggable[0]).remove();
			});
			
		},
		hasFx: function(fx){
			return this._aud.effects.includes(fx);
		},
	};
	

	$(document).keydown(function(evt) {
		if(evt.target.nodeName!="INPUT"){
		if (evt.keyCode == sampler.keyCode) {
			sampler.play();
		}
		else if (evt.keyCode == KeyMapper.getCode('SPACE') && sampler.isPlaying){
			evt.preventDefault();
			if (sampler.isLooping){
				sampler.stop();
			}
		    else {
		    	sampler.loop();
		   	}
		}
		else if (evt.keyCode == KeyMapper.getCode('Delay') && sampler.isPlaying){
			if (!sampler.hasFx(dubDelay)){
				sampler._aud.addEffect(dubDelay);
			}
		}
		else if (evt.keyCode == KeyMapper.getCode('Filter') && sampler.isPlaying){
			if (!sampler.hasFx(lowPassFilter)){
				sampler._aud.addEffect(lowPassFilter);
			}
		}
		else if (evt.keyCode == KeyMapper.getCode('Reverb') && sampler.isPlaying){
			if (!sampler.hasFx(reverb)){
				sampler._aud.addEffect(reverb);
			}		
		}
		else if (evt.keyCode == KeyMapper.getCode('Delay2') && sampler.isPlaying){
			if (!sampler.hasFx(delay)){
				sampler._aud.addEffect(delay);
			}		
		}
		else if (evt.keyCode == KeyMapper.getCode('PingDelay') && sampler.isPlaying){
			if (!sampler.hasFx(pingPongDelay)){
				sampler._aud.addEffect(pingPongDelay);
			}		
		}
		else if (evt.keyCode == KeyMapper.getCode('Flanger') && sampler.isPlaying){
			if (!sampler.hasFx(flanger)){
				sampler._aud.addEffect(flanger);
			}		
		}
		else if (evt.keyCode == KeyMapper.getCode('Hfilter') && sampler.isPlaying){
			if (!sampler.hasFx(highPassFilter)){
				sampler._aud.addEffect(highPassFilter);
			}		
		}
	}
	}).keyup(function(evt) {
		if(evt.target.nodeName!="INPUT"){
		if (evt.keyCode == sampler.keyCode && !sampler.isLooping) {
			sampler.stop();
		}
		else  if (evt.keyCode == KeyMapper.getCode('Delay') ) {
			if (sampler.hasFx(dubDelay)){
				sampler._aud.removeEffect(dubDelay);
			}
		}
		else  if (evt.keyCode == KeyMapper.getCode('Filter') ) {
			if (sampler.hasFx(lowPassFilter)){
				sampler._aud.removeEffect(lowPassFilter);
			}	
		}
		else  if (evt.keyCode == KeyMapper.getCode('Reverb') ) {
			if (sampler.hasFx(reverb)){
				sampler._aud.removeEffect(reverb);
			}
		}
		else  if (evt.keyCode == KeyMapper.getCode('Delay2') ) {
			if (sampler.hasFx(delay)){
				sampler._aud.removeEffect(delay);
			}
		}
		else  if (evt.keyCode == KeyMapper.getCode('PingDelay') ) {
			if (sampler.hasFx(pingPongDelay)){
				sampler._aud.removeEffect(pingPongDelay);
			}
		}
		else  if (evt.keyCode == KeyMapper.getCode('Flanger') ) {
			if (sampler.hasFx(flanger)){
				sampler._aud.removeEffect(flanger);
			}
		}
		else  if (evt.keyCode == KeyMapper.getCode('Hfilter') ) {
			if (sampler.hasFx(highPassFilter)){
				sampler._aud.removeEffect(highPassFilter);
			}
		}
	}
	});

	return sampler;
}


 // touch effects mobile still have to figure out how to limit to the 2 filters by swipe up or down while hodling it down
// var effectsTouch = function(){
// 			var node = $('<li> ' + '</li>').append('.Effects');
// 					var self = this;
// 					node.on('touchstart', function(evt){
// 					self.play();
// 					}).on('touchend', function(evt) {
// 					self.stop();
// 					});
// 				};

$( function() {
    $( ".droppable li" ).droppable({
      drop: function( event, ui ) {
    
      }
    });
  } );

var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.6,
    time: 0.7,
    mix: 0.5,
    cutoff: 700
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 500,
    peak: 15,
    mix: 0.5
});

var reverb = new Pizzicato.Effects.Reverb({
    time: 1,
    decay: 0.8,
    reverse: true,
    mix: 0.5
});

var delay = new Pizzicato.Effects.Delay({
    feedback: 0.3,
    time: 0.3,
    mix: 0.5
});

var flanger = new Pizzicato.Effects.Flanger({
    time: 0.45,
    speed: 0.5,
    depth: 0.3,
    feedback: 0.1,
    mix: 1
});

var highPassFilter = new Pizzicato.Effects.HighPassFilter({
    frequency: 1200,
    peak: 10

});

var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
    feedback: 0.3,
    time: 0.2,
    mix: 0.68
});


var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};
 
var getMusic = function (item) {
	var songItem = $(".templates .result").clone();
	var songElem = songItem.find('.asong');
	songElem.attr('href', item.preview_url);
	var songElem = songItem.find('.awork');
	songElem.attr('src', item.album.images[1].url);
	var songElem = songItem.find('p');
	songElem.text(item.artists[0].name + ' ' + item.name);
	
	return songItem;
};

var searchSongs = function(query){
    $(".draggable").html('');
 	var request = {
    	
		q: query,
		type: 'track',
		limit: 9,
		market: 'US',
		explicit: 'Yes',
	};

	var hash = window.location.hash
	.substring(1)
	.split('&')
	.reduce(function (initial, item) {
	  if (item) {
	    var parts = item.split('=');
	    initial[parts[0]] = decodeURIComponent(parts[1]);
	  }
	  return initial;
	}, {});
	window.location.hash = '';

	// Set token
	var _token = hash.access_token;

	var authEndpoint = 'https://accounts.spotify.com/authorize';
	var response_type = 'token';
	var client_id = 'f236bcf1295242eb8acd55c05d0fcdb8';
	var redirect_uri = 'https://shinedark.github.io/samplerdj/';

	if (!_token) {
	  window.location = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&show_dialog=true`;
	}


	$.ajax({
		url: "https://api.spotify.com/v1/search",
		data: request,
		dataType: "json",
		type: "GET",
		headers: {
          'Authorization': 'Bearer ' + _token ,
          'Accept': 'application/json'
        },
	})
	// console.log(request)
	.done(function(result){
		$.each(result.tracks.items, function(i, item){
			var song = getMusic(item); 
			$(".draggable").append(song);
			$( ".draggable li" ).draggable();
		});
	})
	.fail(function(jqXHR, error){
		var errorELm = showError(error);
		$('.search-results').html(errorElem);
	});
};






