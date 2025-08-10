# Star Wars Battle Game

A full-stack application that lets players battle Star Wars characters and starships based on their attributes. Built with React, TypeScript, GraphQL, and PostgreSQL.

## 🎮 Live Demo

- Frontend: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql

## 🚀 Features

- **Random Battles**: Face off random Star Wars characters (by mass) or starships (by crew size)
- **Persistent Score Tracking**: Database-backed statistics with real-time updates
- **Battle History**: View paginated history of all battles with filtering options
- **Resource Switching**: Toggle between People and Starships battles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant winner determination with visual feedback
- **Code Splitting**: Lazy-loaded components for optimal performance
- **Type Safety**: Generated GraphQL types for end-to-end type safety
- **Error Handling**: Graceful error states and loading indicators

## 🛠 Tech Stack

### Frontend

- **React 19** with TypeScript
- **Material-UI (MUI)** for component library
- **TanStack Query** for data fetching and caching
- **GraphQL Request** for API communication
- **React Router** for navigation
- **GraphQL Code Generator** for type-safe API integration
- **Vite** for build tooling
- **Vitest** for testing

### Backend

- **Node.js** with TypeScript
- **Apollo Server** for GraphQL API
- **Drizzle ORM** for database management
- **PostgreSQL** (AWS RDS) for data storage
- **Jest** for testing

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (AWS RDS or local)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone [repository-url]
cd star-wars-battle
```

### 2. Environment Setup

Create a `.env.local` file in the backend directory:

```bash
# Create env file
cat > backend/.env.local << 'EOF'
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
EOF
```

### 3. Quick Setup (Recommended)

Run the setup script to install all dependencies:

```bash
npm run setup
```

This will install dependencies for the root project, backend, and frontend.

**Note:** The database is already configured on AWS RDS with all tables and data. You don't need to run migrations or seed data.

## 🏃‍♂️ Running the Application

### Development Mode

From the project root:

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or run them separately:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### ⚠️ Common Issues When Starting

#### Database Connection Blocked
If the backend shows connection errors, your network might be blocking port 5432. See the [Troubleshooting](#-troubleshooting) section for solutions, especially if you're on a corporate network.

#### Ports Already in Use
If you get "port already in use" errors:
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production servers
npm run start
```

## 🧪 Testing

### Run All Tests

```bash
# From root - runs all tests
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test          # Watch mode
npm run test:run  # Single run
npm run test:coverage  # With coverage report
```

## 📡 API Documentation

### GraphQL Endpoint

- URL: `http://localhost:4000/graphql`
- GraphQL Playground available in development mode

### Available Queries

#### Get Random Person

```graphql
query GetRandomPerson {
  getRandomPerson {
    id
    name
    mass
    height
    hairColor
    skinColor
    eyeColor
    birthYear
    gender
  }
}
```

#### Get Random Starship

```graphql
query GetRandomStarship {
  getRandomStarship {
    id
    name
    model
    manufacturer
    costInCredits
    length
    maxAtmospheringSpeed
    crew
    passengers
    cargoCapacity
    consumables
    hyperdriveRating
    MGLT
    starshipClass
  }
}
```

#### Get Battle History

```graphql
query GetBattleHistory($page: Int, $limit: Int, $resourceType: String, $winner: String) {
  getBattleHistory(page: $page, limit: $limit, resourceType: $resourceType, winner: $winner) {
    items {
      id
      winner
      resourceType
      players {
        id
        name
        value
      }
      createdAt
    }
    pageInfo {
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
}
```

#### Get Battle Statistics

```graphql
query GetBattleStatistics {
  getBattleStatistics {
    playerWins
    computerWins
  }
}
```

### Available Mutations

#### Save Battle Result

```graphql
mutation SaveBattleResult(
  $winner: String!
  $resourceType: String!
  $players: [BattlePlayerInput!]!
) {
  saveBattleResult(winner: $winner, resourceType: $resourceType, players: $players) {
    success
    message
  }
}
```

## 📁 Project Structure

