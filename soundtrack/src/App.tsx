import { MusicPlayerPage } from "./page/MusicPlayerPage";
import { StyledEngineProvider } from "@mui/material/styles";

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <MusicPlayerPage />
      </StyledEngineProvider>
    </div>
  );
}

export default App;
