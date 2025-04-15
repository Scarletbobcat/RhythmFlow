from pydub import AudioSegment

song = AudioSegment.from_file("guitarup_raw.wav")

# Loop the audio segment
looped_song = song * 30  # Loop 30 times

# Export the looped audio to a new file
looped_song.export("guitarup_looped.wav", format="wav")