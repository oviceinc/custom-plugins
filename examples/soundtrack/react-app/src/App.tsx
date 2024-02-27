import { StyledEngineProvider } from "@mui/material/styles";
import { MainPage } from "./page/MainPage";
import { SoundtrackProvider } from "./context";

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <SoundtrackProvider>
          <MainPage />
        </SoundtrackProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
