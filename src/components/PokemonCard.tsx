import type { Pokemon } from '../interfaces/Pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, isSelected, onClick }: PokemonCardProps) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 ${
        isSelected
          ? "ring-2 ring-blue-400 transform scale-105"
          : "hover:transform hover:scale-102"
      }`}
      onClick={() => onClick(pokemon)}
    >
      <div className="flex items-center justify-center">
        <img
          src={`${import.meta.env.BASE_URL}images/pokemon/${pokemon.name.toLowerCase().replace(/ /g, '_')}.png`}
          alt={pokemon.name}
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
        <span className="text-white text-sm font-medium p-2 w-full text-center bg-black bg-opacity-60">
          {pokemon.name}
        </span>
      </div>
    </div>
  );
};
