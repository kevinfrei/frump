import { MakeLog } from '@freik/logger';
import { onRejected } from '@freik/web-utils';
import { useAtom, useAtomValue } from 'jotai';
import { ForwardedRef, MouseEventHandler, useCallback } from 'react';
import { isMutableRefObject } from '../Tools.ts';
import './styles/PlaybackControls.css';
import { hasAnySongsState, hasNextSongState, hasPrevSongState, isPlayingState, repeatState, shuffleState } from '../Jotai/PlaybackState.ts';

const { log, wrn } = MakeLog('EMP:render:SongControls');

/*export function onClickPlayPause(
  audioRef: ForwardedRef<HTMLAudioElement>,
): void {
  if (!isMutableRefObject<HTMLAudioElement>(audioRef)) {
    wrn('Clicking but no audio element');
    return;
  }
  const store = getStore(mstore);
  store.set(playingState, (isPlaying) => {
    if (isPlaying) {
      audioRef.current.pause();
      return false;
    } else if (audioRef.current.readyState === 4) {
      audioRef.current.play().catch(onRejected('Audio Element play failed'));
      return true;
    } else {
      log(
        `We're not playing, but also not state 4: ${audioRef.current.readyState}`,
      );
    }
    return isPlaying;
  });
}
*/

export type PlaybackControlsProps = {
  audioRef: ForwardedRef<HTMLAudioElement>;
};

export function PlaybackControls({
  audioRef,
}: PlaybackControlsProps): JSX.Element {
  const isPlaying = useAtomValue(isPlayingState);

  const hasAnySong = useAtomValue(hasAnySongsState);
  const [shuf, shufSet] = useAtom(shuffleState);
  const [rep, repSet] = useAtom(repeatState);
  const hasNextSong = useAtomValue(hasNextSongState);
  const hasPrevSong = useAtomValue(hasPrevSongState);

  const shufClass = shuf ? 'enabled' : 'disabled';
  const repClass = rep ? 'enabled' : 'disabled';
  const playPauseClass = isPlaying
    ? 'playing'
    : hasAnySong
      ? 'paused'
      : 'paused disabled';
  const nextClass = hasNextSong ? 'enabled' : 'disabled';
  const prevClass = hasPrevSong ? 'enabled' : 'disabled';

  const clickShuffle = useCallback(() => shufSet(!shuf), [shuf]);
  const clickRepeat = useCallback(() => repSet(!rep), [rep]);
  const clickPlayPause = () => onClickPlayPause(audioRef);

  const clickPrev = useCallback(() => {
    if (hasPrevSong) {
      MaybePlayPrev().catch(wrn);
    }
  }, []);
  const clickNext: MouseEventHandler<HTMLSpanElement> = useCallback((ev) => {
    if (hasNextSong) {
      MaybePlayNext(ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey).catch(
        wrn,
      );
    }
  }, []);
  return (
    <span id="control-container">
      <span
        id="shuffle"
        className={shufClass}
        onClick={clickShuffle}
        title={'Shuffle'/*GetHelperText(Keys.Shuffle)*/}
      >
        &nbsp;
      </span>
      <span
        id="prev"
        className={prevClass}
        onClick={clickPrev}
        title={'Previous Track'/*GetHelperText(Keys.PreviousTrack)*/}
      >
        &nbsp;
      </span>
      <span
        id="play-pause"
        className={playPauseClass}
        onClick={clickPlayPause}
        title={'Play'/*GetHelperText(Keys.Play)*/}
      >
        &nbsp;
      </span>
      <span
        id="next"
        className={nextClass}
        onClick={clickNext}
        title={'Next Track'/*GetHelperText(Keys.NextTrack)*/}
      >
        &nbsp;
      </span>
      <span
        id="repeat"
        className={repClass}
        onClick={clickRepeat}
        title={'Repeat'/*GetHelperText(Keys.Repeat)*/}
      >
        &nbsp;
      </span>
      &nbsp;
    </span>
  );
}
