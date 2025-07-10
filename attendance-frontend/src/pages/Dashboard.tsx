import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

type Summary = {
  present: number;
  absent: number;
};

type UserProfile = {
  username: string;
  role: 'staff' | 'community';
};

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState<Summary>({ present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userRes = await axios.get<UserProfile>('users/profile/');
        if (!userRes.data || !userRes.data.username) {
          throw new Error('User not found');
        }
        setUsername(userRes.data.username);
        setRole(userRes.data.role);

        // Get attendance summary
        const summaryRes = await axios.get<Summary>('attendance/summary/');
        setSummary(summaryRes.data);
      } catch {
        alert('Not logged in. Redirecting to login.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="dashboard-container">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username} ({role})</h1>
      <p>Here is your attendance summary:</p>

      <ul className="summary-list">
        <li><strong>Present:</strong> {summary.present}</li>
        <li><strong>Absent:</strong> {summary.absent}</li>
      </ul>

      <div className="dashboard-buttons">
        {role === 'staff' && (
          <>
            <Link to="/mark">
              <button className="btn btn-primary">Mark Attendance</button>
            </Link>
            <Link to="/attendance">
              <button className="btn btn-primary">View All Records</button>
            </Link>
          </>
        )}

        {role === 'community' && (
          <Link to="/attendance">
            <button className="btn btn-primary">View My Attendance</button>
          </Link>
        )}

        <Link to="/">
          <button className="btn btn-danger">Logout</button>
        </Link>
      </div>
    </div>
  );
}






// This component serves as the main dashboard for users after they log in.