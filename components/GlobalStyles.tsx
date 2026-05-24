import React from 'react';

export default function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

    :root {
      --bg-color: #faf9f9;
      --surface-color: #ffffff;
      
      --primary: #1cb0f6;
      --primary-dark: #006590;
      --primary-text: #00405d;
      
      --secondary: #fec700;
      --secondary-dark: #755b00;
      --secondary-text: #6e5400;
      
      --border-light: #e3e2e2;
      --border-dark: #dadada;
      --text-main: #1a1c1c;
      --text-muted: #6e7881;
    }

    body {
      font-family: 'Be Vietnam Pro', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .card-tactile { background-color: var(--surface-color); border: 2px solid var(--border-light); border-bottom: 4px solid var(--border-dark); border-radius: 1.5rem; padding: 1.5rem; }
    .card-tactile-sm { background-color: var(--surface-color); border: 2px solid var(--border-light); border-bottom: 3px solid var(--border-dark); border-radius: 1rem; padding: 1rem; }
    .btn-primary { background-color: var(--primary); color: var(--primary-text); border: 2px solid var(--primary-dark); border-bottom: 4px solid var(--primary-dark); border-radius: 1rem; font-weight: 700; text-transform: uppercase; font-family: 'Be Vietnam Pro', sans-serif; letter-spacing: 0.05em; transition: all 0.1s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .btn-outline { background-color: transparent; color: var(--primary-dark); border: 2px solid var(--primary-dark); border-bottom: 4px solid var(--primary-dark); border-radius: 1rem; font-weight: 700; text-transform: uppercase; font-family: 'Be Vietnam Pro', sans-serif; letter-spacing: 0.05em; transition: all 0.1s ease; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; border-radius: 1rem; font-weight: 700; transition: all 0.1s ease; border: 2px solid transparent; border-bottom-width: 4px; width: 100%; text-align: left; }
    .input-tactile { border: 2px solid var(--border-light); border-bottom: 4px solid var(--border-dark); border-radius: 1rem; transition: all 0.1s ease; font-family: inherit; }
    .input-tactile:focus { outline: none; border-color: var(--primary); border-bottom-color: var(--primary-dark); }
  `}} />
  );
}
