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

### Current Test Coverage (80 Tests, 424 Assertions)

The test suite provides 100% green coverage across 11 test files:
- **`tests/Feature/Auth/RegisterTest.php`**: User registration, required field validation, duplicate email protection, password confirmation checks, and auth route aliases.
- **`tests/Feature/Auth/LoginTest.php`**: Login authentication, credential checking, profile retrieval, unauthenticated 401 rejections, token revocation on logout.
- **`tests/Feature/CartTest.php`**: Shopping cart retrieval with subtotal calculations, adding items, updating quantities, deleting items, and bulk cart additions.
- **`tests/Feature/CategoryTest.php`**: Hardware category listing and slug lookups.
- **`tests/Feature/ProductTest.php`**: Paginated catalog, searching, filtering by pre-built vs part type, price ranges, and category scopes.
- **`tests/Feature/WishlistTest.php`**: Wishlist retrieval, adding products, duplicate handling, removing products, and wishlist toggling.
- **`tests/Feature/OrderTest.php`**: Cart checkout execution, order numbering, inventory decrement, order listing, order cancellation, and stock restoration.
- **`tests/Feature/Api/CheckoutControllerTest.php`**: Direct itemized checkout, stock checks, and vendor item line creation.
- **`tests/Feature/Api/VendorControllerTest.php`**: Vendor store profile creation, updating store slug/info, and vendor authentication gating.
- **`tests/Feature/Api/VendorProductControllerTest.php`**: Vendor-owned product management, creation, updates, and deletion.
- **`tests/Feature/Api/VendorOrderControllerTest.php`**: Vendor order dashboard metrics, item-level fulfillment status updates, and order isolation.
- **`tests/Feature/StorefrontRoutesTest.php`**: Blade views and React initial hydration view routes (`/`, `/katalog`, `/pc-builder`, `/keranjang`, `/checkout`, `/akun`, `/vendor/dashboard`, `/produk/{slug}`).
- **`tests/Feature/ExampleTest.php` & `tests/Unit/ExampleTest.php`**: Core framework sanity checks.

### Writing Tests

- Use `php artisan make:test --phpunit {NameTest}` to generate feature tests.
- Add `--unit` flag only for pure isolated unit tests.
- Always use model factories (`User::factory()->create()`, `Product::factory()->create()`) instead of manually inserting database rows in tests.

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
