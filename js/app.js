var KeyMapper = {
	_keyMap: {},
	_valueMap: {},
	create: function(code, value) {
		this._keyMap[code] = value;
		this._valueMap[value] = code;
	},
	getValue: function(code) {
		return this._keyMap[code];
	},
	getCode: function(value) {
		return this._valueMap[value];
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


$(document).ready(function() {
	var sampler1 = createSampler('audio/1.mp3', KeyMapper.getCode('Q'),'track1');
	var sampler2 = createSampler('audio/2.mp3', KeyMapper.getCode('W'),'track2');
	var sampler3 = createSampler('audio/3.mp3', KeyMapper.getCode('E'),'track3');
  	var sampler4 = createSampler('audio/4.mp3', KeyMapper.getCode('R'),'track4');
  	var sampler5 = createSampler('audio/5.mp3', KeyMapper.getCode('T'),'track5');
  	var sampler6 = createSampler('audio/6.mp3', KeyMapper.getCode('Y'),'track6');
  	var sampler7 = createSampler('audio/7.mp3', KeyMapper.getCode('U'),'track7');
  	var sampler8 = createSampler('audio/8.mp3', KeyMapper.getCode('I'),'track8');
  	var sampler9 = createSampler('audio/9.mp3', KeyMapper.getCode('O'),'track9');
  	var sampler10 = createSampler('audio/10.mp3', KeyMapper.getCode('P'),'track10');

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
		_aud: new Audio(audioSrc),
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
		  this._aud.pause();
		  this._aud.load();
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
	sampler._aud.preload = true;

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
	}).keyup(function(evt) {
		if (evt.keyCode == sampler.keyCode && !sampler.isLooping) {
			sampler.stop();
		}
	});

	return sampler;
}





