import subprocess
import os
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()

cloudflare_url = os.getenv('CLOUDFLARE_URL')


if not cloudflare_url:
    raise ValueError("CLOUDFLARE_URL not set in .env file")

# path to the input audio file 
input_audio_file = 'guitarup_looped.wav'
segment_duration = 10  # duration of each segment in seconds


# creates HLS segments and playlist
def create_hls_playlist(input_audio_file, segment_duration, bitrate):
    output_directory = f'output/mp4/{bitrate}/'  # directory to store the HLS segments

    # create the output directory if it doesn't exist
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    cloudflare_url = f'{cloudflare_url}{output_directory}'  # cloudflare URL prefix
    # define the output segment filename pattern and playlist path
    output_segment_pattern = os.path.join(output_directory, 'stream_%03d.ts')

    # define the playlist path
    playlist_path = os.path.join(output_directory, 'playlist_mp4.m3u8')

    # FFmpeg command to create HLS segments and playlist
    ffmpeg_command = [
        'ffmpeg', '-i', input_audio_file,
        '-c:a', 'aac',
        '-b:a', bitrate,
        '-vn',
        '-ac', '2',
        '-ar', '48000',
        '-f', 'hls',
        '-hls_time', str(segment_duration),
        '-hls_list_size', '0',
        '-hls_flags', 'independent_segments',
        '-hls_segment_filename', output_segment_pattern,
        playlist_path
    ]

    # run the FFmpeg command
    subprocess.run(ffmpeg_command, check=True)
    print(f'HLS playlist created: {playlist_path}')
    print(f'Segments stored in: {output_directory}')
    
    # update the playlist with Cloudflare URL prefix
    with open(playlist_path, 'r') as playlist_file:
        playlist_lines = playlist_file.readlines()
    
    # add Cloudflare URL prefix to segment URLs
    for i in range(len(playlist_lines)):
        if playlist_lines[i].startswith('#EXTINF'):
            segment_file = playlist_lines[i + 1].strip()
            cloudflare_segment_url = cloudflare_url + os.path.basename(segment_file)
            playlist_lines[i + 1] = cloudflare_segment_url + '\n'
    
    # write the updated playlist back to the file
    with open(playlist_path, 'w') as playlist_file:
        playlist_file.writelines(playlist_lines)
    print(f'Updated playlist with Cloudflare URL prefix: {playlist_path}')

def create_master_playlist(bitrates):
    master_playlist_path = 'output/mp4/master_playlist.m3u8'
    with open(master_playlist_path, 'w') as master_playlist:
        master_playlist.write('#EXTM3U\n')

        for bitrate in bitrates:
            bandwidth = int(bitrate.replace('k', '')) * 1000  # convert to bits per second
            playlist_path = f'{cloudflare_url}output/mp4/{bitrate}/playlist_mp4.m3u8'
            master_playlist.write(f'#EXT-X-STREAM-INF:BANDWIDTH={bandwidth}\n')
            master_playlist.write(f'{playlist_path}\n')

    print(f'Master playlist created at: {master_playlist_path}')


bitrates = ['96k', '128k', '160k']

# create HLS playlist and segments with Cloudflare URL
for bitrate in bitrates:
    create_hls_playlist(input_audio_file, segment_duration, bitrate)

# create master playlist
create_master_playlist(bitrates)
