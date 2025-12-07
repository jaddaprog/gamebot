# gamebot

A monorepo for gamebot applications and packages.

## Structure

This repository is organized as a monorepo using npm workspaces:

```
gamebot/
├── packages/          # Shared packages
│   ├── core/         # Core functionality
│   └── utils/        # Utility functions
├── apps/             # Applications
│   └── bot/          # Main bot application
└── package.json      # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

Install all dependencies across the monorepo:

```bash
npm install
```

### Building

Build all packages and applications:

```bash
npm run build
```

### Testing

Run tests across all workspaces:

```bash
npm run test
```

### Linting

Run linters across all workspaces:

```bash
npm run lint
```

## Packages

### @gamebot/core
Core functionality for the gamebot platform.

### @gamebot/utils
Shared utility functions used across the monorepo.

## Applications

### @gamebot/bot
The main gamebot application.

## Development

### Working with Workspaces

Run commands in a specific workspace:

```bash
npm run build --workspace=@gamebot/core
npm run test --workspace=@gamebot/utils
```

### Adding Dependencies

Add a dependency to a specific package:

```bash
npm install <package> --workspace=@gamebot/core
```

Add a workspace dependency:

```bash
npm install @gamebot/core --workspace=@gamebot/bot
```

## Contributing

Please ensure all tests pass before submitting pull requests.

## License

ISC