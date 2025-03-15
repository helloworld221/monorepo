import api from "./api";

export const checkCurrentUser = async () => {
  const response = await api.get("/auth/current-user");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};
