import logging
from pydub import AudioSegment
from pydub.exceptions import CouldntDecodeError

input_file = 'guitarup_raw.wav'

# configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def compress(input_path, output_path, format):
    try:
        # load the audio file 
        audio = AudioSegment.from_file(input_path)
        # export the audio file to the specified format
        if (format == 'ogg'):
            audio.export(
                output_path,
                format=format,
                codec='libopus',
                # using these parameters: bitrate 96k, sample rate 48kHz
                parameters=['-b:a', '96k', '-ar', '48000']
            )
        elif (format == 'mp4'):
            audio.export(
                output_path,
                format=format,
                codec='aac',
                parameters=['-b:a', '96k', '-ar', '48000']
            )
        else:
          audio.export(
              output_path,
              format=format,
            #   codec='libmp3lame',
              parameters=['-b:a', '128k', '-ar', '48000']
          )
        return True
    except CouldntDecodeError:
        logger.error(f'Failed to decode {input_path}. Ensure it is a valid file.')
        return False
    except Exception as e:
        logger.error(f'Error converting file: {str(e)}')
        return False
    
# list of formats to convert to
formats = ['mp3', 'ogg', 'mp4']

# compressing the audio file into each format listed above
for format in formats:
  logger.info(f'Attempting to convert to {format} format.')
  result = compress(input_file, f'output.{format}', format)
  if result:
      print('Conversion successful.')
  else:
      print('Conversion failed.')