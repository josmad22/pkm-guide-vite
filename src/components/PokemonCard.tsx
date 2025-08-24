import type { Pokemon } from '../interfaces/Pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, isSelected, onClick }: PokemonCardProps) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 flex-shrink-0 min-w-0 ${
        isSelected
          ? "ring-2 ring-blue-400 transform scale-105"
          : "hover:transform hover:scale-102"
      }`}
      onClick={() => onClick(pokemon)}
    >
      <div className="flex items-center justify-center p-1">
        <img
          src={`${import.meta.env.BASE_URL}images/pokemon/${pokemon.name.toLowerCase().replace(/ /g, '_')}.png`}
          alt={pokemon.name}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
        <span className="text-white text-xs sm:text-sm font-medium p-1 sm:p-2 w-full text-center bg-black bg-opacity-60 truncate">
          {pokemon.name}
        </span>
      </div>
    </div>
  );
};
