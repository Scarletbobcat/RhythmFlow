import { useAuth } from "src/providers/AuthProvider";

function ProfileInfo() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4 pb-6">
      <img
        src={
          user?.profilePictureUrl ??
          "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/user.png"
        }
        alt="Profile"
        className="rounded-full size-24 bg-neutral-800 p-2 transition"
      />
      <p className="text-3xl font-bold">{user?.artistName}</p>
    </div>
  );
}
export default ProfileInfo;
