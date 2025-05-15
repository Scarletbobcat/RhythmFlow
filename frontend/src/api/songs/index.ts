import api from "..";

export const getSongs = async () => {
  const { data } = await api.get("/music/songs");
  return data;
};

export const getSongByTitle = async (title: string) => {
  const { data } = await api.get(`/music/songs/title?title=${title}`);
  return data;
};

export const getSongByUser = async () => {
  const { data } = await api.get(`/music/songs/user`);
  return data;
};
