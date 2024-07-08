'use client';
import React, { useState, useEffect } from 'react';
import { ObjectId } from 'mongoose';
import Navbar from '../components/Navbar';

const LeaveForm = () => {
  interface Employee {
    _id: ObjectId;
    employee_branch: string;
    employee_name: string;
  }

  const [leaveType, setLeaveType] = useState('');
  const [duration, setDuration] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Refactored code to ensure the response body is read only once
    const fetchEmployee = async () => {
      const employeeResponse = await fetch('/api/fetchemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await employeeResponse.json(); // Read the response body once and store it
      if (employeeResponse.ok) {
        const { employee } = responseData;
        setEmployee(employee);
      } else {
        if (responseData.redirectTo) {
          window.location.href = responseData.redirectTo;
        } else {
          throw new Error(responseData.error || 'Unknown error');
        }
      }
      return responseData; // Return the already-read response data
    };
    fetchEmployee();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ leaveType, duration, dateRange, days, reason });
    // Assuming dateRange has startDate and endDate properties
    const formData = {
      leave_type: leaveType,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate, // Adjusted to send endDate separately
      reason: reason,
      duration: days,
      duration_type: duration,
      employee_id: employee?._id,
      employee_branch: employee?.employee_branch,
      employee_name: employee?.employee_name,
    };
    try {
      const response = await fetch('/api/saveleave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if your API requires authentication
          Authorization: 'Bearer YOUR_TOKEN_HERE',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))' }}>
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg p-8 w-[80%] max-w-4xl text-black mx-auto my-auto">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="leaveType" className="block text-gray-700 text-sm font-bold mb-2">
              Leave Type:
            </label>
            <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Select...</option>
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
              Duration:
            </label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Select...</option>
              <option value="Quarter Day">Quarter Day</option>
              <option value="Half Day">Half Day</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          {duration === 'Quarter Day' || duration === 'Half Day' ? (
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input type="date" id="date" onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          ) : null}

          {duration === 'Full Day' && (
            <>
              <div>
                <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Start Date:
                </label>
                <input type="date" id="startDate" onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                  End Date:
                </label>
                <input type="date" id="endDate" onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} className="w-full border border-gray-300 rounded-md p-2" />
              </div>

              <div>
                <label htmlFor="days" className="block text-gray-700 text-sm font-bold mb-2">
                  Number of Days:
                </label>
                <input type="number" id="days" value={days} onChange={(e) => setDays(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
            </>
          )}

          <div>
            <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">
              Reason:
            </label>
            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Send to Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
