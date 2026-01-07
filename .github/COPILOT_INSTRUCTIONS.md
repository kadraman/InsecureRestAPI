# Copilot / Assistant Instructions for InsecureRestAPI

## Purpose

This repository is an educational sample REST API intentionally written to include security vulnerabilities so developers and security tools can discover, learn from, and test remediation strategies. It is expected and acceptable that this project contains insecure coding patterns and outdated or vulnerable libraries.

|Important safety notes
|
|- **Do not deploy** this project to production or any environment with real data. It contains deliberate |insecure code and unsafe dependencies.
|- **Do not** treat the insecure defaults as recommendations — they exist only for demonstration and testing.

## Quick project overview

- **Language / stack:** Node.js + TypeScript, Express, MongoDB (in-memory in tests).
- **Key folders:** `src/` (application code), `test/` (Jest unit tests), `config/`, `data/`, `public/`.
- **Useful files:** `src/utils/encrypt.utils.ts` (encryption helpers), `src/utils/file.utils.ts`, `src/utils/text.utils.ts`.

## Intentionally insecure features

These are provided strictly for scanner/detection testing and should be annotated with full comments
on how/why they are insecure together with recommended fixes.

## Running locally

- Install dependencies:

```bash
npm install
```

- Run development server (secure/default mode):

```bash
npm run dev
```

## Testing

- Run unit tests (default):

```bash
npm test
```

## Notes about tests and utilities

- Tests live in the `test/` directory and use Jest.
- When modifying code that imports native modules or logger transports (e.g., `winston`), tests may mock those modules to avoid side effects (file handles, external commands).

## Contributing and experimentation

- It's fine to introduce intentionally vulnerable patterns if your goal is to demonstrate detection or remediation — clearly document why the code is insecure in comments and PR descriptions.
- If you add vulnerable dependencies for scanner tests, mark them in `package.json` or add a short comment in the relevant file explaining the reason and the safe alternative.

## License & attribution

- This project is distributed under the terms described in the repository (see `LICENSE`). When reusing any code, respect the license and attribution.

---
Generated and maintained as part of the InsecureRestAPI learning artifacts. Keep this file updated when new intentional vulnerabilities are added.
