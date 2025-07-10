import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Attendance System</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/mark">Mark Attendance</Link></li>
          <li><Link to="/attendance">View Attendance</Link></li>
        </ul>
      </nav>
    </div>
  );
}
