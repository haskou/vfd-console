const MAXIMUM_PLAYBACK_SECONDS = 99 * 60 + 59;

function boundPlaybackSeconds(seconds: number): number {
  return Math.min(MAXIMUM_PLAYBACK_SECONDS, Math.max(0, Math.floor(seconds)));
}

export function formatPlaybackTime(seconds: number): string {
  const boundedSeconds = boundPlaybackSeconds(seconds);
  const minutes = Math.floor(boundedSeconds / 60);
  const remainder = boundedSeconds % 60;

  return `${String(minutes).padStart(2, '0')}.${String(remainder).padStart(2, '0')}`;
}

export function describePlaybackTime(seconds: number): string {
  const boundedSeconds = boundPlaybackSeconds(seconds);
  const minutes = Math.floor(boundedSeconds / 60);
  const remainder = boundedSeconds % 60;
  const minuteUnit = minutes === 1 ? 'minute' : 'minutes';
  const secondUnit = remainder === 1 ? 'second' : 'seconds';

  return `${minutes} ${minuteUnit} ${remainder} ${secondUnit}`;
}
