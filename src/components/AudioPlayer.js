import { useState, useRef } from "react";

function AudioPlayer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(props.audio));

  function handlePlayPauseClick() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleAudioEnded() {
    setIsPlaying(false);
    audioRef.current.currentTime = 0;
  }

  return (
    <div className="audio">
      <button onClick={handlePlayPauseClick} className="audio-button">
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <audio src={props.audio} onEnded={handleAudioEnded} ref={audioRef} />
    </div>
  );
}

export default AudioPlayer;
