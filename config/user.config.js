import { api } from "@/config/axios.config";

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
