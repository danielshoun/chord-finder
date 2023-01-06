import guitarData from './guitar.json';

interface GuitarDataMain {
  strings: number;
  fretsOnChord: number;
  name: string;
  numberOfChords: number;
}

interface GuitarDataTunings {
  standard: string[];
}

export interface PositionData {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres: number[];
  midi: number[];
}

export interface ChordData {
  key: string;
  suffix: string;
  positions: PositionData[];
}

interface GuitarDataChords {
  C: ChordData[];
  "C#": ChordData[];
  D: ChordData[];
  Eb: ChordData[];
  E: ChordData[];
  F: ChordData[];
  "F#": ChordData[];
  G: ChordData[];
  Ab: ChordData[];
  A: ChordData[];
  Bb: ChordData[];
  B: ChordData[];
}

interface GuitarData {
  main: GuitarDataMain;
  tunings: GuitarDataTunings;
  keys: string[];
  suffixes: string[];
  chords: GuitarDataChords
}

export default guitarData as unknown as GuitarData;
