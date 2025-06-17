import { RhythmFlowUser } from "src/types/RhythmFlowUser";
import api from "../index";
import { User } from "@supabase/supabase-js";

export const getUserByEmail = async (email: string) => {
  const { data } = await api.get(`/users/email?email=${email}`);
  return data;
};

export const createUser = async (supabaseUser: User, artistName: string) => {
  // console.log(supabaseUser.id);
  const { data } = await api.post("/users/create", {
    id: supabaseUser.id,
    email: supabaseUser.email,
    artistName: artistName,
    supabaseId: supabaseUser.id,
  });
  return data;
};

export const updateUser = async (
  user: RhythmFlowUser,
  newProfilePicture?: File
) => {
  const formData = new FormData();
  if (newProfilePicture) {
    formData.append("image", newProfilePicture);
  }
  formData.append("id", user.id);
  formData.append("artistName", user.artistName ?? "");

  // Explicitly set the correct headers and ensure axios doesn't transform the request
  const { data } = await api.post("/users/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/id?id=${id}`);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/delete?id=${id}`);
  return data;
};
