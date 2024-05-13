import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
type ProgressInfo = {
  progress: number;
  kbUploaded: number;
  kbTotal: number;
};

type UploadSongResponse = {
  message: string;
  data: {
    fileId: string;
    fileName: string;
    objectId: number;
    fileUrl: string;
  };
};
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Authorization"] = "Bearer ovice";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export const useUploadSong = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>({
    progress: 0,
    kbUploaded: 0,
    kbTotal: 0,
  });
  const controllerRef = useRef(new AbortController());

  const mutate = (file: File, objectId: string) => {
    return new Promise<UploadSongResponse>(async (resolve, reject) => {
      setLoading(true);
      const config: AxiosRequestConfig<FormData> = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const bytesUploaded = progressEvent.loaded;
          const totalBytes = Number(progressEvent.total);
          const progress = Math.round(
            (bytesUploaded * 100) / Number(totalBytes)
          );

          const kbUploaded = Math.round(bytesUploaded / 1024);
          const kbTotal = Math.round(totalBytes / 1024);

          console.log(`Upload Progress: ${progress}%`);
          console.log(`Uploaded: ${kbUploaded} KB`);
          console.log(`Total: ${kbTotal} KB`);

          setProgressInfo({
            progress,
            kbUploaded,
            kbTotal,
          });
        },
        signal: controllerRef.current.signal,
      };

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("objectId", objectId);
        const response: AxiosResponse = await axios.post(
          "/api/v1/songs/upload",
          formData,
          config
        );
        resolve(response.data);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
        // reset abort controller
        if (controllerRef.current.signal.aborted) {
          controllerRef.current = new AbortController();
        }
      }
    });
  };

  const cancelRequest = useCallback(() => {
    controllerRef.current.abort();
  }, []);

  return { mutate, loading, progressInfo, cancelRequest };
};

type DeleteSongResponse = {
  message: string;
};

export const useDeleteSong = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteSong = useCallback(
    async (objectId: string, id: string, name: string) => {
      return new Promise(async (resolve, reject) => {
        setLoading(true);
        try {
          const response: AxiosResponse<DeleteSongResponse> =
            await axios.delete(`/api/v1/songs/${objectId}/${id}/${name}`);
          setLoading(false);
          resolve(response.data);
        } catch (error) {
          setLoading(false);
          reject(error);
        }
      });
    },
    []
  );

  return { deleteSong, loading };
};

export type Song = {
  id: string;
  name: string;
  url: string;
  title?: string;
  artist?: string;
  image?: string | { data: number[]; type: string };
};

export const useGetSongs = (objectId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ songs: Song[] }>();
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!objectId || mountedRef.current) return;
    mountedRef.current = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<{ songs: Song[] }> = await axios.get(
          `/api/v1/songs/${objectId}`
        );

        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching songs.");
        setLoading(false);
      }
    };

    fetchData();
  }, [objectId]);

  return { loading, data, error };
};
