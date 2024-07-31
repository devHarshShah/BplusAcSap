'use client';
import { useEffect, useState } from 'react';
import { ObjectId } from 'mongoose';
import Navbar from '../components/Navbar';
import Link from 'next/link';

interface Employee {
  _id: string; // Assuming ObjectId is not necessary for the frontend
  employee_name: string;
  employee_branch: string;
  employee_id: string;
  available_leaves: { annual: number; sick: number };
  timesheet: [];
  leave: Array<{
    _id: string; // Assuming each leave object has an _id field
    // Include other fields as necessary
  }>;
}

interface TimesheetEntry {
  projectId: string;
  projectName: string;
  workType: string;
  description: string;
  hours: { [key: string]: string | null }; // key is 'YYYY-MM-DD'
}

interface Timesheet {
  _id: string;
  weekEntries: TimesheetEntry[];
  approved: boolean;
  employeeCode: {
    _id: ObjectId;
    employee_id: string;
    employee_name: string;
  };
}

const Dashboard = () => {
  // State to store the fetched employee details
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSheet, setTimeSheet] = useState<Timesheet[]>();

  useEffect(() => {
    // Function to fetch employee details
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch('/api/fetchemployee', {
          method: 'POST', // Assuming the endpoint expects a POST request
          headers: {
            'Content-Type': 'application/json',
            // Include other headers as required, for example, authorization tokens
          },
          // Include body if required by your API
        });

        if (!response.ok) {
          const responseData = await response.json();
          if (responseData.redirectTo) {
            window.location.href = responseData.redirectTo;
          }
          throw new Error('Failed to fetch employee details');
        }

        const data = await response.json();
        setEmployeeDetails(data.employee); // Assuming the response JSON has the data directly
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []); // Empty dependency array means this effect runs once on mount

  function generateWeekRanges(startOfMonth: Date): { startDate: string; endDate: string }[] {
    const date = new Date(startOfMonth);
    const weeksInMonth = 5; // Approximate number of weeks in a month
    const weekRanges: { startDate: string; endDate: string }[] = [];

    for (let i = 0; i < weeksInMonth; i++) {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6); // End of the week
      weekRanges.push({
        startDate: date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        endDate: endDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit'}),
      });
      date.setDate(date.getDate() + 7); // Move to the next week
    }

    return weekRanges;
  }

  useEffect(() => {
    const fetchTimeSheet = async () => {
      try {
        const response = await fetch('/api/fetchtimesheetbyid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employeeCode: employeeDetails?._id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch timesheet');
        }

        const data = await response.json();
        setTimeSheet(data);
        //console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeDetails?._id) {
      fetchTimeSheet();
    }
  }, [employeeDetails]); // Include employeeDetails in the dependency array

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  let weekRanges: { startDate: string; endDate: string }[] = [];
  const currentDate = new Date(); // Get the current date
  const currentYear = currentDate.getFullYear(); // Get the current year
  const currentMonth = currentDate.getMonth(); // Get the current month (0-indexed, January is 0)
  // Set the date to the first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  // Find the first Monday of the month
  let firstMonday = new Date(firstDayOfMonth);
  if (firstMonday.getDay() !== 1) {
    // If the first day is not Monday
    firstMonday.setDate(firstMonday.getDate() + ((8 - firstMonday.getDay()) % 7));
  }

  // Now, proceed with generating week ranges using firstMonday
  weekRanges = generateWeekRanges(firstMonday);

  //console.log('Generated week ranges:', weekRanges);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))' }}>
      <Navbar />

      <div className="flex flex-row space-x-8 bg-white w-[90%] h-[80%] mx-auto my-auto p-5 rounded-xl">
        <div className="text-black w-[30%]">
          <p className="font-bold text-lg mb-4">Employee</p>
          {employeeDetails && (
            <div className="space-y-10">
              <div>
                <label htmlFor="employeeName" className="block text-md font-medium text-gray-700">
                  Employee Name:
                </label>
                <input id="employeeName" type="text" value={employeeDetails.employee_name} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none" />
              </div>

              <div>
                <label htmlFor="employeeID" className="block text-md font-medium text-gray-700">
                  Employee ID:
                </label>
                <input id="employeeID" type="text" value={employeeDetails.employee_id} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none" />
              </div>

              <div>
                <label htmlFor="branch" className="block text-md font-medium text-gray-700">
                  Branch:
                </label>
                <input id="branch" type="text" value={employeeDetails.employee_branch} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700">Available Leaves:</label>
                <div className="flex space-x-4">
                  <div>
                    <label htmlFor="annualLeaves" className="block text-md font-medium text-gray-700">
                      Annual:
                    </label>
                    <input id="annualLeaves" type="text" value={employeeDetails.available_leaves.annual} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none" />
                  </div>
                  <div>
                    <label htmlFor="sickLeaves" className="block text-md font-medium text-gray-700">
                      Sick:
                    </label>
                    <input id="sickLeaves" type="text" value={employeeDetails.available_leaves.sick} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="text-black w-[30%]">
          <p className="font-bold text-lg mb-4">Timesheet</p>
          {weekRanges.map(({ startDate, endDate }) => {
            const weekExists = timeSheet?.find((sheet) => sheet.weekEntries.some((entry) => entry.hours[startDate] !== undefined));

            // Check if the timesheet exists and then check the approved status
            const approved = weekExists?.approved;
            return (
              <div key={startDate} className="flex items-center mb-4 p-4 w-full shadow-lg rounded-lg bg-white hover:bg-gray-50 transition duration-300 ease-in-out">
                <span className="bg-gray-200 text-gray-700 mr-4 py-2 px-3 rounded text-sm cursor-not-allowed w-[32%] flex items-center justify-center">{`${startDate.split('/').slice(0, 2).join('/')} - ${endDate.split('/').slice(0, 2).join('/')}`}</span>
                <p className="flex-grow mr-4 font-medium">{weekExists ? (approved ? 'Approved: Yes' : 'Approved: No') : 'Not Submitted'}</p>
                <Link href={`/timesheet/user?date=${startDate}`} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-[22%] flex justify-center items-center rounded transition duration-300 ease-in-out ${approved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}><button disabled={approved}>
                  {weekExists ? 'Modify' : 'Add'}
                </button></Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
