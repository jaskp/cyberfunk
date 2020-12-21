import * as Tone from 'tone'
import { StereoWidener } from 'tone'
import { Scale } from './notes'


const c_major = new Scale(undefined, 1)
const notes = [9, 9, 9, ]

// constants
const distortion = 10

export const master_envelope = new Tone.Follower()
export const meter = new Tone.Meter(.1)
meter.toDestination()
// Tone.Destination.connect(meter)

const kick = new Tone.Player({
  // url: '../res/kshmr-kick-11.wav',
  loop: false,
  autostart: false
}).connect(meter)

const kick_promise = kick.load('/kshmr-kick-11.wav')

const kick_loop = new Tone.Loop((time) => {
  console.log(kick.buffer)
  kick.start(time)
}, '4n')

const note_pattern = [
  'A1', 'A1', 'A1', 'E2', 'E2', 'A1', 'D2', 'G1',
  'A1', 'A1', 'C2', 'C2', 'A1', 'A1', 'A1', 'A1',
]
const bass_note_pattern = [
  'A0', 'A0', 'A0', 'E1', 'E1', 'A0', 'D1', 'G0',
  'A0', 'A0', 'C1', 'C1', 'A0', 'A0', 'A0', 'A0',
]

// const kick_sample = new Tone.ToneAudioBuffer('../res/kshmr-kick-11.wav')

export const fake_sidechain = new Tone.AmplitudeEnvelope(0.3, '0', 1, '0').toDestination()
fake_sidechain.attackCurve = 'sine'
const sidechain_loop = new Tone.Loop((time) => fake_sidechain.triggerAttackRelease('4n', time), '4n')
// const widener = new StereoWidener(1).connect(fake_sidechain)

export const distorter = new Tone.Distortion({distortion, oversample: '4x'}).connect(fake_sidechain)
export const fm_synth = new Tone.FMSynth().connect(distorter)
export const sub_bass = new Tone.Synth().connect(fake_sidechain)



sub_bass.detune.value = 0
const synthB = new Tone.AMSynth().connect(distorter)


const seq = new Tone.Sequence({
  events: note_pattern,
  callback: (time, note) => {
    sub_bass.triggerAttackRelease(note, '16n', time)
    fm_synth.triggerAttackRelease(note, '32n', time)
  },
  subdivision: '16n'
})

// const drums = new Tone.Sampler({
//   1: '../res/kshmr-kick-11.wav',
//   2: '../res/kshmr-snare-18.wav'
// })

// const p = new Tone.PolySynth(drums, {
//   1: '../res/kshmr-kick-11.wav',
//   2: '../res/kshmr-snare-18.wav'
// })



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
  sidechain_loop.start(0)
  kick_loop.start(0)

  // the loops start when the Transport is started
  // ramp up to 800 bpm over 10 seconds



}

// Tone.Transport.start()

