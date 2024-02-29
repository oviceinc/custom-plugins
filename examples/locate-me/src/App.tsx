import { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import { useMessageEventListener } from "./useMessageEventListener";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export type OvicePayloadType = {
  name: string;
  id: string;
  isSelf: boolean;
  workspace_id: string;
};

type CustomPluginParticipantsEvent = {
  type: "ovice_participants";
  payload: OvicePayloadType[];
};
function App() {
  const [me, setMe] = useState<Omit<OvicePayloadType, "isSelf">>({  id: "123", name: "dude", workspace_id: "1233" });
  useMessageEventListener(
    useCallback((event) => {
      const data = event.data as CustomPluginParticipantsEvent;
      if (data.type === "ovice_participants") {
        const me = data.payload.find((p) => p.isSelf);
        if (me) {
          setMe({ id: me.id, workspace_id: me.workspace_id, name: me.name });
        }
      }
    }, [])
  );
  return (
    <div className="App">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "10px",
        }}
      >
        {me ? (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={JSON.stringify(me)}
            viewBox={`0 0 256 256`}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </div>
  );
}

export default App;
