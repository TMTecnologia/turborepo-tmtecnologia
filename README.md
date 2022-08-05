# Turborepo TMTecnologia Starter

Yarn v3 starter monorepo, featuring:

- 🏎 [Turborepo](https://turborepo.org) — High-performance build system for Monorepos
- 🚀 [React](https://reactjs.org/) — JavaScript library for user interfaces
- 🛠 [Tsup](https://github.com/egoist/tsup) — TypeScript bundler powered by esbuild
- 📖 [Storybook](https://storybook.js.org/) — UI component environment powered by Vite
- 🔼 [Next.js](https://nextjs.org/) - Flexible React framework focused on web applications
- 🔒️ [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- 💄 [Tailwind CSS](https://tailwindcss.com/) + [🩻](https://www.radix-ui.com/) - CSS framework and Primitive library
- 📋 [React Hook Form](https://react-hook-form.com/) - Performant, flexible and extensible forms with easy-to-use validation
- 💎 [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference
- 🧑‍💻 [tRPC](https://trpc.io/) - End-to-end typesafe APIs powered by React Query
- 🗃️ [Prisma ORM](https://prisma.io/) - typesafe client with painless migrations
- 🥒 [Cucumber](https://cucumber.io/) + 🎭 [Playwrite](https://playwright.dev/) = BDD e2e testing
- 💬 [i18next](https://www.i18next.com/) - internationalization-framework

As well as a few others tools preconfigured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Commitlint](https://commitlint.js.org/) for linting gitmoji commits messages
- [Commitzen](https://commitizen-tools.github.io/commitizen/) for guiding contributors in writing gitmoji commits
- [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- [Syncpack](https://github.com/JamieMason/syncpack#readme) for ensuring monorepo dependency versions consistency
- [DangerJS](https://danger.systems/js/) for common review chores automation
- [Husky](https://typicode.github.io/husky/#/) for git hooks, e.g linting staged files with [lint-staged](https://github.com/okonet/lint-staged#readme)
- [GitHub Actions](https://github.com/features/actions) for automated deploy, lint, test and publishing

## Getting Started

Clone the design system example locally or [from GitHub](https://github.com/TMTecnologia/turborepo-tmtecnologia):

```bash
>>> git clone https://github.com/TMTecnologia/turborepo-tmtecnologia.git
>>> cd turborepo-tmtecnologia
>>> yarn install
>>> cp .env.example .env
# Configure your env
>>> cp .env packages/acme-db/.env
>>> cp .env apps/client/.env
>>> docker-compose up -d
>>> yarn workspace @acme/db prisma db push
# build core
>>> yarn workspace @acme/core build
>>> yarn dev
```

### Useful Commands

- `yarn build` - Build all packages and apps
- `yarn dev` - Run all apps locally
- `yarn lint` - Lint all packages
- `yarn format` - Format all packages
- `yarn changeset` - Generate a changeset
- `yarn syncpack:fix` - Format all `package.json` files
  - Organise `package.json` files according to a conventional format
  - Ensure that multiple packages requiring the same dependency define the same
  version
- `yarn syncpack:lint` - Lint all packages versions
  - List dependencies which are required by multiple packages, where the version is not the same across every package
  - Check dependency versions follow a consistent format
- `yarn clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Apps & Packages

This Turborepo includes the following packages and applications:

- `apps/api`: REST API powered by Express
- `apps/client`: Create T3 App starter, customized
- `apps/docs`: Component documentation site with Storybook
- `packages/@acme/core`: Core React components
- `packages/@acme/db`: DB Client
- `packages/@acme/routers`: tRPC routers to interact with DB
- `packages/@acme/utils`: Shared React utilities
- `packages/@acme/tsconfig`: Shared `tsconfig.json`s used throughout the Turborepo
- `packages/eslint-config-acme`: ESLint shared config

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/). Yarn Workspaces enables us to "hoist" dependencies that are shared between packages to the root `package.json`. This means smaller `node_modules` folders and a better local dev experience.

## Versioning & Publishing Packages

You'll need to create an `NPM_TOKEN` and `GITHUB_TOKEN` and add it to your GitHub repository settings to enable access to npm. It's also worth installing the [Changesets bot](https://github.com/apps/changeset-bot) on your repository.

### Generating the Changelog

To generate your changelog, run `yarn changeset` locally:

1. **Which packages would you like to include?** – This shows which packages and changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

### Releasing

When you push your code to GitHub, the [GitHub Action](https://github.com/changesets/action) will run the `release` script defined in the root `package.json`:

```bash
turbo run build --filter=docs^... && changeset publish
```

Turborepo runs the `build` script for all publishable packages (excluding docs) and publishes the packages to npm. By default, this example includes `acme` as the npm organization. To change this, do the following:

- Rename folders in `packages/*` to replace `acme` with your desired scope
- Search and replace `acme` with your desired scope
- Re-run `yarn install`

To publish packages to a public npm organization scope, **add** the following to each of the `package.json`'s

```diff
+ "publishConfig": {
+  "access": "public"
+ },
```
