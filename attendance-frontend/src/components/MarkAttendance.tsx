import axiosInstance from '../api/axios';
import { useState, useEffect } from 'react';
import './MarkAttendance.css';

type AttendanceRecord = {
  id: number;
  date: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
};

function AttendanceApp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Fetch attendance records after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchAttendance();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('login/', {
        username,
        password,
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsLoggedIn(true);
      setError('');
    } catch (err: unknown) {
      if (axiosErrorGuard(err)) {
        setError((err.response?.data as { message?: string })?.message || '❌ Login failed');
      } else {
        setError('❌ An unexpected error occurred');
      }
    }
    function axiosErrorGuard(
      error: unknown
    ): error is { response?: { data?: { message?: string } } } {
      return typeof error === 'object' && error !== null && 'response' in error;
    }
  };

  const handleMarkAttendance = async (status: string) => {
    try {
      await axiosInstance.post('attendance/mark/', { status });
      setAttendanceStatus('Attendance marked successfully!');
      setAttendanceError('');
      fetchAttendance();
    } catch (err: unknown) {
      setAttendanceStatus('');
      if (axiosErrorGuard(err)) {
        setAttendanceError((err.response?.data as { message?: string })?.message || '❌ Failed to mark attendance');
      } else {
        setAttendanceError('❌ An unexpected error occurred');
      }
    }
    function axiosErrorGuard(
      error: unknown
    ): error is { response?: { data?: { message?: string } } } {
      return typeof error === 'object' && error !== null && 'response' in error;
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axiosInstance.get('attendance/summary/');
      const data = response.data as { records?: AttendanceRecord[] };
      setAttendanceRecords(data.records || []);
    } catch {
      setAttendanceRecords([]);
    }
  };

  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    );
  }

  return (
    <div>
      <h2>Mark Attendance</h2>
      <button onClick={() => handleMarkAttendance('Present')}>Present</button>
      <button onClick={() => handleMarkAttendance('Absent')}>Absent</button>
      {attendanceStatus && <p className="success-msg">{attendanceStatus}</p>}
      {attendanceError && <p className="error-msg">{attendanceError}</p>}

      <h2>Your Attendance Records</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.date}</td>
              <td>{rec.status}</td>
              <td>{rec.check_in_time || '-'}</td>
              <td>{rec.check_out_time || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceApp;








// This component allows users to mark their attendance as either "Present" or "Absent".