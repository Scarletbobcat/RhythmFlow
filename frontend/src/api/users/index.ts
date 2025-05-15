import api from "../index";
import { User } from "@supabase/supabase-js";

export const getUserByEmail = async (email: string) => {
  const { data } = await api.get(`/users/email?email=${email}`);
  return data;
};

export const createUser = async (supabaseUser: User, artistName: string) => {
  const { data } = await api.post("/users/create", {
    email: supabaseUser.email,
    artistName: artistName,
    profilePictureUrl: supabaseUser.user_metadata.avatar_url,
    supabaseId: supabaseUser.id,
    role: "user",
  });
  return data;
};

export const getUserBySupabaseId = async (supabaseId: string) => {
  const { data } = await api.get(`/users/supabaseId?supabaseId=${supabaseId}`);
  return data;
};

export const deleteUser = async () => {
  const { data } = await api.delete("/users/delete");
  return data;
};
