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
  		createSampler().render();
  	}
  


  	$('#search-term').submit( function(event){
		event.preventDefault();
       	
       	var term= $(this).find("input[name='song']").val();
        searchSongs(term);
  	});
  	

  	$(".how").click(function(){
    	$(".overlay").fadeIn(1000);
  	});

  	$("a.close").click(function(){
  		$(".overlay").fadeOut(1000);
  	});
});


var keyQueue = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
// Factory pattern 
function createSampler(audioSrc, name) {

	if (!keyQueue.length){
		throw new Error (' Max Samplers already created.');
	}
	var keyCode = KeyMapper.getCode(keyQueue.shift());
	var sampler = {
		keyCode: keyCode,
		isPlaying: false,
		isLooping: false,
		sound: function(audioSrc, name) {
			this._aud = new Pizzicato.Sound({ 
		    	source: 'file',
		    	options: {
		    		path: audioSrc,
		    	}
			});
			this.name = name;
			this.audioSrc = audioSrc;
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
			var node = $('<li>Press ' + KeyMapper.getValue(this.keyCode) + ' for ' + this.name + '</li>').appendTo('.artwork');
			var self = this;
			node.on('touchstart', function(evt){
				self.play();
			}).on('touchend', function(evt) {
				self.stop();
			}).on('drop', function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				console.log('hello');
			});
			//need to make this node droppable 
		},
		hasFx: function(fx){
			return this._aud.effects.includes(fx);
		},
	};
	

	$(document).keydown(function(evt) {
		if (evt.keyCode == sampler.keyCode) {
			sampler.play();
		}
		else if (evt.keyCode == KeyMapper.getCode('SPACE') && sampler.isPlaying){
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

	}).keyup(function(evt) {
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


// drag and drop function i think it goes in the doc . ready
$( function() {
    // $( ".draggable" ).draggable();
    $( ".droppable" ).droppable({
      drop: function( event, ui ) {
    console.log(ui.draggable[0].children[0].attributes[2].nodeValue);
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

//shows results # but thats it
var getSearchResults = function(entity, resultNum) {
	var results = resultNum + ' results for ' + entity;
	return results;
};

var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// this is not doign what i expect not showig the artwork or preview or name or trackname
//need to fix this 
var getMusic = function (item) {
	var songItem = $(".templates .result").clone();
	var songElem = songItem.find('.asong');
	songElem.attr('href', item.previewUrl);
	var songElem = songItem.find('.awork');
	songElem.attr('src', item.artworkUrl100);
	var songElem = songItem.find('p');
	songElem.text(item.artistName + ' ' + item.trackName);
	
	return songItem;
};

var searchSongs = function(term){
    
 	var request = {
    	
		media: 'music',
		entity: 'song',
		limit: 9,
		explicit: 'Yes',
		term: term.replace(/ /g, '+'),
	};

	$.ajax({
		url: "https://itunes.apple.com/search",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		var searchResults = getSearchResults(request.media, result.resultCount);
		 	
		$('.search-results').prepend(searchResults);
		$.each(result.results, function(i, item){
			var song = getMusic(item);
			$(".draggable").append(song);
			$( ".draggable li" ).draggable();
			// console.log(song)
		});
	})
	.fail(function(jqXHR, error){
		var errorELm = showError(error);
		$('.search-results').html(errorElem);
	});
};




// create jason for itunes  figure how to promp songs into the keys and display artwork let them search by genre
 
 
// prevent keyboard from tiggering sounds when searching for songs 
 
