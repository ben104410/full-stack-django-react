
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MarkAttendance from './components/MarkAttendance';
import AttendanceList from './components/AttendanceList';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import './index.css'; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendanceList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


