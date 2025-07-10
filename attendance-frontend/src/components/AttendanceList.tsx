import { useEffect, useState } from 'react';
import axios from '../api/axios';


export default function AttendanceList() {
    type AttendanceRecord = {
  user: string;
  date: string;
  status: string;
};

 const [records, setRecords] = useState<AttendanceRecord[]>([]);


  useEffect(() => {
    axios.get<AttendanceRecord[]>('attendance/view/')
  .then(res => setRecords(res.data))
  .catch(() => alert('Error loading attendance'));
  }, []);

  return (
    <div className="attendance-container">
      <h2>Attendance Records</h2>

      {records.length === 0 ? (
        <p>No attendance records available.</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index}>
                <td>{rec.user}</td>
                <td>{rec.date}</td>
                <td>{rec.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

