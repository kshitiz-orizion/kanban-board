import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import reportWebVitals from './reportWebVitals';
import {App} from "./App";
import { Provider } from './components/IssueContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider>
        <App/>
        </Provider>
    </React.StrictMode>
);
reportWebVitals();


