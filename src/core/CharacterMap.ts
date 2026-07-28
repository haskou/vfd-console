import type { CharacterDefinitions } from './CharacterDefinitions';

import { SEGMENTS, type SegmentName } from './Segments';

const CHARACTER_DEFINITIONS: CharacterDefinitions = {
  ' ': [],
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'd', 'e', 'g1', 'g2'],
  '3': ['a', 'b', 'c', 'd', 'g1', 'g2'],
  '4': ['b', 'c', 'f', 'g1', 'g2'],
  '5': ['a', 'c', 'd', 'f', 'g1', 'g2'],
  '6': ['a', 'c', 'd', 'e', 'f', 'g1', 'g2'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g1', 'g2'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g1', 'g2'],
  '-': ['g1', 'g2'],
  '.': ['m'],
  '/': ['i', 'j'],
  ':': ['l', 'm'],
  '\\': ['h', 'k'],
  A: ['a', 'b', 'c', 'e', 'f', 'g1', 'g2'],
  B: ['a', 'b', 'c', 'd', 'g2', 'l', 'm'],
  C: ['a', 'd', 'e', 'f'],
  D: ['a', 'b', 'c', 'd', 'l', 'm'],
  E: ['a', 'd', 'e', 'f', 'g1', 'g2'],
  F: ['a', 'e', 'f', 'g1', 'g2'],
  G: ['a', 'c', 'd', 'e', 'f', 'g2'],
  H: ['b', 'c', 'e', 'f', 'g1', 'g2'],
  I: ['a', 'd', 'l', 'm'],
  J: ['b', 'c', 'd', 'e'],
  K: ['e', 'f', 'g1', 'i', 'k'],
  L: ['d', 'e', 'f'],
  M: ['b', 'c', 'e', 'f', 'h', 'i'],
  N: ['b', 'c', 'e', 'f', 'h', 'k'],
  O: ['a', 'b', 'c', 'd', 'e', 'f'],
  P: ['a', 'b', 'e', 'f', 'g1', 'g2'],
  Q: ['a', 'b', 'c', 'd', 'e', 'f', 'k'],
  R: ['a', 'b', 'e', 'f', 'g1', 'g2', 'k'],
  S: ['a', 'c', 'd', 'f', 'g1', 'g2'],
  T: ['a', 'l', 'm'],
  U: ['b', 'c', 'd', 'e', 'f'],
  V: ['e', 'f', 'i', 'j'],
  W: ['b', 'c', 'e', 'f', 'j', 'k'],
  X: ['h', 'i', 'j', 'k'],
  Y: ['h', 'i', 'm'],
  Z: ['a', 'd', 'i', 'j'],
  '|': ['l', 'm'],
};

function normalizeCharacter(character: string): string {
  return [...character.toUpperCase()][0] ?? ' ';
}

export class CharacterMap {
  private readonly definitions: Map<string, ReadonlySet<SegmentName>>;

  public constructor(
    definitions: CharacterDefinitions = CHARACTER_DEFINITIONS,
  ) {
    this.definitions = new Map(
      Object.entries(definitions).map(([character, segments]) => [
        normalizeCharacter(character),
        new Set(segments),
      ]),
    );
  }

  public register(character: string, segments: Iterable<SegmentName>): void {
    const normalized = normalizeCharacter(character);
    const segmentSet = new Set(segments);

    for (const segment of segmentSet) {
      if (!SEGMENTS.includes(segment)) {
        throw new RangeError(`Unknown segment: ${segment}`);
      }
    }

    this.definitions.set(normalized, segmentSet);
  }

  public segmentsFor(character: string): ReadonlySet<SegmentName> {
    return this.definitions.get(normalizeCharacter(character)) ?? new Set();
  }

  public has(character: string): boolean {
    return this.definitions.has(normalizeCharacter(character));
  }
}
