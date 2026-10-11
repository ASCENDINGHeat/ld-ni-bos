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