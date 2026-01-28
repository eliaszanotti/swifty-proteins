# Commit Conventions

This project uses **Commitlint** to enforce conventional commit messages. The commit will be rejected if it doesn't follow the format.

## Format

```
type(scope): subject
```

| Part | Description | Required |
|------|-------------|----------|
| `type` | Category of changes | ✅ Yes |
| `scope` | Affected component (optional) | ❌ No |
| `subject` | Short description | ✅ Yes |

## Allowed types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix: resolve login timeout` |
| `docs` | Documentation only | `docs: update API documentation` |
| `style` | Style/formatting (no code change) | `style: fix indentation` |
| `refactor` | Code refactoring | `refactor: simplify auth logic` |
| `perf` | Performance improvement | `perf: optimize protein loading` |
| `test` | Adding/updating tests | `test: add auth unit tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add github actions` |
| `revert` | Revert a commit | `revert: feat: remove feature X` |

## Examples

```bash
# Simple commit
git commit -m "feat: add user authentication"

# With scope
git commit -m "fix(auth): resolve login timeout"
git commit -m "feat(protein): add 3D visualization"

# Documentation
git commit -m "docs: update README with setup instructions"

# Refactoring
git commit -m "refactor(auth): simplify login logic"
```

## Rules

| Rule | Description |
|------|-------------|
| `type-enum` | Only allowed types listed above |
| `type-case` | Type must be lowercase |
| `type-empty` | Type is required |
| `subject-empty` | Subject is required |
| `header-max-length` | Max 100 characters for the header |

## Invalid examples

```bash
❌ git commit -m "Add new feature"           # Missing type
❌ git commit -m "Feat: add feature"         # Type must be lowercase
❌ git commit -m "feat:"                      # Missing subject
❌ git commit -m "feat: this is a very long subject that exceeds one hundred characters limit"
```
