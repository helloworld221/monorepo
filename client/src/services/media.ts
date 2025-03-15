import api from "./api";

export const fetchUserMedia = async () => {
  try {
    const response = await api.get("/media");
    return response.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error;
  }
};

export const uploadMedia = async (formData: FormData) => {
  try {
    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

export const deleteUserMedia = async (mediaId: string) => {
  try {
    const response = await api.post(`/media/${mediaId}/delete`);
    return response.data;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};
