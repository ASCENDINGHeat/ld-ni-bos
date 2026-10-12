# Frontend Architecture & Guide

This guide details the frontend architecture, React 19 configuration, Tailwind CSS v4 styling, and Vite build pipeline for **LD-NI-BOS**.

---

## 1. Frontend Technology Stack

- **Framework**: [React 19](https://react.dev/) (`^19.3.0`)
- **CSS Engine**: [Tailwind CSS v4](https://tailwindcss.com/) (`^4.0.0`) via `@tailwindcss/vite`
- **Asset Bundler**: [Vite 8](https://vitejs.dev/) (`^8.0.0`) with `laravel-vite-plugin` (`^3.1`)
- **Typography**: [Instrument Sans](https://fonts.bunny.net/family/instrument-sans) loaded via Bunny Fonts

---

## 2. Blade Host Template (`resources/views/app.blade.php`)

The application serves a Blade template as the mounting shell for React:

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- React Fast Refresh Directive MUST precede vite scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

> [!IMPORTANT]
> `@viteReactRefresh` is mandatory when developing React apps within Laravel Blade. It injects the React Fast Refresh preamble before Vite script imports to enable state-preserving Hot Module Replacement (HMR).

---

## 3. React Mounting Architecture (`resources/js/app.jsx`)

The React application entry point initializes the DOM root inside `#root`:

```jsx
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Laravel + React</h1>
            <p>React is successfully running through Laravel view routes.</p>
        </div>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
```

---

## 4. Tailwind CSS v4 Integration (`resources/css/app.css`)

Tailwind CSS v4 introduces CSS-first configuration replacing traditional `tailwind.config.js`:

```css
@import 'tailwindcss';

@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';

@theme {
    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol', 'Noto Color Emoji';
}
```

- `@import 'tailwindcss';`: Imports the complete Tailwind v4 utility layer.
- `@source`: Explicitly registers Blade template paths so Tailwind detects dynamically rendered class names in Laravel pagination and views.
- `@theme`: Declares theme variables and custom font families directly in CSS.

---

## 5. Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
```

---

## 6. Extending the Frontend

When adding new components to the React frontend:

1. Create a `resources/js/components/` directory:
   ```
   resources/js/
   ├── components/
   │   ├── Button.jsx
   │   ├── Navbar.jsx
   │   └── Card.jsx
   ├── app.jsx
   └── ...
   ```
2. Import components into `App.jsx` or your feature root.
3. Use Tailwind utility classes for responsive layouts:
   - Flex layouts: `flex items-center justify-between`
   - Responsive grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
   - Dark mode: `bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`
