import React from 'react';

import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar'
import { ToastContainer } from 'react-toastify';

export const App = () => {

  return (
    <div style={{display:"flex"}}>
    <ToastContainer position="bottom-left" />
    <Sidebar/>
    <div style={{flex:1,flexDirection:"column",minHeight:'100vh', display:"flex"}}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/board" element={<BoardPage />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/board" />} />
        </Routes>
      </Router>
      </div>
      </div>
      
  );
}