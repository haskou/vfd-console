import type { SegmentName } from './Segments';

export type CharacterDefinitions = Readonly<
  Record<string, readonly SegmentName[]>
>;
