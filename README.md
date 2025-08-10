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

### 2. Install Dependencies
```bash
# Install all dependencies (frontend, backend, and root)
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
PORT=4000
```

### 4. Database Setup

```bash
# Navigate to backend directory
cd backend

# Run database migrations
npm run db:migrate

# Seed the database with Star Wars data
npm run db:seed

# (Optional) Verify the data
npm run db:check
```

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
mutation SaveBattleResult($winner: String!, $resourceType: String!, $players: [BattlePlayerInput!]!) {
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
| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| NODE_ENV | Environment mode | development / production |
| PORT | Server port | 4000 |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:4000/graphql |

## 🛠 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both projects
- `npm test` - Run all tests
- `npm run clean` - Clean all node_modules

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Testing Strategy

- **Frontend**: Integration tests using Vitest and Testing Library (40 tests)
- **Backend**: Unit tests for resolvers using Jest (24 tests)
- **Coverage**: Backend at 80%+ function coverage, Frontend with component testing
- **GraphQL**: Schema validation and type safety through generated types
- **Philosophy**: Test user behavior, not implementation details

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
cd backend
npm run db:check
```

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

## 📄 License

MIT

## 👨‍💻 Author

Created as a technical assessment for a Full-Stack Developer position.

## 🙏 Acknowledgments

- Star Wars data inspired by [SWAPI](https://swapi.dev/)
- Built with modern web development best practices
- Testing approach influenced by Kent C. Dodds' Testing Library principles