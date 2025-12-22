interface UserProfileHeaderProps {
  username: string;
  avatarUrl?: string;
}

export function UserProfileHeader({
  username,
  avatarUrl,
}: UserProfileHeaderProps) {
  const initial = username.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username}
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-500 font-medium">
          {initial}
        </div>
      )}
      <span className="text-lg font-medium text-gray-900">@{username}</span>
    </div>
  );
}
