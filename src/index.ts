import {setup, Path, view} from 'paper'
import * as Tone from 'tone'
import draw_sketch from './sketch'
import {start_music} from './audio'

document.getElementById('Play').addEventListener('click', async () => {
  await Tone.start()
  start_music()
  console.log('Audio context started.')
})

document.getElementById('Stop')?.addEventListener('click', async () => {
  Tone.Transport.pause()
  console.log('Audio context stopped.')
})

window.onload = () => {
  setup('Canvas')
	draw_sketch()
}