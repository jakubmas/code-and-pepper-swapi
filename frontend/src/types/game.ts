import type { Person, Starship } from './graphql';

export type ResourceType = 'people' | 'starships';
export type GameState = 'idle' | 'loading' | 'playing' | 'showingWinner';
export type Winner = 'left' | 'right' | 'tie' | null;

export interface GameCard {
  data: Person | Starship | null;
  isLoading: boolean;
  error: Error | null;
}

export interface GameScore {
  left: number;
  right: number;
}

export interface GameContextType {
  // State
  resourceType: ResourceType;
  gameState: GameState;
  scores: GameScore;
  leftCard: GameCard;
  rightCard: GameCard;
  currentWinner: Winner;
  
  // Actions
  setResourceType: (type: ResourceType) => void;
  playGame: () => void;
  playAgain: () => void;
  startOver: () => void;
}