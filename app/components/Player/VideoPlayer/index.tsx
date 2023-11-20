'use client'

import Icon from "@/components/Icon";
import { useDocumentSize } from "app/hooks/useDocumentSize";

import { useEffect, useRef, useState } from "react";
import { setTimeout } from "timers";

export const VideoPlayer = ({
  src,
}: {
  src: string;
}) => {
  const { isMobile } = useDocumentSize();

  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const [videoInfo, setVideoInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  const [isHovering, setHovering] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);

  const [isVolumeOpen, setVolumeOpen] = useState(false);
  const [isCursorVisible, setCursorVisible] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const { currentTime, duration } = videoRef.current;
    const progressPercentage = (currentTime / duration) * 100;

    setProgress(progressPercentage);

    setVideoInfo({
      ...videoInfo,
      currentTime,
      duration,
    });
  };

  const handleChangeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;

    const newCurrentTime = parseFloat(e.target.value) * videoInfo.duration;
    const newProgress = (newCurrentTime / videoInfo.duration) * 100;

    videoRef.current.currentTime = newCurrentTime;

    setProgress(newProgress);

    setVideoInfo({
      ...videoInfo,
      currentTime: newCurrentTime,
    });
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>, volume?: number) => {
    if (!videoRef.current) return;

    if (!volume) {
      const newVolume = parseFloat(e.target.value);

      videoRef.current.volume = newVolume;

      setVolume(newVolume);
    } else {
      videoRef.current.volume = volume;

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
    if (!videoRef.current) return;

    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

    videoRef.current.addEventListener("fullscreenchange", () => {
      setFullscreen(!isFullscreen);
    });

    return () => {
      if (!videoRef.current) return;

      videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isHovering) {
      if (isPlaying) {
        setTimeout(() => {
          setCursorVisible(false)
        }, 3000);
      } else {
        setCursorVisible(true);
      }
    }
  }, [isCursorVisible, isHovering, isPlaying]);

  useEffect(() => {
    if (!progress) return;

    if (progress === 100) {
      setProgress(0);
      setPlaying(false);
    }
  }, [progress]);

  useEffect(() => {
    if (!src) {
      throw new Error("Source is required for AudioPlayer");
    }
  }, [src]);

  return (
    <button
      onClick={() => isMobile ? handleTogglePlay() : null}
      onKeyDown={(e) => {
        if (!videoRef.current) return;

        if (e.key === "Spacebar") handleTogglePlay();

        if (e.key === "ArrowLeft") {
          videoInfo.currentTime -= 5;
        }

        if (e.key === "ArrowRight") {
          videoInfo.currentTime += 5;
        }

        if (e.key === "ArrowUp") {
          if (volume < 1) {
            setVolume(videoRef.current.volume);
          }
        }

        if (e.key === "ArrowDown") {
          if (videoRef.current.volume > 0) {
            videoRef.current.volume -= 0.1;
            setVolume(videoRef.current.volume);
          }
        }
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative block rounded-md overflow-hidden"
      style={{
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? '0' : 'auto',
        left: isFullscreen ? '0' : 'auto',
        zIndex: isFullscreen ? 9999 : 0,
        background: isFullscreen ? 'rgb(0,0,0)' : 'transparent',
      }}
    >
      <section
        className={`absolute bottom-0 flex items-center justify-center w-full h-full pointer-events-auto transition-all duration-100 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: isHovering ? 'linear-gradient(transparent, rgba(0,0,0,0.75))' : 'transparent',
        }}
      >
        <div
          className="absolute bottom-0 flex items-center justify-center w-full px-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleTogglePlay}
            className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded transition-all duration-100"
          >
            {isPlaying ? (
              <Icon
                icon="Pause"
                className="w-4 h-4 md:w-5 md:h-5"
              />
            ) : (
              <Icon
                icon="Play"
                className="w-4 h-4 md:w-5 md:h-5"
              />
            )}
          </button>

          <section
            onMouseEnter={() => setVolumeOpen(true)}
            onMouseLeave={() => setVolumeOpen(false)}
            className={`relative flex items-center justify-center w-auto rounded py-2 transition-all duration-300`}
          >
            <button
              onClick={() => {
                if (!videoRef.current) return;

                if (videoRef.current.volume > 0) {
                  videoRef.current.volume = 0;
                  setVolume(0);
                } else {
                  videoRef.current.volume = 0.5;
                  setVolume(0.5);
                }
              }}
              className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded transition-all duration-300"
            >
              {
                volume > 0 ? (
                  volume > 0.5 ? (
                    <Icon
                      icon="SpeakerSimpleHigh"
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  ) : (
                    <Icon
                      icon="SpeakerSimpleLow"
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  )
                ) : (
                  <Icon
                    icon="SpeakerSimpleNone"
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                )}
            </button>

            <div
              className={`relative flex items-center justify-start w-auto h-full`}
            >
              <div
                className={`relative flex flex-col items-center justify-center ${isVolumeOpen ? "w-16 opacity-100 pointer-events-auto select-auto mr-2" : "w-0 opacity-0 pointer-events-none select-none"} h-full rounded transition-all duration-500`}
              >
                <input
                  id="actual-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={`h-full bg-zinc-100 bg-opacity-25 rounded transition-all duration-500 cursor-pointer`}
                  style={{
                    background: `linear-gradient(to right, rgb(226, 29, 85) 0%, rgb(226, 29, 85) ${volume * 100
                      }%, rgba(255, 255, 255, .25) ${volume * 100
                      }%, rgba(255, 255, 255, .25) 100%)`,
                  }}
                />
              </div>
            </div>
          </section>

          <div
            className="flex items-center justify-center w-full md:gap-2 md:px-2"
          >
            <span
              className="w-14 text-xs md:w-10 md:text-base"
            >
              {
                videoInfo.currentTime ? (
                  formatTime(
                    videoInfo.currentTime
                  )
                ) : "0:00"
              }
            </span>

            <div
              className="relative flex items-center justify-start w-full h-4 mx-2"
            >
              <input
                id="actual-progress"
                type="range"
                min="0"
                max="1"
                step={`${1 / videoInfo.duration}`}
                value={progress ? progress / 100 : 0}
                onChange={handleChangeCurrentTime}
                className="w-40 h-2 bg-zinc-100 bg-opacity-25 rounded transition-all duration-100 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(226, 29, 85) 0%, rgb(226, 29, 85) ${progress}%, rgba(255, 255, 255, .25) ${progress}%, rgba(255, 255, 255, .25) 100%)`,
                }}
              />
            </div>

            <span
              className="w-14 text-xs md:w-10 md:text-base"
            >
              {
                videoInfo.duration ? (
                  formatTime(
                    videoInfo.duration
                  )
                ) : "0:00"
              }
            </span>
          </div>

          <button
            disabled
            className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100"
          >
            <Icon
              icon="GearSix"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          </button>

          <button
            onClick={() => {
              if (!videoRef.current) return;

              setFullscreen(!isFullscreen);
            }}
            className="flex items-center justify-center min-w-[48px] w-12 h-12 rounded transition-all duration-100"
          >
            {
              isFullscreen ? (
                <Icon
                  icon="CornersIn"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              ) : (
                <Icon
                  icon="CornersOut"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              )
            }
          </button>
        </div>
      </section>

      <video
        ref={videoRef}
        src={src}
        controls={false}
        className="rounded-md overflow-hidden aspect-video pointer-events-none select-none"
        style={{
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : 'auto',
        }}
      />
    </button>
  )
}
