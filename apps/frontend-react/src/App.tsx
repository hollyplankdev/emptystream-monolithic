import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import DeveloperPanel from "./features/developerPanel/DeveloperPanel";
import StreamImage from "./features/streamImage/StreamImage";
import { StreamTuner } from "./features/streamTuner/StreamTuner";
import { TransmissionAudio } from "./features/transmissionAudio/TransmissionAudio";
import VolumeSlider from "./features/volumeSlider/VolumeSlider";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
          <div className="App">
            <DeveloperPanel />
            <div className="AppContainer">
              <div className="CenterPanel">
                <StreamImage />
                <VolumeSlider />
                <StreamTuner index={0} />
                <StreamTuner index={1} />
                <StreamTuner index={2} />
                <StreamTuner index={3} />
                <StreamTuner index={-3} holographic />
                <TransmissionAudio index={0} />
                <TransmissionAudio index={1} />
                <TransmissionAudio index={2} />
                <TransmissionAudio index={3} />
              </div>
            </div>
          </div>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
