import { describe, expect, it } from 'vitest';

import { CharacterMap } from '../src/core/CharacterMap';

describe('CharacterMap', () => {
  it('contains letters, digits, punctuation and spinner glyphs', () => {
    const map = new CharacterMap();

    for (const character of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -/\\|.:') {
      expect(map.has(character)).toBe(true);
    }
  });

  it.each([
    ['K', ['e', 'f', 'g1', 'i', 'k']],
    ['M', ['b', 'c', 'e', 'f', 'h', 'i']],
    ['N', ['b', 'c', 'e', 'f', 'h', 'k']],
    ['R', ['a', 'b', 'e', 'f', 'g1', 'g2', 'k']],
    ['W', ['b', 'c', 'e', 'f', 'j', 'k']],
    ['X', ['h', 'i', 'j', 'k']],
    ['Y', ['h', 'i', 'm']],
    ['Z', ['a', 'd', 'i', 'j']],
  ])('uses legible diagonal geometry for %s', (character, expected) => {
    const map = new CharacterMap();

    expect([...map.segmentsFor(character)]).toEqual(expected);
  });

  it('supports registering additional characters', () => {
    const map = new CharacterMap();

    map.register('Ñ', ['a', 'b', 'c', 'e', 'f', 'h', 'k']);

    expect(map.has('ñ')).toBe(true);
    expect([...map.segmentsFor('Ñ')]).toContain('h');
  });
});
