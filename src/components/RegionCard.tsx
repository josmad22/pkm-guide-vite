import type { Region } from '../interfaces/Region';

interface RegionCardProps {
  region: Region;
  isExpanded: boolean;
  onClick: (regionId: string) => void;
}

export const RegionCard = ({ region, isExpanded, onClick }: RegionCardProps) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 ${
        isExpanded
          ? "ring-2 ring-blue-400 transform scale-105"
          : "hover:transform hover:scale-102"
      }`}
      onClick={() => onClick(region.id)}
    >
      <img 
        src={region.image || `${import.meta.env.BASE_URL}placeholder.svg`} 
        alt="" 
        className="w-full h-24 object-cover" 
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{region.name}</span>
      </div>
    </div>
  );
};
