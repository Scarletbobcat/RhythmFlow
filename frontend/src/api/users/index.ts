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
    profilePictureUrl: supabaseUser.user_metadata.avatar_url,
    supabaseId: supabaseUser.id,
    role: "user",
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
