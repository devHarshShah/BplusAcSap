'use client';
import React, { useState, useEffect, use } from 'react';
import Navbar from '../../components/Navbar';

interface Employee {
  _id: string; // Assuming ObjectId is not necessary for the frontend
  employee_branch: string;
  employee_name: string;
}

interface Leave {
  _id: string;
  employee_id: {
    employee_name: string;
  };
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: string;
  duration_type: string;
  status: string;
  reason: string;
}

const LeaveForm = ({ params }: { params: { slug: string } }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [unapprovedLeave, setUnapprovedLeave] = useState<Leave[]>([]);
  const [leaveid, setLeaveid] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (params.slug === 'admin') {
        const response = await fetch('/api/fetchEmployeeId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.employeeId === '1' || data.employeeId === '101' || data.employeeId === '11') {
            setIsAdmin(true);
          } else {
            window.location.href = '/timesheet/user'; // Redirect to the homepage if the user is not an admin
          }
        }
      }
    };
    checkAdminStatus();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const employeeResponse = await fetch('/api/fetchemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const employeeData = await employeeResponse.json();
      setEmployee(employeeData.employee);

      const leaveResponse = await fetch('/api/leaveunapproved');
      const leaveData = await leaveResponse.json();
      setUnapprovedLeave(leaveData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (duration === 'Quarter Day') {
      setDays('0.25');
    } else if (duration === 'Half Day') {
      setDays('0.5');
    }
  }, [duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log({ leaveType, duration, startDate, endDate, days, reason });
    const formData = {
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
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
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      //console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelect = async (value: string) => {
    const selectedLeave = unapprovedLeave.find((leave) => leave._id === value);
    setLeaveid(value);
    if (selectedLeave) {
      setLeaveType(selectedLeave.leave_type);
      setDuration(selectedLeave.duration_type);
      setReason(selectedLeave.reason);
      setDays(selectedLeave.duration.toString());
      setStartDate(selectedLeave.start_date);
      setEndDate(selectedLeave.end_date);
    }
  };

  const handleApprove = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      const response = await fetch('/api/approveleave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leaveid: leaveid }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      //console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))' }}>
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg p-8 w-[80%] max-w-4xl text-black mx-auto my-auto">
        {isAdmin ? (
          <>
            <label htmlFor="leave" className="block text-gray-700 text-sm font-bold mb-2">
              Select Leave for Approval:
            </label>
            <select id="leave" className="mb-4 w-full text-black border border-black p-2" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelect(e.target.value)}>
              <option value="">Select Leave</option>
              {unapprovedLeave &&
                unapprovedLeave.length > 0 &&
                unapprovedLeave?.map((leave) => (
                  <option key={leave._id} value={leave._id}>
                    {leave.employee_id.employee_name}
                  </option>
                ))}
            </select>
          </>
        ) : null}
        <div className="flex flex-col space-y-4">
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
              <input type="date" id="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          ) : null}

          {duration === 'Full Day' && (
            <>
              <div>
                <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Start Date:
                </label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                  End Date:
                </label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
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

          {isAdmin ? (
            <button onClick={(event) => handleApprove(event)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Approve
            </button>
          ) : (
            <button onClick={(event) => handleSubmit(event)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Send for Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveForm;
