# Development Workflow & Best Practices

This document outlines the development workflow, code formatting rules, testing standards, and AI pair-programming conventions for **LD-NI-BOS**.

---

## 1. Laravel Boost & AI Skills Integration

The project is configured with **Laravel Boost**, integrating domain-specific agent skills located in `.agents/skills/`:

| Skill | Purpose |
|---|---|
| `laravel-best-practices` | Query performance, caching, Eloquent patterns, authorization, security, and queue jobs. |
| `tailwindcss-development` | Tailwind v3/v4 responsive grid layouts, card designs, dark mode styling, and utility fixes. |
| `testing-best-practices` | Test design, isolation, assertion choices, HTTP boundary testing, and performance. |
| `deploying-to-cloud` | Cloud CLI and deployment automation to Laravel Cloud. |
| `infer-conventions` | Extract and record application coding conventions. |

---

## 2. Coding Standards (PHP & Laravel)

Follow these conventions when writing or refactoring PHP code:

### Control Structures & Formatting
- Always use curly braces for control structures, even for single-line bodies:
  ```php
  if ($condition) {
      return $value;
  }
  ```
- Use PHP 8 constructor property promotion:
  ```php
  public function __construct(
      public readonly UserService $userService,
  ) {}
  ```
- Declare explicit return types and parameter types on all functions and methods:
  ```php
  public function activateUser(User $user, ?string $reason = null): bool
  ```
- Use `TitleCase` for Enum keys (`Pending`, `Completed`, `Cancelled`).
- Prefer PHPDoc blocks over inline comments, using array shape annotations where appropriate:
  ```php
  /**
   * @return array{id: int, status: string}
   */
  ```

---

## 3. Code Formatting with Laravel Pint

Before finalizing changes to any PHP files, run **Laravel Pint** to ensure consistent style:

```bash
export GIT_CONFIG_NOSYSTEM=1
php vendor/bin/pint --dirty --format agent
```

To format all files across the repository:

```bash
export GIT_CONFIG_NOSYSTEM=1
php vendor/bin/pint --format agent
```

> [!NOTE]
> On Android emulated storage (`/storage/emulated/0`), execute permissions may require prefixing the binary with `php`, and Git requires `export GIT_CONFIG_NOSYSTEM=1`.

---

## 4. Testing Guidelines

The test suite uses **PHPUnit 12**.

### Running Tests

Run the complete test suite with compact output:

```bash
php artisan test --compact
```

Or run directly via PHPUnit runner:

```bash
php vendor/bin/phpunit
```

### Scoped Test Runs

Run only authentication feature tests:

```bash
php artisan test --compact tests/Feature/Auth/
```

Run a specific test case:

```bash
php artisan test tests/Feature/Auth/LoginTest.php
php artisan test --filter=test_user_can_login_with_valid_credentials
```

### Current Test Coverage

The test suite currently includes:
- **`tests/Feature/Auth/RegisterTest.php`**: Validates registration, required fields, duplicate emails, password confirmation mismatches, short passwords, and aliased routes.
- **`tests/Feature/Auth/LoginTest.php`**: Validates valid credentials, invalid passwords, nonexistent emails, profile retrieval, unauthenticated rejection (401), token revocation (logout), and aliased routes.
- **`tests/Feature/ExampleTest.php`**: Base HTTP response verification.
- **`tests/Unit/ExampleTest.php`**: Base PHPUnit unit verification.

### Writing Tests

- Use `php artisan make:test --phpunit {NameTest}` to generate feature tests.
- Add `--unit` flag only for pure isolated unit tests.
- Always use model factories (`User::factory()->create()`) instead of manually inserting database rows in tests.

---

## 5. Git & Version Control

- **Active Branch**: `alfino`
- **Android Safe Directory**:
  ```bash
  export GIT_CONFIG_NOSYSTEM=1
  git config --global --add safe.directory "/storage/emulated/0/Documents/projects/ld-ni-bos"
  ```
- Before pushing or committing:
  1. Verify tests pass: `php artisan test --compact`
  2. Format code: `export GIT_CONFIG_NOSYSTEM=1 && php vendor/bin/pint --dirty --format agent`
  3. Inspect changed files: `git status`
