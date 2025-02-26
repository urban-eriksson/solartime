# Claude's Guide to solartime

## Build/Test/Lint Commands
- Setup: `npm install`
- Run development server: `npm run dev`
- Build: `npm run build`
- Test all: `npm test`
- Test single file: `npm test -- path/to/test/file.test.js`
- Lint: `npm run lint`
- Type check: `npm run typecheck`

## Code Style Guidelines
- **Formatting**: Use Prettier with default config
- **Imports**: Group imports (React, third-party, internal)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Types**: Use TypeScript with explicit return types on functions
- **Error Handling**: Use try/catch for async operations
- **Comments**: JSDoc for public API, inline for complex logic
- **Components**: Prefer functional components with hooks
- **State Management**: Use React Context for global state

Update this file as the project matures with additional conventions and commands.