
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskManager from './services/components/TaskManager';

function App() {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<TaskManager />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
