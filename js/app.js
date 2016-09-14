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

KeyMapper.create(32, 'SPACE');
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
KeyMapper.create(88, 'X', 'Delay');
KeyMapper.create(67, 'C', 'Filter');
KeyMapper.create(86, 'V', 'Reverb');


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
			$('.artwork').append('<li>Press ' + KeyMapper.getValue(this.keyCode) + ' for ' + this.name + '</li>');
		}
	};
	// sampler._aud.preload = true;

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
				sampler._aud.addEffect(dubDelay);
			}
		else if (evt.keyCode == KeyMapper.getCode('Filter') && sampler.isPlaying){
				sampler._aud.addEffect(lowPassFilter);
			}
		else if (evt.keyCode == KeyMapper.getCode('Reverb') && sampler.isPlaying){
				sampler._aud.addEffect(reverb);
			}

	}).keyup(function(evt) {
		if (evt.keyCode == sampler.keyCode && !sampler.isLooping) {
			sampler.stop();
		}
		else  if (evt.keyCode == KeyMapper.getCode('Delay') ) {
			sampler._aud.removeEffect(dubDelay);
		}
		else  if (evt.keyCode == KeyMapper.getCode('Filter') ) {
			sampler._aud.removeEffect(lowPassFilter); 	
		}
		else  if (evt.keyCode == KeyMapper.getCode('Reverb') ) {
			sampler._aud.removeEffect(reverb);
		}

	});

	return sampler;
}



// need to implement this to the object above and add the functionality that when keydown delay lays keyup remove fx
// once delay is added add lowpasfilter and reverb witht he same functionality. same way we did with spacebar
  


var dubDelay = new Pizzicato.Effects.DubDelay({
    feedback: 0.6,
    time: 0.7,
    mix: 0.5,
    cutoff: 700
});

var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 500,
    peak: 30,
    mix: 0.5
});

var reverb = new Pizzicato.Effects.Reverb({
    time: 1,
    decay: 0.8,
    reverse: true,
    mix: 0.75
});





