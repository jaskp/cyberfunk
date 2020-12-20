import * as Tone from 'tone'
import { Scale } from './notes'


const c_major = new Scale(undefined, 1)
const notes = [9, 9, 9, ]

// constants
const distortion = 10

export const distorter = new Tone.Distortion({distortion, oversample: '4x'}).toDestination()
export const fm_synth = new Tone.FMSynth().connect(distorter)
const synthB = new Tone.AMSynth().connect(distorter)

const seq = new Tone.Sequence({
  events: ['A1', 'A1', 'A1', 'E2', 'E2', 'A1', 'D2', 'G1'],
  callback: (time, note) => { fm_synth.triggerAttackRelease(note, '32n', time) },
  subdivision: '16n'
})

const kick = new Tone.Player({
  // url: '../res/kshmr-kick-11.wav',
  loop: false,
  autostart: false
}).toDestination()

const kick_promise = kick.load('/kshmr-kick-11.wav')


// const kick_sample = new Tone.ToneAudioBuffer('../res/kshmr-kick-11.wav')



// const drums = new Tone.Sampler({
//   1: '../res/kshmr-kick-11.wav',
//   2: '../res/kshmr-snare-18.wav'
// })

// const p = new Tone.PolySynth(drums, {
//   1: '../res/kshmr-kick-11.wav',
//   2: '../res/kshmr-snare-18.wav'
// })

const kick_loop = new Tone.Loop((time) => {
  console.log(kick.buffer)
  kick.start(time)
}, '4n')


// export const MOD = {
//   get dist() { return distorter.distortion },
//   set dist(val: number) { distorter.distortion = val },

//   get fm_index() { return synthA.modulationIndex.value },
//   set fm_index(val: number) { synthA.modulationIndex.rampTo(val, '1n')}
// }


export const start_music = async () => {
  console.log(Tone.Buffer.supportsType('wav'))
  await kick_promise
  Tone.Transport.bpm.value = 95
  Tone.Transport.start()
  seq.start(0)
  kick_loop.start(0)

  // the loops start when the Transport is started
  // ramp up to 800 bpm over 10 seconds



}

// Tone.Transport.start()

