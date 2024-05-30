import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import DeveloperPanel from "./components/DeveloperPanel";
import StreamImage from "./components/stream/StreamImage";
import { StreamTuner } from "./components/stream/StreamTuner";
import { StreamAudio } from "./components/stream/StreamAudio";
import VolumeSlider from "./components/VolumeSlider";
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
                <StreamAudio index={0} />
                <StreamAudio index={1} />
                <StreamAudio index={2} />
                <StreamAudio index={3} />
              </div>
            </div>
          </div>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
