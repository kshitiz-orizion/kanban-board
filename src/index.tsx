import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import reportWebVitals from './reportWebVitals';
import {App} from "./App";
import { IssueProvider } from './components/IssueContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <IssueProvider>
        <App/>
        </IssueProvider>
    </React.StrictMode>
);
reportWebVitals();


