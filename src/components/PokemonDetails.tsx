import type { Pokemon } from '../interfaces/Pokemon';
import { TrickItem } from './TrickItem';

interface PokemonDetailsProps {
  pokemon: Pokemon;
}

export const PokemonDetails = ({ pokemon }: PokemonDetailsProps) => {
  return (
    <div className="bg-[#1f2937] rounded-lg p-6 animate-in slide-in-from-bottom duration-300 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>{pokemon.initialMove}:</span>
      </h3>
      <div className="space-y-3">
        {pokemon.tricks && pokemon.tricks.length > 0 ? (
          pokemon.tricks.map((trick, index) => (
            <TrickItem key={index} trick={trick} />
          ))
        ) : (
          <div className="text-gray-400 text-center py-4">
            No hay estrategias disponibles para {pokemon.name} aún.
          </div>
        )}
      </div>
    </div>
  );
};
