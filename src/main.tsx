import './polyfills';
import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from './App';
createRoot(document.getElementById('root')!).render(<Home/>);
