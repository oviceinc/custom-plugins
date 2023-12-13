import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MeetingCashClock from "./MeetingCashClock";
import { Container } from "./components/Container";

function App() {
  return (
    <div className="App">
      <Container>
        <MeetingCashClock />
      </Container>
    </div>
  );
}

export default App;
