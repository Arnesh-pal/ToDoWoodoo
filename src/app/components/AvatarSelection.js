import Image from "next/image";

// Programmatically generate the list of avatar paths for easier maintenance.
const totalAvatars = 11;
const avatarList = Array.from(
  { length: totalAvatars },
  (_, i) => `/avatars/avatar${i + 1}.png`
);

export default function AvatarSelection({ onAvatarSelect }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
      {avatarList.map((avatar, index) => (
        <button
          key={index}
          onClick={() => onAvatarSelect(avatar)}
          className="relative aspect-square rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary"
          aria-label={`Select Avatar ${index + 1}`}
        >
          <Image
            src={avatar}
            alt={`Avatar ${index + 1}`}
            fill
            sizes="(max-width: 640px) 25vw, 15vw"
            className="cursor-pointer rounded-full object-cover hover:ring-2 hover:ring-primary"
          />
        </button>
      ))}
    </div>
  );
}