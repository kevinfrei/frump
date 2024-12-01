import { useRef, useState } from "react";
import { PlaybackControls } from "./PlaybackControls";

import "./styles/App.css";

export function App() {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className="container">
      <PlaybackControls audioRef={audioRef} />
    </div>
  );
}