```
star-wars-battle/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── layout/    # Layout components (Navbar)
│   │   │   └── BattleCard.tsx  # Reusable battle card component
│   │   ├── hooks/         # Custom React hooks
│   │   ├── graphql/       # GraphQL queries
│   │   ├── generated/     # Auto-generated GraphQL types
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   ├── theme/         # MUI theme configuration
│   │   └── test/          # Test utilities and mocks
│   ├── public/            # Static assets
│   ├── codegen.yml        # GraphQL Code Generator config
│   └── dist/              # Production build
│
├── backend/                # Node.js GraphQL server
│   ├── src/
│   │   ├── resolvers/     # GraphQL resolvers
│   │   ├── schema/        # Database & GraphQL schemas
│   │   ├── config/        # Database configuration
│   │   ├── data/          # Seed data
│   │   └── scripts/       # Database scripts
│   ├── drizzle/           # Database migrations
│   └── dist/              # Production build
│
└── docs/                   # Documentation
    └── task.txt           # Original requirements

```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend Deployment (Heroku/AWS)

```bash
cd backend
npm run build
# Deploy with Node.js buildpack
```

### Database (AWS RDS)

- Already configured if using the provided RDS instance
- Ensure security groups allow connections from your deployment environment

## 🔐 Environment Variables

### Backend

| Variable     | Description                  | Example                             |
| ------------ | ---------------------------- | ----------------------------------- |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| NODE_ENV     | Environment mode             | development / production            |
| PORT         | Server port                  | 4000                                |

### Frontend

| Variable     | Description     | Example                       |
| ------------ | --------------- | ----------------------------- |
| VITE_API_URL | Backend API URL | http://localhost:4000/graphql |

## 🛠 Available Scripts

### Root Level

- `npm run setup` - Install all dependencies (root, backend, frontend)
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both projects
- `npm test` - Run all tests
- `npm run lint` - Run ESLint on all TypeScript files
- `npm run format` - Format all files with Prettier
- `npm run clean` - Clean all node_modules and build folders

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run codegen` - Generate GraphQL types
- `npm test` - Run tests in watch mode

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm test` - Run Jest tests
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:check` - Verify database data

## 📝 Testing Strategy

- **Frontend**: Integration tests using Vitest and Testing Library (40 tests)
- **Backend**: Unit tests for resolvers using Jest (24 tests)
- **Coverage**: Backend at 80%+ function coverage, Frontend with component testing
- **GraphQL**: Schema validation and type safety through generated types
- **Philosophy**: Test user behavior, not implementation details

## 🐛 Troubleshooting

### Database Connection Issues

#### Corporate Network / Firewall Blocking Port 5432

If you cannot connect to the database from a corporate or restricted network:

1. **Test connectivity to the database:**

```bash
nc -zv starwars-battle-db.chu84e02csne.eu-central-1.rds.amazonaws.com 5432
```

If this hangs or fails, port 5432 is blocked by your network.

2. **Common solutions:**
   - Try using a mobile hotspot (usually works)
   - Connect through a different network
   - Use a VPN that allows port 5432
   - Contact your IT department to whitelist port 5432

3. **Alternative for demos:**
   - Ask for access to an alternative database
   - Use a local PostgreSQL instance with Docker:
   ```bash
   docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
   ```

#### Database Tables Missing

If you get errors about missing tables:

```bash
cd backend
# Run migrations to create tables
npm run db:migrate
# Seed initial data
npm run db:seed
```

#### Connection Pool Exhaustion

If connections are timing out but the database is reachable:

- Check if multiple instances are running
- Restart the backend to reset connections
- Verify no one else is using too many connections

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9
```

### Clear Cache and Reinstall

```bash
npm run clean
npm install
```

### Node Version Issues

Ensure you're using Node.js 18 or higher:

```bash
node --version  # Should be v18.x.x or higher
```

### TypeScript Build Errors

```bash
# Clear TypeScript cache
rm -rf backend/dist frontend/dist
# Rebuild
npm run build
```
