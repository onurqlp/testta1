#!/usr/bin/env python3
"""Render six independent German demo MP3s from original AYDA transcripts.
No external paid TTS and no third-party sound files. Requires espeak-ng, ffmpeg.
"""
import json, pathlib, subprocess, tempfile, shutil, sys
base=pathlib.Path(__file__).resolve().parents[1]
items=json.loads((base/'scripts'/'hoeren-scripts.json').read_text(encoding='utf-8'))
out=base/'public'/'audio'
out.mkdir(parents=True,exist_ok=True)
engine=shutil.which('espeak-ng') or shutil.which('espeak')
if not engine or not shutil.which('ffmpeg'):
    sys.exit('Missing espeak-ng/espeak or ffmpeg; audio generation was not completed')
for item in items:
    name=item['id']
    with tempfile.TemporaryDirectory() as temp:
        wav=pathlib.Path(temp)/'speech.wav'
        subprocess.run([engine,'-v','de','-s','125','-p','42','-a','170','-w',str(wav),item['text']],check=True)
        mp3=out/(name+'.mp3')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),
            '-ac','1','-ar','22050','-b:a','24k','-codec:a','libmp3lame',str(mp3)],check=True)
        if mp3.stat().st_size<3000: sys.exit('Suspect empty sound file '+str(mp3))
        print(mp3.as_posix(),mp3.stat().st_size,'bytes')
