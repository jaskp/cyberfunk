const Endless = <T extends readonly any[]>(array: T) =>
  new Proxy(array, {get: (o, i) => o[((Number(i) % o.length) + o.length ) % o.length]})


export class Scale {
  static readonly CHROMATIC =
    Endless(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
  private readonly indices: number[] // positive ascending pls
  private root_octave: number
  private shift: number = 0

  constructor(indices?: number[], root_octave?: number) {
    this.indices = Endless(indices ?? [0, 2, 4, 5, 7, 9, 11])
    this.root_octave = root_octave ?? 3
  }

  note(ix: number): string {
    return Scale.CHROMATIC[this.shift + this.indices[ix]] + (this.root_octave + Math.floor(ix / 12))
  }

  notes(...indices: number[]): string[] {
    return indices.map(this.note)
  }

  set_octave(octave: number) {
    this.root_octave = octave
  }

  /** @deprecated */
  transpose(by: number) {
    this.shift = by
  }
}

export class PentatonicScale extends Scale {
  constructor(root_octave?: number) {
    super([0, 2, 4, 7, 9], root_octave)
  }
}
