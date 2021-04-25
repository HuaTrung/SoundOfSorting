
export const sound_test = (tone, track,value1,value2,size,audio,delay) => {
	var factor = ((value1 / size) + (value2 / size) / 2);
    var frequency = 2000 + (factor * 2000);

    tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

    track.gain.cancelScheduledValues(audio.currentTime);
    track.gain.linearRampToValueAtTime(0.75, audio.currentTime);
    track.gain.linearRampToValueAtTime(0, audio.currentTime + delay/1000);
};


export const sound_swap = (tone, track,value1,value2,size,audio,delay) => {
    var factor = ((value1 / size) + (value2 / size) / 2);
    var frequency = 2000 - (factor * 2000);

    tone.frequency.linearRampToValueAtTime(frequency, audio.currentTime);

    track.gain.cancelScheduledValues(audio.currentTime);
    track.gain.linearRampToValueAtTime(1, audio.currentTime);
    track.gain.linearRampToValueAtTime(0, audio.currentTime + delay/1000);
};
