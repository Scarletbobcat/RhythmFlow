import api from "..";

export const getSongs = async () => {
  const { data } = await api.get("/music/songs");
  return data;
};
