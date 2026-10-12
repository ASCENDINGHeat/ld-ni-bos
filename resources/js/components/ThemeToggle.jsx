import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from './Icons';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Read active theme from document attribute or localStorage or system preference
        const currentTheme =
            document.documentElement.getAttribute('data-theme') ||
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        setTheme(currentTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);

        document.documentElement.setAttribute('data-theme', nextTheme);
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        try {
            localStorage.setItem('theme', nextTheme);
            window.dispatchEvent(new CustomEvent('theme-changed', { detail: nextTheme }));
        } catch {
            // Ignore storage errors if private browsing restricted
        }
    };

    const isDark = theme === 'dark';
    const label = isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] border border-[var(--border)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2 ${className}`}
        >
            <span className="sr-only">{label}</span>
            {mounted ? (
                isDark ? (
                    <SunIcon className="w-5 h-5 text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
                ) : (
                    <MoonIcon className="w-5 h-5 text-slate-700 transition-transform duration-200 rotate-0 scale-100" />
                )
            ) : (
                <div className="w-5 h-5" />
            )}
        </button>
    );
}
