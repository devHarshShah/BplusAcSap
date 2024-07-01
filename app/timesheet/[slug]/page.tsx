'use client';
import { ObjectId, set } from 'mongoose';
import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';

const Timesheet = ({ params }: { params: { slug: string } }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  if (params.slug === 'admin') {
    (async () => {
      // Declare an asynchronous IIFE (Immediately Invoked Function Expression)
      const response = await fetch('/api/fetchEmployeeId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json(); // Use await to wait for the JSON response
        if (data.employeeId === '1' || data.employeeId === '101' || data.employeeId === '11') {
          setIsAdmin(true);
        } else {
          return (window.location.href = '/timesheet/user'); // Redirect to the homepage if the user is not an admin
        }
      }
    })();
  }

  type Project = {
    project_id: string;
    project_status: string;
    project_name: string;
  };

  interface Employee {
    _id: ObjectId;
    employee_id: string;
    employee_name: string;
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

  const handleUpdate = async () => {
    if (!employee) {
      console.error('Employee data is not available');
      return;
    }

    const requestBody = {
      timeSheetId: teamsheetid,
      weekEntries: timesheetEntries,
    };

    try {
      const response = await fetch('/api/updatetimesheet', {
        // Replace '/api/timesheet' with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Successfully updated timesheet.")
      // Handle success, e.g., showing a success message or redirecting the user
    } catch (error) {
      console.error('Error:', error);
      // Handle errors, e.g., showing an error message
    }
  };

  const handleSubmit = async () => {
    // Ensure employee is not null before proceeding
    if (!employee) {
      console.error('Employee data is not available');
      return;
    }

    const requestBody = {
      weekEntries: timesheetEntries,
      approved: false,
      employeeCode: employee._id, // Assuming employee has a property employee_code
    };

    try {
      const response = await fetch('/api/savetimesheet', {
        // Replace '/api/timesheet' with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Successfully saved timesheet for approval.")
      // Handle success, e.g., showing a success message or redirecting the user
    } catch (error) {
      console.error('Error:', error);
      // Handle errors, e.g., showing an error message
    }
  };

  const aggregateHours = (entries: TimesheetEntry[]): any => {
    const summary = {
      Project: { WFO: 0, WFH: 0, Total: 0 },
      Others: { Total: 0 },
      Leave: { Total: 0 },
    };

    if (entries.length === 0) return summary;

    entries.forEach((entry) => {
      if (['Sick Leave', 'Annual Leave'].includes(entry.projectName)) {
        summary['Leave']['Total'] += calculateRowTotalHours(entry);
      } else if (overheads.includes(entry.projectName) && !['Sick Leave', 'Annual Leave'].includes(entry.projectName)) {
        summary['Others']['Total'] += calculateRowTotalHours(entry);
      } else if (entry.workType === 'WFO') {
        summary['Project']['WFO'] += calculateRowTotalHours(entry);
      } else if (entry.workType === 'WFH') {
        summary['Project']['WFH'] += calculateRowTotalHours(entry);
      }
    });

    // Calculate the total for 'Project'
    summary['Project']['Total'] = summary['Project']['WFO'] + summary['Project']['WFH'];
    return summary;
  };

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employeeName, setEmployeeName] = useState('');
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fetchedTimeSheet, setFetchedTimeSheet] = useState(false);
  const [checkApprovalStatus, setCheckApprovalStatus] = useState(false);
  const [teamsheetid, setTeamsheetid] = useState('');
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([{ projectId: '', projectName: '', description: '', workType: '', hours: {} }]);
  const [unapprovedTimesheets, setUnapprovedTimesheets] = useState<Timesheet[]>();
  const [summary, setSummary] = useState({ Project: { WFO: 0, WFH: 0, Total: 0 }, Others: { Total: 0 }, Leave: { Total: 0 } });
  const workTypes = ['WFO', 'WFH', 'Site-visit', 'Meeting'];

  const overheads = ['Annual Leave', 'Sick Leave', 'Public Holiday', 'Business Development', 'Admin', 'IT Outage', 'Bench', 'CPD'];

  const generateDates = (start: string, count: number): { day: string; date: string }[] => {
    let dates: { day: string; date: string }[] = [];
    let startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      console.error('Invalid start date');
      return dates;
    }
    for (let i = 0; i < count; i++) {
      let newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      if (!isNaN(newDate.getTime())) {
        // Check if newDate is valid
        // Format date as YYYY-MM-DD and get short day name
        let formattedDate = newDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });
        let dayName = newDate.toLocaleDateString('en-US', { weekday: 'short' });
        dates.push({ day: dayName, date: formattedDate });
      } else {
        console.error('Invalid date encountered');
        // Handle invalid date (e.g., skip or break)
      }
    }
    return dates;
  };

  const isMonday = (date: string): boolean => {
    return new Date(date).getDay() === 1;
  };

  // Function to find the previous Monday from a given date
  const findPreviousMonday = (date: string): string => {
    const resultDate: Date = new Date(date);
    while (resultDate.getDay() !== 1) {
      resultDate.setDate(resultDate.getDate() - 1);
    }
    return resultDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  // Remove the fetching logic from the useEffect that sets startDate and endDate
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      // Calculate the difference between the current day and the next Sunday
      const diff = 7 - start.getDay(); // Sunday is 0, so if today is Monday (1), diff is 6
      const end = new Date(start);
      end.setDate(start.getDate() + diff);
      const formattedEndDate = end.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      setEndDate(formattedEndDate);
    }
  }, [startDate]);

  // New useEffect to fetch timesheet data as soon as the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (employee && startDate && !isAdmin) {
        const start = new Date(startDate);
        let formattedDate = start.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });
        const response = await fetch('/api/fetchtimesheet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mondayDate: formattedDate,
            employeeCode: employee._id, // Assuming employee has a property _id that serves as the employee code
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTeamsheetid(data._id);
          setTimesheetEntries(data.weekEntries);
          setFetchedTimeSheet(true);
          if (data.approved) {
            setCheckApprovalStatus(true);
          }
        } else {
          console.error('Failed to fetch timesheet data:', response.statusText);
          setTimesheetEntries([{ projectId: '', projectName: '', description: '', workType: '', hours: {} }]);
          setFetchedTimeSheet(false); // Reset fetchedTimeSheet to false for all failures
        }
      }
    };

    fetchData();
  }, [employee, startDate]); // Depend on employee and startDate to refetch if they change

  const addTimesheetEntry = () => {
    setTimesheetEntries([...timesheetEntries, { projectId: '', projectName: '', description: '', workType: '', hours: {} }]);
  };

  useEffect(() => {
    setSummary(aggregateHours(timesheetEntries));
    console.log(summary);
  }, [timesheetEntries]);

  const handleEntryChange = (index: number, field: string, value: string | number) => {
    let newEntries = [...timesheetEntries];

    // Special handling for projectId and projectName to sync them
    if (field === 'projectId' || field === 'projectName') {
      const project = projects?.find((project) => project.project_id === value || project.project_name === value);
      if (project) {
        // Sync projectId and projectName regardless of which one was initially changed
        newEntries[index]['projectId'] = project.project_id;
        newEntries[index]['projectName'] = project.project_name;
        if (overheads.includes(project?.project_name)) {
          // Reset the workType and description for this entry
          handleEntryChange(index, 'workType', ''); // Assuming '' is the default value for workType
          handleEntryChange(index, 'description', ''); // Reset description to default value
        }
      }
    } else if (field === 'workType' || field === 'description') {
      newEntries[index][field] = String(value);
    } else {
      newEntries[index].hours[field] = String(value);
    }
    setTimesheetEntries(newEntries);
  };

  const calculateRowTotalHours = (entry: TimesheetEntry) => {
    const dates = generateDates(startDate, 7); // Assuming this generates the dates you're interested in
    return dates.reduce((total, date) => {
      const hours = entry.hours[date.date] || 0; // Assuming entry.hours is an object with dates as keys
      return total + Number(hours);
    }, 0);
  };

  const calculateColumnTotalHours = (entries: TimesheetEntry[], date: string) => {
    return entries.reduce((total, entry) => {
      const hours = entry.hours[date] || 0; // Assuming entry.hours is an object with dates as keys
      return total + Number(hours);
    }, 0);
  };

  const deleteLastEntry = () => {
    setTimesheetEntries(timesheetEntries.slice(0, -1));
  };

  const fetchUnapprovedTimesheets = async () => {
    const response = await fetch('/api/timesheetsunapproved', {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      setUnapprovedTimesheets(data);
      console.log(data);
      // Handle the data as needed
    } else {
      console.error('Failed to fetch unapproved timesheets:', response.statusText);
    }
  };

  useEffect(() => {
    fetchUnapprovedTimesheets();
  }, [isAdmin]);

  useEffect(() => {
    const currentDate = new Date();
    const first = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1); // Adjust if your week start from Sunday
    const last = first + 6;

    const firstDayOfWeek = new Date(currentDate.setDate(first)).toISOString().split('T')[0];
    const lastDayOfWeek = new Date(currentDate.setDate(last)).toISOString().split('T')[0];

    setStartDate(firstDayOfWeek);
    setEndDate(lastDayOfWeek);
  }, []);

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
    const fetchProjects = async () => {
      const projectResponse = await fetch('/api/fetchproject', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (projectResponse.ok) {
        const projects = await projectResponse.json();

        const activeProjects: Project[] = projects.filter((project: Project) => project.project_status === 'Active' || project.project_status === 'Overhead');

        setProjects(activeProjects);
      }
    };

    fetchEmployee();
    fetchProjects();
  }, []);

  const handleSelect = (value: string) => {
    const timesheet = unapprovedTimesheets?.find((timesheet) => timesheet._id === value);
    if (timesheet) {
      setTeamsheetid(timesheet._id);
      setTimesheetEntries(timesheet.weekEntries);
      setFetchedTimeSheet(true);
      setEmployeeName(timesheet.employeeCode.employee_name);
      const dateDM = Object.keys(timesheet.weekEntries[0].hours)[0]; // "DD/MM"
      const [day, month] = dateDM.split('/');
      const year = new Date().getFullYear(); // Use current year or set a specific year
      const dateYMD = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // "YYYY-MM-DD"
      setStartDate(dateYMD);
    }
  };

  const handleApprove = async () => {
    const timesheetApproveResponse = await fetch('/api/handleapprove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timesheetid: teamsheetid,
      }),
    });
    if (timesheetApproveResponse.ok) {
      const data = await timesheetApproveResponse.json();
      alert("Successfully approved timesheet.")
      // Handle success
    } else {
      console.error('Failed to approve timesheet:', timesheetApproveResponse.statusText);
      // Handle failure
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))',
      }}>
      <Navbar />
      <div className="mx-auto p-4 bg-white rounded-lg shadow-lg mt-4 w-[80%]">
        {isAdmin ? (
          <>
            <label htmlFor="timesheet" className="block text-gray-700 text-sm font-bold mb-2">
              Select Timesheet for Approval:
            </label>
            <select id="timesheet" className="mb-4 w-full text-black border border-black p-2" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelect(e.target.value)}>
              <option value="">Select Timesheet</option>
              {unapprovedTimesheets?.map((timesheet) => (
                <option key={timesheet._id} value={timesheet._id}>
                  {timesheet.employeeCode.employee_name} - {Object.keys(timesheet.weekEntries[0].hours)[0]}
                </option>
              ))}
            </select>
          </>
        ) : null}
        <div className="flex flex-row space-x-8">
          <div className="flex flex-col w-1/2">
            <div className="mb-4">
              <label htmlFor="employee_name" className="block text-gray-700 text-sm font-bold mb-2">
                Employee Name:
              </label>
              <input
                type="text"
                value={isAdmin ? employeeName : employee?.employee_name}
                disabled
                placeholder="Employee Name"
                id="employee_name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Tailwind CSS classes
              />
            </div>
            <div className="mb-4">
              <label htmlFor="week_start" className="block text-gray-700 text-sm font-bold mb-2">
                Week Start:
              </label>
              <input
                type="date"
                id="week_start"
                disabled={isAdmin}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={(e) => {
                  if (!isMonday(e.target.value)) {
                    const previousMonday = findPreviousMonday(e.target.value);
                    setStartDate(previousMonday);
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="week_end" className="block text-gray-700 text-sm font-bold mb-2">
                Week End:
              </label>
              <input
                type="date"
                id="week_end"
                disabled={isAdmin}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Tailwind CSS classes
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                readOnly // Make the end date input read-only since it's automatically calculated
              />
            </div>
          </div>
          <div className="w-1/2 m-4 mt-6 text-black flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-4 font-bold">Summary</h1>
            <table className="h-full table-auto w-full text-black border border-black">
              <thead className="border-black border">
                <tr className="border border-black">
                  <th className="border border-black">Project/Overhead</th>
                  <th className="border border-black">WFO</th>
                  <th className="border border-black">WFH</th>
                  <th className="border border-black">Total</th>
                </tr>
              </thead>
              <tbody className="border border-black">
                {/* Render Project Rows */}
                <tr className="border border-black">
                  <td className="border border-black text-center">Projects</td>
                  <td className="border border-black text-center">{summary.Project.WFO}</td>
                  <td className="border border-black text-center">{summary.Project.WFH}</td>
                  <td className="border border-black text-center">{summary.Project.Total}</td>
                </tr>
                <tr className="border border-black">
                  <td colSpan={1} className="border border-black text-center">
                    Others
                  </td>
                  <td colSpan={3} className="border border-black text-center">
                    {summary.Others.Total}
                  </td>
                </tr>
                <tr className="border border-black">
                  <td colSpan={1} className="border border-black text-center">
                    Leave
                  </td>
                  <td colSpan={3} className="border border-black text-center">
                    {summary.Leave.Total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button onClick={addTimesheetEntry} className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Entry
        </button>
        <button onClick={deleteLastEntry} className="my-4 mx-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete Last Entry
        </button>
        <table className="table-auto w-full text-black border border-black">
          <thead className="border-black border">
            <tr className="border border-black">
              <th className="border border-black">Project ID</th>
              <th className="border border-black">Project/Other</th>
              <th className="border border-black">Work Type</th>
              <th className="border border-black">Description</th>
              {generateDates(startDate, 7).map((date) => (
                <th key={date.date} className="border border-black">
                  <div>
                    <span>{date.day}</span>
                    <br />
                    <span>{date.date}</span>
                  </div>
                </th>
              ))}
              <th className="border border-black w-[6%]">Sum</th>
            </tr>
          </thead>
          <tbody className="border border-black">
            {timesheetEntries.map((entry, index) => (
              <tr key={index} className="border border-black">
                <td className="border border-black w-[8%]">
                  <select value={entry.projectId} onChange={(e) => handleEntryChange(index, 'projectId', e.target.value)}>
                    <option value="" disabled selected>
                      Select
                    </option>
                    {projects?.map((project) => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.project_id}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-black w-[8%]">
                  <select value={entry.projectName} onChange={(e) => handleEntryChange(index, 'projectName', e.target.value)}>
                    <option value="" disabled selected>
                      Select
                    </option>
                    {projects?.map((project) => (
                      <option key={project.project_name} value={project.project_name}>
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-black w-[8%]">
                  <select disabled={overheads.includes(entry.projectName)} value={entry.workType} onChange={(e) => handleEntryChange(index, 'workType', e.target.value)}>
                    <option value="" disabled selected>
                      Select
                    </option>
                    {workTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-black w-[14%]">
                  <input disabled={overheads.includes(entry.projectName)} type="text" value={entry.description} onChange={(e) => handleEntryChange(index, 'description', e.target.value)} className="w-full" />
                </td>
                {generateDates(startDate, 7).map((date) => (
                  <td key={date.date} className="border border-black w-[5%] text-center">
                    <div className="flex justify-center items-center h-full">
                      <input defaultValue={0} min={0} max={8} type="number" pattern="\d*" value={entry.hours[date.date] ?? '0'} onChange={(e) => handleEntryChange(index, date.date, parseInt(e.target.value))} className="w-full text-center" />
                    </div>
                  </td>
                ))}
                <td className="border border-black w-[5%] text-center">
                  <div className="flex justify-center items-center h-full">{calculateRowTotalHours(entry)}</div>
                </td>
              </tr>
            ))}
            <tr className="border border-black">
              <td colSpan={4} className="border border-black">
                <h1 className="text-lg px-2">&Sigma;</h1>
              </td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[0]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[1]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[2]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[3]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[4]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[5]?.date)}</td>
              <td className="border border-black text-center">{calculateColumnTotalHours(timesheetEntries, generateDates(startDate, 7)[6]?.date)}</td>
            </tr>
          </tbody>
        </table>
        {fetchedTimeSheet ? (
          <div className="flex flex-row space-x-4">
            <button
              onClick={handleUpdate}
              disabled={checkApprovalStatus} // Disable button if checkApprovalStatus is true
              className={`mt-4 ${checkApprovalStatus ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-700'} text-white font-bold py-2 px-4 rounded`}>
              Update Timesheet
            </button>
            {isAdmin && (
              <button
                onClick={handleApprove} // Assuming handleApprove is your method to approve the timesheet
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Approve Timesheet
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={checkApprovalStatus} // Disable button if checkApprovalStatus is true
            className={`mt-4 ${checkApprovalStatus ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}>
            Submit Timesheet
          </button>
        )}
      </div>
    </div>
  );
};

export default Timesheet;
