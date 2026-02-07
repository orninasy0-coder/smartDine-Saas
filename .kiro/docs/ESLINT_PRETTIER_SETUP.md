# ESLint & Prettier Configuration

This document describes the ESLint and Prettier setup for the SmartDine SaaS platform.

## Overview

The project uses ESLint for code quality and Prettier for code formatting, integrated together to provide a consistent development experience.

## Installed Packages

### ESLint
- `eslint` - Core ESLint package
- `@eslint/js` - ESLint JavaScript configurations
- `typescript-eslint` - TypeScript support for ESLint
- `eslint-plugin-react-hooks` - React Hooks linting rules
- `eslint-plugin-react-refresh` - React Fast Refresh linting rules
- `globals` - Global variables definitions

### Prettier
- `prettier` - Core Prettier package
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

## Configuration Files

### `.prettierrc`
Prettier configuration with the following settings:
- Semi-colons: enabled
- Single quotes: enabled
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: ES5 compatible
- Arrow function parentheses: always
- Line endings: LF (Unix-style)
- Bracket spacing: enabled
- JSX quotes: double quotes
- Bracket same line: false

### `eslint.config.js`
ESLint configuration using the new flat config format with:
- TypeScript support
- React Hooks rules
- React Fast Refresh rules
- Prettier integration
- Custom rules for unused variables and TypeScript

### `.prettierignore`
Excludes the following from formatting:
- `node_modules`
- `dist`, `build`, `.next`, `out`
- Cache directories
- Log files
- Environment files
- IDE folders
- Package lock files

### `.vscode/settings.json`
VS Code settings for automatic formatting:
- Format on save: enabled
- Default formatter: Prettier
- ESLint auto-fix on save
- Line endings: LF

## Available Scripts

### `npm run lint`
Runs ESLint to check for code quality issues.

### `npm run lint:fix`
Runs ESLint with auto-fix to automatically fix fixable issues.

### `npm run format`
Runs Prettier to format all source files.

### `npm run format:check`
Checks if files are formatted according to Prettier rules without modifying them.

## Usage

### During Development
1. VS Code will automatically format files on save if you have the Prettier extension installed
2. ESLint will show warnings and errors in the editor
3. Run `npm run lint` before committing to ensure code quality

### Before Committing
```bash
# Check and fix linting issues
npm run lint:fix

# Format all files
npm run format

# Verify everything is clean
npm run lint
```

## ESLint Rules

### Custom Rules
- `prettier/prettier`: Enforces Prettier formatting as ESLint errors
- `@typescript-eslint/no-unused-vars`: Errors on unused variables (allows `_` prefix for intentionally unused)
- `@typescript-eslint/no-explicit-any`: Warns when using `any` type
- `react-hooks/rules-of-hooks`: Enforces React Hooks rules
- `react-hooks/exhaustive-deps`: Warns about missing dependencies in hooks
- `react-refresh/only-export-components`: Warns when non-components are exported from component files

## Troubleshooting

### Line Ending Issues
If you see many "Delete `␍`" errors, it's due to CRLF line endings. Run:
```bash
npm run lint:fix
```

### Prettier Not Formatting
1. Ensure the Prettier VS Code extension is installed
2. Check that `.prettierrc` exists in the project root
3. Verify VS Code settings have `"editor.defaultFormatter": "esbenp.prettier-vscode"`

### ESLint Not Working
1. Ensure the ESLint VS Code extension is installed
2. Reload VS Code window
3. Check the ESLint output panel for errors

## Integration with CI/CD

Add these commands to your CI/CD pipeline:
```yaml
- name: Lint
  run: npm run lint

- name: Format Check
  run: npm run format:check
```

## Best Practices

1. **Always run linting before committing**
2. **Fix warnings, not just errors** - warnings often indicate potential issues
3. **Don't disable rules without good reason** - if you need to disable a rule, add a comment explaining why
4. **Keep configuration consistent** - don't override settings in individual files unless necessary
5. **Update dependencies regularly** - ESLint and Prettier plugins are frequently updated

## Future Improvements

Consider adding:
- Pre-commit hooks with Husky and lint-staged
- Import sorting with `eslint-plugin-import`
- Accessibility linting with `eslint-plugin-jsx-a11y`
- Additional TypeScript strict rules
