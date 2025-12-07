# Contributing to Gamebot

Thank you for your interest in contributing to Gamebot!

## Monorepo Structure

This project uses npm workspaces to manage multiple packages and applications in a single repository.

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/gamebot.git
   cd gamebot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Edit files in the appropriate package or app directory
   - Follow the existing code style
   - Add tests if applicable

5. **Build and Test**
   ```bash
   npm run build
   npm run test
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

7. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Adding a New Package

To add a new package to the monorepo:

1. Create a new directory under `packages/`:
   ```bash
   mkdir packages/new-package
   ```

2. Create a `package.json`:
   ```json
   {
     "name": "@gamebot/new-package",
     "version": "1.0.0",
     "main": "dist/index.js"
   }
   ```

3. Add source files in `packages/new-package/src/`

4. The root `package.json` will automatically detect it via the `packages/*` workspace pattern

## Adding a New App

To add a new application:

1. Create a new directory under `apps/`:
   ```bash
   mkdir apps/new-app
   ```

2. Follow the same structure as existing apps

## Code Style

- Use TypeScript for all new code
- Follow existing formatting conventions
- Run `npm run lint` before committing

## Questions?

Feel free to open an issue for any questions or concerns.
