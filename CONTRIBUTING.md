# Contributing: Adding Vulnerable Examples Safely

This project contains intentionally insecure code for education and security testing. When adding vulnerable examples, follow these rules so contributors and automated tooling can understand intent, scope, and how to safely run or revert the example.

1. Open an issue first
- Create an issue describing the intended insecure example, the learning goal (what scanners or students should detect), and the proposed files/locations to change.

2. Use clearly-named feature flags / runtime guards
- Introduce the insecure example behind an environment gate (for example, `USE_LEGACY_CIPHER=true`) or explicit config flag in `config/`. Never enable insecure defaults by default.

3. Document inline and in tests
- Add a file-level comment above the vulnerable code explaining why it's insecure and how to remediate it.
- Add a test that demonstrates the behavior scanners or students should observe. If the example requires mocks or test-only behaviors, keep those mocks inside `test/` and use `jest.mock(...)` to avoid side effects.

4. Add a changelog / metadata entry
- When appropriate, add a short entry in `docs/` or update `copilot-instructions.md` explaining the example and the date it was introduced.

5. Mark dependency changes explicitly
- If you add or pin a dependency solely for scanner testing (e.g., an older vulnerable version), add a comment in `package.json` and a short note in this PR describing the reason and the safe alternative.

6. PR checklist
- Ensure the PR includes:
  - Issue link and reason for the insecure example.
  - Inline comments in code marking it `/* INTENTIONAL - educational */`.
  - Tests that exercise the insecure behavior and show expected detection.
  - Feature-flag or env-gate that keeps the insecure behavior opt-in.
  - Documentation update (e.g., `copilot-instructions.md` or `docs/`).

7. Avoid side effects
- Do not perform network calls, open sockets, or write persistent credentials in examples. Mock external calls in tests and keep sample data synthetic.

8. Revert guidance
- Each intentional vulnerability should include a one-line suggested fix in comments and the PR description so reviewers can easily revert or remediate it.

9. Security review
- For public examples that intentionally include vulnerabilities, ask a maintainer to sign off in the PR description to ensure nothing sensitive was added accidentally.

Thank you — contributions that follow this guidance help learners and scanning tools while keeping the repository safe to run locally.
