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
	var sampler1 = createSampler('./audio/1.mp3', KeyMapper.getCode('Q'),'track1');
	var sampler2 = createSampler('./audio/2.mp3', KeyMapper.getCode('W'),'track2');
	var sampler3 = createSampler('./audio/3.mp3', KeyMapper.getCode('E'),'track3');
  	var sampler4 = createSampler('./audio/4.mp3', KeyMapper.getCode('R'),'track4');
  	var sampler5 = createSampler('./audio/5.mp3', KeyMapper.getCode('T'),'track5');
  	var sampler6 = createSampler('./audio/6.mp3', KeyMapper.getCode('Y'),'track6');
  	var sampler7 = createSampler('./audio/7.mp3', KeyMapper.getCode('U'),'track7');
  	var sampler8 = createSampler('./audio/8.mp3', KeyMapper.getCode('I'),'track8');
  	var sampler9 = createSampler('./audio/9.mp3', KeyMapper.getCode('O'),'track9');
  	var sampler10 = createSampler('./audio/10.mp3', KeyMapper.getCode('P'),'track10');
    var sampler11 = createSampler('./audio/11.mp3', KeyMapper.getCode('A'),'track11');
    var sampler12 = createSampler('./audio/12.mp3', KeyMapper.getCode('S'),'track12');
    var sampler13 = createSampler('./audio/13.mp3', KeyMapper.getCode('D'),'track13');
    var sampler14 = createSampler('./audio/14.mp3', KeyMapper.getCode('F'),'track14');
    var sampler15 = createSampler('./audio/15.mp3', KeyMapper.getCode('G'),'track15');
    var sampler16 = createSampler('./audio/16.mp3', KeyMapper.getCode('H'),'track16');
    var sampler17 = createSampler('./audio/17.mp3', KeyMapper.getCode('J'),'track17');
    var sampler18 = createSampler('./audio/18.mp3', KeyMapper.getCode('K'),'track18');
    var sampler19 = createSampler('./audio/19.mp3', KeyMapper.getCode('L'),'track19');
  	
  	sampler1.render();
  	sampler2.render();
  	sampler3.render();
  	sampler4.render();
  	sampler5.render();
  	sampler6.render();
  	sampler7.render();
  	sampler8.render();
  	sampler9.render();
  	sampler10.render();
  	sampler11.render();
  	sampler12.render();
  	sampler13.render();
  	sampler14.render();
  	sampler15.render();
  	sampler16.render();
  	sampler17.render();
  	sampler18.render();
  	sampler19.render();

  	$('#search-term').submit(function(e){

  		e.preventDefault();
       	$('#search-results').html('');
       	var term= $(this).find("imput[name='song']").val();
        searchSongs(term);
  	});
  	

  	$(".how").click(function(){
    	$(".overlay").fadeIn(1000);
  	});

  	$("a.close").click(function(){
  		$(".overlay").fadeOut(1000);
  	});
});

// Factory pattern 
function createSampler(audioSrc, keyCode, name) {
	var sampler = {
		_aud: new Pizzicato.Sound({ 
		    source: 'file',
		    options: {
		    	path: audioSrc,
		    }
		}),

		src: audioSrc,
		keyCode: keyCode,
		name: name,
		isPlaying: false,
		isLooping: false,
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
			});
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


var getSearchResults = function(media, resultNum) {
	var results = resultNum + ' results for <strong>' + media + '</strong>';
	return results;
};

var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};


var getMuisc = function (term) {
	var results = $('.templates .music').clone();

	var songElem = result.find('.result .music');
	songElem.attr('href', previewUrl.artworkUrl30);
	songElem.text(artistName.trackName);


	return results;
}

var searchSongs = function(term){
 
 	var request = {
    	
		media: 'music',
		entity: 'song',
		limit: 1,
		explicit: 'Yes',
	};

	$.ajax({
		url: "https://itunes.apple.com/search?",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(data){
		var searchResults = getSearchResults(request.media, data.entity);
		 console.log(data)
		$('#search-term').html(searchResults);
		$.each(data.entity, function(i, item) {
			c
			var music = getMuisc(item);
			$('#search-results').append(music);
		});
	})
	.fail(function(jqXHR, error){
		var errorELm = showError(error);
		$('#search-results').html(errorElem);
	});
};

// create jason for itunes  figure how to promp songs into the keys and display artwork let them search by genre
// droppable function in jquery might work for drag and drop songs 
// create a function that creates the  samplers 
// prevent keyboard from tiggering sounds when searching for songs 
 



//limit to top 10 rated songs by artist 





