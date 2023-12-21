import { Divider } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { SongListItemView } from "./SongListItemView";

const renderRow = (props: ListChildComponentProps) => {
  const { index, data, } = props;

  return (
    <>
      <ListItem key={index} component="div" disablePadding>
        <ListItemButton>
          <SongListItemView name="Let go" artist="Hani barkallah" onPlay={console.log} onRemove={console.log} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};
type SongListViewProps = {
  items: string[];
};
export const SongListView = ({ items }: SongListViewProps) => {
  return (
    <FixedSizeList
      height={300}
      width={"100%"}
      itemCount={items.length}
      itemData={items}
      itemSize={35}
    >
      {renderRow}
    </FixedSizeList>
  );
};
