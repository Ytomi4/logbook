interface UserInfoProps {
  name?: string;
  avatarUrl?: string;
}

export function UserInfo({ name = 'ゲスト', avatarUrl }: UserInfoProps) {
  const initial = name.charAt(0) || 'ゲ';

  return (
    <div className="flex items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 font-medium">
          {initial}
        </div>
      )}
      <span className="text-sm text-gray-500">{name}</span>
    </div>
  );
}
