"use client"

import { skipTime, videos } from '@/utils/constants';
import videoStore from '@/utils/zustand';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

const Player = ({ miniPlayer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [volHover, setVolHover] = useState(false);
  const [speedHover, setSpeedHover] = useState(false);
  const [mouseStill, setMouseStill] = useState(false);
  const { setCurrentVideo, nextVids, prevVids, currentVideo, fullScreen, setFullScreen, setMiniPlayer } = videoStore();
  const router = useRouter();
  const src = currentVideo;

  function onMouseStill(callback, delay = 2000) {
    let timeoutId;

    function onMouseMove() {
      setMouseStill(false)
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    }

    function onMouseLeave() {
      clearTimeout(timeoutId);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    return function cleanup() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }

  useEffect(() => {
    const stopListening = onMouseStill(() => {
      console.log("mouse sill");
      setMouseStill(true)
    }, 2000);

    return stopListening;
  }, []);

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    // setVolume(0.5)
    // setPlaybackRate(1)
  }, [src])

  function numberToString(number) {
    const hours = Math.floor(number / 3600);
    const minutes = Math.floor((number % 3600) / 60);
    const seconds = Math.floor(number % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }
  useEffect(() => {
    const player = playerRef.current;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying]);


  useEffect(() => {
    const player = playerRef.current;
    player.volume = volume;
  }, [volume]);

  useEffect(() => {
    const player = playerRef.current;
    player.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (playerRef.current && parseInt(playerRef.current.duration) === parseInt(currentTime)) {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [currentTime])  

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleTimeUpdate = () => {
    setCurrentTime(playerRef.current.currentTime);
  };

  const handleSeek = (e) => {
    playerRef.current.currentTime = parseFloat(e.target.value);

  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullScreen(false)
    } else {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    }
  }

  const handleForward = () => {
    if (!playerRef || !playerRef.current) return
    playerRef.current.currentTime = (currentTime + skipTime > playerRef.current.duration ? playerRef.current.duration : currentTime + skipTime)
  }

  const handleBackward = () => {
    if (!playerRef || !playerRef.current) return
    playerRef.current.currentTime = (currentTime - skipTime < 0 ? 0 : currentTime - skipTime)
  }

  const handleNext = () => {
    setCurrentVideo(nextVids.length > 0 ? nextVids[0] : videos[0])
  }

  const handlePrevious = () => {
    setCurrentVideo(prevVids.length > 0 ? prevVids[0] : videos[0])
  }

  const toggleMiniPlayer = () => {
    if (miniPlayer) {
      router.push("/videos/view");
      setMiniPlayer(false);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setFullScreen(false)
      }
      router.push("/videos");
      setMiniPlayer(true);
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log(document.fullscreenElement)
      setFullScreen(document.fullscreenElement);
    };

    document.onfullscreenchange = handleFullscreenChange;

    return () => {
      document.onfullscreenchange = null;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowUp':
          event.preventDefault();
          setVolume((prev) => parseFloat((prev + 0.1) > 1 ? 1 : (prev + 0.1)));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setVolume((prev) => parseFloat((prev - 0.1) < 0 ? 0 : (prev - 0.1)));
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleForward()
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleBackward()
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          setVolume(0);
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          handleFullScreen();
          break;
        case 'w':
        case 'W':
          event.preventDefault();
          toggleMiniPlayer();
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          handleNext();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          handlePrevious();
          break;
        default:
          break;
      }
    };

    if (miniPlayer) return
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentTime, volume, fullScreen]);


  return (
    <div className={`flex flex-col w-full gap-6   ${fullScreen ? " h-[100vh] bg-black justify-center items-center" : "p-6"}`}>
      <div onMouseOver={() => setHover(true)} style={{backgroundImage:"url(/images/music.jpg)", backgroundRepeat:"no-repeat", backgroundSize:"cover"}} onMouseLeave={() => setHover(false)} className={`relative w-full aspect-video ${fullScreen?"":" rounded-lg"} overflow-clip `}>
        <video controls={false} className=' w-full aspect-video ' src={src} ref={playerRef} onTimeUpdate={handleTimeUpdate} />

        <div className={`absolute top-0 left-0 p-2 z-20 w-full flex flex-row items-center justify-between ${fullScreen?"":"rounded-lg"} overflow-clip`} style={{ opacity: !mouseStill && hover ? 0.7 : 0 }}>
          <button className='opacity-60 hover:opacity-100 transition-all' onClick={toggleMiniPlayer}>
            {miniPlayer ?
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/expand--v1.png" alt="expand--v1" /> :
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="30" height="30" src="https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/50/ffffff/external-arrows-arrows-jumpicon-glyph-jumpicon-glyph-ayub-irawan-3.png" alt="external-arrows-arrows-jumpicon-glyph-jumpicon-glyph-ayub-irawan-3" />}
          </button>
          {miniPlayer ? <button className='opacity-60 hover:opacity-100 transition-all' onClick={() => setMiniPlayer(false)}>
            <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="30" height="30" src="https://img.icons8.com/ios-filled/50/ffffff/multiply.png" alt="multiply" />
          </button> : <></>}
        </div>
        <div className=' absolute top-0 right-0 bg-zinc-950  flex flex-col items-center justify-end gap-4 h-full w-full transition-all z-10' style={{ opacity: !mouseStill && hover ? 0.7 : 0 }}>

          <div className=' w-full h-full flex justify-center items-center'>
            <button className={` ${miniPlayer ? " px-2" : "py-2 px-6"} rounded-lg opacity-65 hover:opacity-100  text-xl font-semibold transition-all`} onClick={handlePrevious}>
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} className=' rotate-180' width="60" height="60" src="https://img.icons8.com/ios-glyphs/120/ffffff/end--v1.png" alt="prev" />

            </button>
            <button className={` ${miniPlayer ? " px-2" : "py-2 px-6"} rounded-lg opacity-65 hover:opacity-100  text-xl font-semibold transition-all`} onClick={handleBackward}>
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} className=' ' width="60" height="60" src="https://img.icons8.com/ios-filled/120/ffffff/rotate.png" alt="foward" />

            </button>
            <button className={` ${miniPlayer ? " px-2" : "py-2 px-6"} rounded-lg opacity-65 hover:opacity-100  text-xl font-semibold transition-all`} onClick={handlePlayPause}>
              {isPlaying ?
                <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="60" height="60" src="https://img.icons8.com/ios-glyphs/120/ffffff/pause--v1.png" alt="pause--v1" />
                :
                <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="60" height="60" src="https://img.icons8.com/ios-glyphs/120/ffffff/play--v1.png" alt="play--v1" />
              }</button>

            <button className={` ${miniPlayer ? " px-2" : "py-2 px-6"} rounded-lg opacity-65 hover:opacity-100  text-xl font-semibold transition-all`} onClick={handleForward}>
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} className=' -scale-x-100 ' width="60" height="60" src="https://img.icons8.com/ios-filled/120/ffffff/rotate.png" alt="backward" />

            </button>
            <button className={` ${miniPlayer ? " px-2" : "py-2 px-6"} rounded-lg opacity-65 hover:opacity-100  text-xl font-semibold transition-all`} onClick={handleNext}>
              <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="60" height="60" src="https://img.icons8.com/ios-glyphs/120/ffffff/end--v1.png" alt="next" />
            </button>

          </div>
          {miniPlayer ?
            (<></>)
            : <div className=' absolute bottom-0 right-0 flex flex-row w-full items-center justify-between px-6 py-3 gap-5 ' >
                <div className=' flex flex-col gap-1 w-full'>
                  <input type="range" className=' ' min={0} max={playerRef.current && playerRef.current.duration} value={currentTime} onChange={handleSeek} />
                  <div className=' flex w-full justify-between  '>
                    <h3 className=' text-xs font-light'>{numberToString(currentTime)}</h3>
                    <div className=' flex flex-row w-full justify-between items-center p-1'>
                      <div onMouseOver={() => setVolHover(true)} onMouseLeave={() => setVolHover(false)} className=' flex flex-row  items-center justify-center gap-2'>
                        <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="24" height="24" className={`text-lg font-bold ${volHover ? "" : " translate-x-full"} transition-all`} src="https://img.icons8.com/material-sharp/30/ffffff/speaker.png" alt="speaker" />
                        <div className={`flex flex-col gap-1 w-full ${volHover ? "scale-x-100" : "scale-x-0"} transition-all origin-left`}>
                          <input className={``} type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolumeChange} />
                          <div className=' flex w-full justify-between  '>
                            <h3 className=' text-xs font-light'>{Math.floor(volume * 100)}%</h3>
                            <h3 className=' text-xs font-light'>{""}</h3>
                          </div>
                        </div>
                      </div>
                      <div onMouseOver={() => setSpeedHover(true)} onMouseLeave={() => setSpeedHover(false)} className=' flex flex-row  items-center justify-center gap-2'>
                        {/* <h3 className={`text-lg font-bold ${speedHover?"":" translate-x-full"} transition-all`}>Speed</h3> */}
                        <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="24" height="24" className={`text-lg font-bold ${speedHover ? "" : " translate-x-full"} transition-all`} src="https://img.icons8.com/ios-glyphs/30/ffffff/speed.png" alt="speed" />
                        <div className={`flex flex-col gap-1 w-full ${speedHover ? "scale-x-100" : "scale-x-0"} transition-all origin-left`}>
                          <input className={` `} type="range" min={0.5} max={4} step={0.25} value={playbackRate} onChange={handlePlaybackRateChange} />
                          <div className=' flex w-full justify-between  '>
                            <h3 className=' text-xs font-light'>{parseFloat(playbackRate).toFixed(2)}x</h3>
                            <h3 className=' text-xs font-light'>{""}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className=' text-xs font-light'>{numberToString(playerRef ? playerRef.current ? playerRef.current.duration ? playerRef.current.duration : 0 : 0 : 0)}</h3>
                  </div>
                </div>
              <div className=' flex flex-row gap-2 w-fit '>
                <button onClick={handleFullScreen} >
                  <img style={{ scale: miniPlayer ? "0.5" : "1" }} width="50" height="50" src="https://img.icons8.com/ios-filled/50/ffffff/full-screen.png" alt="full-screen" />
                </button>
              </div>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Player;
