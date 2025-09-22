import React from "react";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { register } from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HashRouter>
    <App tab="home" />
  </HashRouter>
);

register();
