import type { VfdColor } from './VfdColor';

import { CharacterMap } from './CharacterMap';
import { SEGMENTS, type SegmentName } from './Segments';

export class SegmentCell {
  private readonly characterMap: CharacterMap;
  private activeSegments = new Set<SegmentName>();

  public readonly element: HTMLElement;
  public readonly segments: ReadonlyMap<SegmentName, HTMLElement>;

  public constructor(characterMap: CharacterMap = new CharacterMap()) {
    this.characterMap = characterMap;
    this.element = document.createElement('span');
    this.element.className = 'vfd-character';
    this.element.dataset.illuminated = 'false';
    this.element.setAttribute('aria-hidden', 'true');

    const segments = new Map<SegmentName, HTMLElement>();
    for (const name of SEGMENTS) {
      const segment = document.createElement('i');
      segment.className = `vfd-segment vfd-segment--${name}`;
      segment.dataset.segment = name;
      segment.dataset.active = 'false';
      this.element.append(segment);
      segments.set(name, segment);
    }
    this.segments = segments;
  }

  public setCharacter(character: string): void {
    this.setSegments(this.characterMap.segmentsFor(character));
  }

  public setSegments(activeSegments: Iterable<SegmentName>): void {
    const nextSegments = new Set(activeSegments);
    const wasIlluminated = this.activeSegments.size > 0;
    const isIlluminated = nextSegments.size > 0;

    for (const name of SEGMENTS) {
      const wasActive = this.activeSegments.has(name);
      const isActive = nextSegments.has(name);

      if (wasActive !== isActive) {
        this.segments.get(name)?.setAttribute('data-active', String(isActive));
      }
    }

    if (wasIlluminated !== isIlluminated) {
      this.element.dataset.illuminated = String(isIlluminated);
    }

    this.activeSegments = nextSegments;
  }

  public clear(): void {
    this.setSegments([]);
  }

  public test(): void {
    this.setSegments(SEGMENTS);
  }

  public setColor(color: VfdColor): void {
    this.element.dataset.color = color;
  }
}
