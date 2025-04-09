# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


//{
//  "name": "recipe-builder",
//  "private": true,
//  "version": "0.0.0",
//  "type": "module",
//  "scripts": {
//    "dev": "vite",
//    "build": "tsc -b && vite build",
//    "lint": "eslint .",
//    "preview": "vite preview"
//  },
//  "dependencies": {
//    "@heroicons/react": "^2.2.0",
//    "@reduxjs/toolkit": "^2.6.1",
//    "@tailwindcss/postcss": "^4.1.3",
//    "@tailwindcss/vite": "^4.0.17",
//    "framer-motion": "^12.6.3",
//    "react": "^19.0.0",
//    "react-dom": "^19.0.0",
//    "react-hook-form": "^7.55.0",
//    "react-redux": "^9.2.0",
//    "react-router-dom": "^7.5.0",
//    "sass": "^1.86.0",
//    "vite-tsconfig-paths": "^5.1.4"
//  },
//  "devDependencies": {
//    "@eslint/js": "^9.21.0",
//    "@tailwindcss/postcss": "^4.0.17",
//    "@types/node": "^22.14.0",
//    "@types/react": "^19.0.10",
//    "@types/react-dom": "^19.0.4",
//    "@vitejs/plugin-react-swc": "^3.8.0",
//    "autoprefixer": "^10.4.21",
//    "eslint": "^9.21.0",
//    "eslint-plugin-react-hooks": "^5.1.0",
//    "eslint-plugin-react-refresh": "^0.4.19",
//    "globals": "^15.15.0",
//    "postcss": "^8.5.3",
//    "sass": "^1.86.0",
//    "tailwindcss": "^4.0.17",
//    "typescript": "~5.7.3",
//    "typescript-eslint": "^8.24.1",
//    "vite": "^6.2.0"
//  }
//}

