export interface Person {
  id: string;
  name: string;
  height: number | null;
  mass: number;
  hairColor: string | null;
  skinColor: string | null;
  eyeColor: string | null;
  birthYear: string | null;
  gender: string | null;
  created: string;
  edited: string;
}

export interface Starship {
  id: string;
  name: string;
  model: string | null;
  manufacturer: string | null;
  costInCredits: number | null;
  length: number | null;
  maxAtmospheringSpeed: number | null;
  crew: number;
  passengers: number | null;
  cargoCapacity: number | null;
  consumables: string | null;
  hyperdriveRating: number | null;
  MGLT: number | null;
  starshipClass: string | null;
  created: string;
  edited: string;
}

export interface GetRandomPersonResponse {
  getRandomPerson: Person;
}

export interface GetRandomStarshipResponse {
  getRandomStarship: Starship;
}