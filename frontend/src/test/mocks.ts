import type { Person, Starship } from '@/generated/graphql';

export const mockPerson: Person = {
  id: 1,
  name: 'Luke Skywalker',
  mass: 77,
  height: 172,
  hairColor: 'blond',
  skinColor: 'fair',
  eyeColor: 'blue',
  birthYear: '19BBY',
  gender: 'male',
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
};

export const mockPerson2: Person = {
  id: 2,
  name: 'Darth Vader',
  mass: 136,
  height: 202,
  hairColor: 'none',
  skinColor: 'white',
  eyeColor: 'yellow',
  birthYear: '41.9BBY',
  gender: 'male',
  created: '2014-12-10T15:18:20.704000Z',
  edited: '2014-12-20T21:17:50.313000Z',
};

export const mockStarship: Starship = {
  id: 1,
  name: 'Millennium Falcon',
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  costInCredits: 100000,
  length: 34.37,
  maxAtmospheringSpeed: 1050,
  crew: 4,
  passengers: 6,
  cargoCapacity: 100000,
  consumables: '2 months',
  hyperdriveRating: 0.5,
  MGLT: 75,
  starshipClass: 'Light freighter',
  created: '2014-12-10T16:59:45.094000Z',
  edited: '2014-12-20T21:23:49.880000Z',
};

export const mockStarship2: Starship = {
  id: 2,
  name: 'Star Destroyer',
  model: 'Imperial I-class Star Destroyer',
  manufacturer: 'Kuat Drive Yards',
  costInCredits: 150000000,
  length: 1600,
  maxAtmospheringSpeed: 975,
  crew: 47060,
  passengers: 0,
  cargoCapacity: 36000000,
  consumables: '2 years',
  hyperdriveRating: 2,
  MGLT: 60,
  starshipClass: 'Star Destroyer',
  created: '2014-12-10T15:08:19.848000Z',
  edited: '2014-12-20T21:23:49.870000Z',
};
