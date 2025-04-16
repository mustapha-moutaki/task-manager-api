// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import TaskList from './services/components/TaskList';
// import TaskForm from './services/components/TaskForm';

// function App() {
//     return (
//         <Router>
//             <div className="container">
//                 <Routes>
//                     <Route path="/" element={<TaskList />} />
//                     <Route path="/create" element={<TaskForm />} />
//                     <Route path="/edit/:id" element={<TaskForm />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;

import React from 'react';
// here i have import material ui composnet
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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
