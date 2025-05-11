import api from "../index";
import { User } from "@supabase/supabase-js";

export const getUserByEmail = async (email: string) => {
  const { data } = await api.get(`/users/email?email=${email}`);
  return data;
};

export const createUser = async (user: User, artistName: string) => {
  const { data } = await api.post("/users/create", {
    email: user.email,
    artistName: artistName,
    profilePictureUrl: user.user_metadata.avatar_url,
    supabaseId: user.id,
    role: "user",
  });
  return data;
};
