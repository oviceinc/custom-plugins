import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MeetingCashClock from "./page/MeetingCashClock";
import { Container } from "./components/Container";
import { MeetingContextProvider } from "./context/MeetingContext";

function App() {
  return (
    <div className="App">
      <MeetingContextProvider>
        <Container>
          <MeetingCashClock />
        </Container>
      </MeetingContextProvider>
    </div>
  );
}

export default App;
