import api from "../index";

export const searchSongs = async (query: string) => {
  const { data } = await api.get("search/query?query=" + query);
  return data;
};
