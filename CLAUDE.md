# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working in this repository.

## Repository Overview

**Repository:** `jeremiahleung-dev/sumo-love`
**Status:** New repository — no source code has been committed yet.

This file will be updated as the project grows. All sections marked _TBD_ should be filled in once the project structure is established.

---

## Development Branch

Always develop on the designated feature branch. Do **not** push directly to `main` without explicit permission.

```bash
git checkout -b <branch-name>
git push -u origin <branch-name>
```

---

## Project Structure

_TBD — update this section once source files exist._

Expected structure (fill in as the project evolves):

```
/
├── CLAUDE.md           # This file
├── README.md           # Project overview for humans
├── package.json        # (if Node.js) Dependencies and scripts
├── src/                # Source code
├── tests/              # Test files
└── .github/            # CI/CD workflows
```

---

## Tech Stack

_TBD — document the primary language, frameworks, and libraries once chosen._

---

## Getting Started

_TBD — add setup instructions (clone, install dependencies, run locally)._

Example for a Node.js project:

```bash
npm install
npm run dev
```

---

## Development Workflow

### Making Changes

1. Branch from `main` (or the designated base branch).
2. Make focused, atomic commits with clear messages.
3. Run tests before pushing.
4. Open a pull request for review.

### Commit Message Style

Use concise imperative messages:

```
Add user authentication flow
Fix null pointer in payment handler
Refactor database connection pooling
```

Avoid vague messages like `fix bug`, `update stuff`, or `WIP`.

---

## Testing

_TBD — document test commands and frameworks once configured._

Common patterns:

```bash
npm test          # Run all tests
npm run test:watch  # Watch mode
npm run lint      # Lint check
```

All tests must pass before merging a PR. Do not use `--no-verify` to skip hooks.

---

## Code Conventions

_TBD — add language/framework-specific conventions as the project matures._

General rules that apply regardless of stack:

- Keep functions small and single-purpose.
- Validate at system boundaries (user input, external APIs); trust internal code.
- Do not add speculative abstractions or handle hypothetical future requirements.
- Do not leave dead code — delete it rather than commenting it out.
- Avoid backwards-compatibility shims unless explicitly required.
- Do not add error handling for scenarios that cannot happen.

---

## AI Assistant Guidelines

When working in this repository:

1. **Read before editing** — always read a file before modifying it.
2. **Minimal scope** — make only the changes requested; do not refactor surrounding code.
3. **No speculative features** — do not add configuration options, flags, or abstractions that weren't asked for.
4. **No extra documentation** — do not add docstrings, type annotations, or comments to code you didn't change unless asked.
5. **Security** — never introduce command injection, XSS, SQL injection, or other OWASP Top 10 vulnerabilities.
6. **Destructive operations** — confirm with the user before deleting files, force-pushing, or resetting history.
7. **Branch discipline** — develop on the designated branch; never push to `main` directly.
8. **Commit hygiene** — create new commits rather than amending published commits. Never skip hooks (`--no-verify`).

---

## CI/CD

_TBD — document pipelines, required checks, and deployment process once configured._

---

## Environment Variables

_TBD — list required environment variables and how to configure them._

Never commit secrets, `.env` files, or credentials to the repository.

---

_Last updated: 2026-03-29_
