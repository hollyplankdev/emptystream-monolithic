import "./App.css";
import { TransmissionAudio } from "./features/transmissionAudio/TransmissionAudio";
import { StreamImage } from "./features/streamImage/StreamImage";
import { StreamTuner } from "./features/streamTuner/StreamTuner";
import { VolumeSlider } from "./features/volumeSlider/VolumeSlider";

const App = () => {
  return (
    <div className="App">
      <div className="AppContainer">
        <div className="CenterPanel">
          <StreamImage />
          <VolumeSlider />
          <StreamTuner index={0} />
          <StreamTuner index={1} />
          <StreamTuner index={2} />
          <StreamTuner index={3} />
          <StreamTuner holographic />
          <TransmissionAudio index={0} />
          <TransmissionAudio index={1} />
          <TransmissionAudio index={2} />
          <TransmissionAudio index={3} />
        </div>
      </div>
    </div>
  );
};

export default App;
