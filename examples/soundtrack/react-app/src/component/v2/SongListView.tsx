import { Divider } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { SongListItemView } from "./SongListItemView";
import List from "@mui/material/List";
import React from "react";
import { Song } from "../../hooks/api";

export type SongListViewProps = {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onRemoveSong: (song: Song) => void;
  loading?: boolean;
};
export const SongListView = ({
  songs,
  onPlaySong,
  onRemoveSong,
  loading,
}: SongListViewProps) => {
  return (
    <List>
      {songs.map((song) => (
        <React.Fragment key={song.id}>
          <ListItem component="div" disablePadding>
            <ListItemButton>
              <SongListItemView
                name={song.title ?? song.name}
                artist={song.artist ?? "Unknown"}
                onPlay={() => onPlaySong(song)}
                onRemove={() => onRemoveSong(song)}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};
