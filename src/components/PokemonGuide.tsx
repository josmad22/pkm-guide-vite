import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// Import interfaces
import type { Pokemon } from "../interfaces/Pokemon"
import type { Region } from "../interfaces/Region"

// Import hooks
import { useDynamicImports } from "../hooks/useDynamicImports"

// Import components
import { RegionCard } from "./RegionCard"
import { LeaderCard } from "./LeaderCard"
import { PokemonCard } from "./PokemonCard"
import { PokemonDetails } from "./PokemonDetails"

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
            <RegionCard 
              key={region.id}
              region={region}
              isExpanded={expandedRegion === region.id}
              onClick={handleRegionClick}
            />
          ))}
        </div>

        {/* Leaders Row */}
        {expandedRegion && currentRegion && currentRegion.leaders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-in slide-in-from-top duration-300">
            {currentRegion.leaders.map((leader) => (
              <LeaderCard 
                key={leader.id}
                leader={leader}
                isExpanded={expandedLeader === leader.id}
                onClick={handleLeaderClick}
              />
            ))}
          </div>
        )}

        {/* Pokemon Grid */}
        {expandedLeader && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
              {currentLeaderPokemons.map((pokemon) => (
                <PokemonCard 
                  key={pokemon.id || pokemon.name}
                  pokemon={pokemon}
                  isSelected={selectedPokemon?.id === pokemon.id}
                  onClick={handlePokemonClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pokemon Details */}
        {selectedPokemon && (
          <PokemonDetails pokemon={selectedPokemon} />
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
