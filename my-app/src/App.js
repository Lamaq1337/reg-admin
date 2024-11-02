import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import PhotoUpload from './components/PhotoUpload';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RegistrationForm />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/photo" element={<PhotoUpload />} />
            </Routes>
        </Router>
    );
}

export default App;
