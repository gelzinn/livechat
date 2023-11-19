
'use client';

import { useEffect, useRef, useState } from "react";

import Icon from "@/components/Icon";

import "./styles.css";

export const AudioPlayer = ({
  src,
}: {
  src: string;
}) => {
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const [audioInfo, setAudioInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  const [isVolumeOpen, setVolumeOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const { currentTime, duration } = audioRef.current;
    const progressPercentage = (currentTime / duration) * 100;

    setProgress(progressPercentage);

    setAudioInfo({
      ...audioInfo,
      currentTime,
      duration,
    });
  };

  const handleChangeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newCurrentTime = parseFloat(e.target.value) * audioInfo.duration;
    const newProgress = (newCurrentTime / audioInfo.duration) * 100;

    audioRef.current.currentTime = newCurrentTime;

    setProgress(newProgress);

    setAudioInfo({
      ...audioInfo,
      currentTime: newCurrentTime,
    });
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>, volume?: number) => {
    if (!audioRef.current) return;

    if (!volume) {
      const newVolume = parseFloat(e.target.value);

      audioRef.current.volume = newVolume;

      setVolume(newVolume);
    } else {
      audioRef.current.volume = volume;

      setVolume(volume);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const formattedTime = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    return formattedTime;
  };

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (!audioRef.current) return;

      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (!progress) return;

    if (progress === 100) {
      setProgress(0);
      setPlaying(false);
    }
  }, [progress]);

  return (
    <div
      className="flex items-center justify-center w-full h-auto rounded-md bg-zinc-100 bg-opacity-10"
    >
      <audio
        ref={audioRef}
        src={src}
        className="hidden"
      />

      <button
        onClick={handleTogglePlay}
        className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded transition-all duration-100"
      >
        {isPlaying ? (
          <Icon
            icon="Pause"
            className="w-5 h-5"
          />
        ) : (
          <Icon
            icon="Play"
            className="w-5 h-5"
          />
        )}
      </button>

      <div
        className="flex items-center justify-center w-auto gap-2 px-2"
      >
        <span>
          {
            audioInfo.currentTime ? (
              formatTime(
                audioInfo.currentTime
              )
            ) : "0:00"
          }
        </span>

        <div
          className="relative flex items-center justify-start w-40 h-4 mx-2"
        >
          <input
            id="actual-progress"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress ? progress / 100 : 0}
            onChange={handleChangeCurrentTime}
            className="w-40 h-2 bg-zinc-100 bg-opacity-25 rounded transition-all duration-100 cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(226, 29, 85) 0%, rgb(226, 29, 85) ${progress}%, rgba(255, 255, 255, .25) ${progress}%, rgba(255, 255, 255, .25) 100%)`,
            }}
          />
        </div>

        <span>
          {
            audioInfo.duration ? (
              formatTime(
                audioInfo.duration
              )
            ) : "0:00"
          }
        </span>
      </div>

      <section
        onMouseEnter={() => setVolumeOpen(true)}
        onMouseLeave={() => setVolumeOpen(false)}
        className="relative flex items-center justify-center w-auto rounded transition-all duration-300"
      >
        <button
          onClick={() => {
            if (!audioRef.current) return;

            audioRef.current.volume = 0;

            setVolume(0);
          }}
          className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded transition-all duration-300"
        >
          {
            volume > 0 ? (
              volume > 0.5 ? (
                <Icon
                  icon="SpeakerSimpleHigh"
                  className="w-5 h-5"
                />
              ) : (
                <Icon
                  icon="SpeakerSimpleLow"
                  className="w-5 h-5"
                />
              )
            ) : (
              <Icon
                icon="SpeakerSimpleNone"
                className="w-5 h-5"
              />
            )}
        </button>

        <div
          className={`relative flex items-center justify-start ${isVolumeOpen ? "w-10 opacity-100 pointer-events-auto select-auto mr-4" : "w-0 opacity-0 pointer-events-none select-none"} h-4 rounded transition-all duration-500`}
        >
          <input
            id="actual-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={`w-auto h-2 bg-zinc-100 bg-opacity-25 rounded transition-all duration-500 cursor-pointer`}
            style={{
              background: `linear-gradient(to right, rgb(226, 29, 85) 0%, rgb(226, 29, 85) ${volume * 100
                }%, rgba(255, 255, 255, .25) ${volume * 100
                }%, rgba(255, 255, 255, .25) 100%)`,
              width: isVolumeOpen ? "100%" : "0%",
            }}
          />
        </div>
      </section>
    </div >
  );
}
