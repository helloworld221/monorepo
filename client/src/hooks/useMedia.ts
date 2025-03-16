import { useCallback, useEffect, useState } from "react";
import {
  deleteUserMedia,
  fetchUserMedia,
  uploadMedia,
} from "../services/media";
import { Media } from "../types";

const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchUserMedia();
      setMedia(response.media);
      setError(null);
    } catch (error) {
      console.error("Media fetch failed:", error);
      setError("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("media", file);

      const response = await uploadMedia(formData);
      setMedia((prevMedia) => [response.media, ...prevMedia]);
      return response.media;
    } catch (error) {
      setError("Failed to upload media");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    setError(null);
    try {
      await deleteUserMedia(mediaId);
      setMedia((prevMedia) => prevMedia.filter((item) => item._id !== mediaId));
      setError(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete media";
      setError(errorMessage);
      throw error;
    }
  };

  return {
    media,
    loading,
    error,
    uploading,
    fetchMedia,
    handleUpload,
    deleteMedia,
  };
};

export default useMedia;
