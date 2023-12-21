import { FileUploadPage } from "./page/FileUploadPage";
// import { MusicPlayerPage } from "./page/MusicPlayerPage";
import { StyledEngineProvider } from "@mui/material/styles";
import { MainPage } from "./page/MainPage";

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <MainPage />
      </StyledEngineProvider>
    </div>
  );
}

export default App;
