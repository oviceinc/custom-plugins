import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMemo } from "react";

type CostProps = {
  isCostEditing: boolean;
  newCostPerHour: number;
  costPerHour: number;
  setNewCostPerHour: (newCostPerHour: number) => void;
  editCost: () => void;
  saveCost: () => void;
  canEdit?: boolean;
};
export const Cost = ({
  newCostPerHour,
  costPerHour,
  setNewCostPerHour,
  editCost,
  isCostEditing,
  saveCost,
  canEdit,
}: CostProps) => {
  const costPerHourView = useMemo(() => {
    if (!isCostEditing) {
      return (
        <Typography
          variant="h5"
          fontWeight={"600"}
          color={"#199999"}
        >{`$${costPerHour}`}</Typography>
      );
    }
    if (canEdit) {
      return (
        <TextField
          label="Amount"
          type="number"
          value={newCostPerHour}
          size="small"
          onChange={(e) => setNewCostPerHour(Number(e.target.value))}
        />
      );
    }
  }, [canEdit, costPerHour, isCostEditing, newCostPerHour, setNewCostPerHour]);
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={1}
    >
      <Typography variant="h5" fontWeight={"600"}>
        {"Cost Per Hour : ".toUpperCase()}
      </Typography>
      {costPerHourView}
      {canEdit && isCostEditing && (
        <Button
          variant="text"
          color="success"
          onClick={saveCost}
          disableElevation
        >
          Save
        </Button>
      )}
      {canEdit && !isCostEditing && (
        <Button variant="text" onClick={editCost} disableElevation>
          Edit
        </Button>
      )}
    </Stack>
  );
};
