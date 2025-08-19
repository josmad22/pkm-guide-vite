import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { TrickItem } from "./TrickItem"

// Custom hook to handle dynamic imports
const useDynamicImports = () => {
  const getPokemonFiles = async (regionId: string, leaderId: string): Promise<string[]> => {
    try {
      // In Vite, we need to use import.meta.glob instead of require.context
      const modules = import.meta.glob('../data/**/*.json', { eager: true });
      
      // Filter the modules to get only the ones for the specified region/leader
      const pattern = `../data/${regionId}/${leaderId}/`;
      const files = Object.keys(modules)
        .filter(key => key.includes(pattern))
        .map(key => key.split('/').pop() || '');
      
      return files;
    } catch (error) {
      console.error(`Error getting files for ${regionId}/${leaderId}:`, error);
      return [];
    }
  };

  return { getPokemonFiles };
};

interface Pokemon {
  id?: string; // Optional
  name: string;
  image?: string; // Optional
  initialMove: string;
  tricks: Tricks[];
}

interface ConfigLeader {
  id: string;
  name: string;
  image?: string;
  pokemons?: Pokemon[];
}

interface Tricks{
  detail: string;
  variant: Tricks[];
}

interface Region extends ConfigLeader {
  image?: string;
  leaders: ConfigLeader[];
}

export default function PokemonGuide() {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [expandedLeader, setExpandedLeader] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [lightMode, setLightMode] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const { getPokemonFiles } = useDynamicImports();

  // Load region config when component mounts
  useEffect(() => {
    const loadRegionConfig = async () => {
      try {
        // In Vite, we need to use dynamic import
        const regionConfigModule = await import('../data/config-region.json');
        setRegions(regionConfigModule.regions || []);
      } catch (error) {
        console.error('Error loading region config:', error);
      }
    };
    
    loadRegionConfig();
  }, []);

  // Load pokemon data for leaders when regions are loaded
  useEffect(() => {
    const loadPokemonData = async () => {
      if (regions.length === 0) return;
      
      const updatedRegions = [];
      
      for (const region of regions) {
        const updatedLeaders = [];
        
        for (const leader of region.leaders) {
          try {
            const pokemonFiles = await getPokemonFiles(region.id, leader.id);
            const pokemons = [];
            
            // Import each file
            for (const file of pokemonFiles) {
              try {
                // Use dynamic import with the relative path
                const module = await import(`../data/${region.id}/${leader.id}/${file.replace('.json', '')}.json`);
                const data = module.default || module;
                pokemons.push({
                  ...data,
                  id: data.id || data.name?.toLowerCase() || file.replace('.json', ''),
                });
              } catch (error) {
                console.error(`Error importing ${file}:`, error);
              }
            }
            
            updatedLeaders.push({
              ...leader,
              pokemons,
            });
          } catch (error) {
            console.error(`Error loading pokemon data for ${leader.name}:`, error);
            updatedLeaders.push({
              ...leader,
              pokemons: [],
            });
          }
        }
        
        updatedRegions.push({
          ...region,
          leaders: updatedLeaders,
        });
      }

      setRegions(updatedRegions);
    };

    loadPokemonData();
  }, [regions.length]);

  const handleRegionClick = async (regionId: string) => {
    if (expandedRegion === regionId) {
      setExpandedRegion(null);
      setExpandedLeader(null);
      setSelectedPokemon(null);
    } else {
      setExpandedRegion(regionId);
      setExpandedLeader(null);
      setSelectedPokemon(null);
     
    }
  };

  const handleLeaderClick = (leaderId: string) => {
    if (expandedLeader === leaderId) {
      setExpandedLeader(null);
      setSelectedPokemon(null);
    } else {
      setExpandedLeader(leaderId);
      setSelectedPokemon(null);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(selectedPokemon?.name === pokemon.name ? null : pokemon)
  }

  const currentRegion = regions.find((r) => r.id === expandedRegion);
  // Find the current leader from the regions data to get the pokemons
  const currentLeader = regions
    .find((r) => r.id === expandedRegion)
    ?.leaders.find((l) => l.id === expandedLeader);
  const currentLeaderPokemons = currentLeader?.pokemons || [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        lightMode ? "bg-gray-100 text-gray-900" : "bg-[#111827] text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Farm Liga PokeMMO</h1>
          <p className="text-gray-400 mb-4">Selecciona una región para ver los líderes</p>

          {/* Tips Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <ChevronDown className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Tips</span>
          </div>
        </div>

        {/* Regions Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 ${
                expandedRegion === region.id
                  ? "ring-2 ring-blue-400 transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
              onClick={() => handleRegionClick(region.id)}
            >
              <img src={region.image || `${import.meta.env.BASE_URL}placeholder.svg`} alt="" className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{region.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaders Row */}
        {expandedRegion && currentRegion && currentRegion.leaders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-in slide-in-from-top duration-300">
            {currentRegion.leaders.map((leader) => (
              <div
                key={leader.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 ${
                  expandedLeader === leader.id
                    ? "ring-2 ring-red-400 transform scale-105"
                    : "hover:transform hover:scale-102"
                }`}
                onClick={() => handleLeaderClick(leader.id)}
              >
                <img 
                src={`${import.meta.env.BASE_URL}images/lideres/${leader.name.toLowerCase().replace(/ /g, '_')}.png`}
                alt={leader.name} className="w-24 h-24 object-contain" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{leader.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pokemon Grid */}
        {expandedLeader && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
              {currentLeaderPokemons.map((pokemon) => (
                  <div
                    key={pokemon.id || pokemon.name}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 bg-[#1e293b] border border-gray-700 ${
                      selectedPokemon?.id === pokemon.id
                        ? "ring-2 ring-blue-400 transform scale-105"
                        : "hover:transform hover:scale-102"
                    }`}
                    onClick={() => handlePokemonClick(pokemon)}
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
                ))}
            </div>
          </div>
        )}

        {/* Pokemon Details */}
        {selectedPokemon && (
          <div className="bg-[#1f2937] rounded-lg p-6 animate-in slide-in-from-bottom duration-300 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{selectedPokemon.initialMove}:</span>
            </h3>
            <div className="space-y-3">
              {selectedPokemon.tricks && selectedPokemon.tricks.length > 0 ? (
                selectedPokemon.tricks.map((trick, index) => (
                  <TrickItem key={index} trick={trick} />
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No hay estrategias disponibles para {selectedPokemon.name} aún.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Credits and Light Mode Toggle */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Credits</span>
            <ChevronDown className="w-4 h-4 text-blue-400" />
          </div>
          <button onClick={() => setLightMode(!lightMode)} className="text-gray-400 hover:text-white transition-colors">
            {lightMode ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>
    </div>
  )
}
