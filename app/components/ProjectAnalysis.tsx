'use client';
import React, { useEffect, useState } from 'react';
import { ObjectId } from 'mongoose';

interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  project_status: string;
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

interface Employee {
  employee_name: string;
  employee_branch: string;
  employee_id: string;
}

interface ProjectAnalysisProps {
  projects: Project[] | undefined;
}

interface Data {
  employeeName: string;
  hours: { [key: string]: string | null };
}

interface ProjectAnalysis {
  employeeName: string;
  data: { LTD: number; YTD: number; Month: number; Week: number };
}

const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [data, setData] = useState<Data[]>([]);
  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await fetch('/api/fetchalltimesheet');
        if (!response.ok) {
          throw new Error('Failed to fetch timesheets');
        }
        const data = await response.json();
        setTimesheets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimesheets();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData([]);
    setSelectedProject(e.target.value);
    timesheets.map((timesheet) => {
      timesheet.weekEntries.map((entry) => {
        if (entry.projectName === e.target.value) {
          setData((prevData) => [
            ...prevData,
            {
              employeeName: timesheet.employeeCode.employee_name,
              hours: entry.hours,
            },
          ]);
        }
      });
    });
  };

  const AnalyseProject = (data: Data[]) => {
    let projectAnalysisMap = new Map();

    data.forEach((entry) => {
      let employeeName = entry.employeeName;
      let hours = entry.hours;
      let LTD = 0;
      let YTD = 0;
      let Month = 0;
      let Week = 0;
      Object.keys(hours).forEach((key) => {
        if (hours[key] !== null) {
          let parts = key.split('/');
          let day = Number(parts[0]);
          let month = Number(parts[1]) - 1;
          let year = Number('20' + parts[2]);
          let date = new Date(year, month, day);
          let today = new Date();
          let startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          let endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          if (date.getFullYear() === today.getFullYear()) {
            YTD += parseInt(hours[key] as string);
            if (date.getMonth() === today.getMonth()) {
              Month += parseInt(hours[key] as string);
              if (date >= startOfWeek && date <= endOfWeek) {
                Week += parseInt(hours[key] as string);
              }
            }
          }
          LTD += parseInt(hours[key] as string);
        }
      });

      // Check if the employee already exists in the map
      if (projectAnalysisMap.has(employeeName)) {
        // Update existing entry
        let existingData = projectAnalysisMap.get(employeeName);
        existingData.LTD += LTD;
        existingData.YTD += YTD;
        existingData.Month += Month;
        existingData.Week += Week;
        projectAnalysisMap.set(employeeName, existingData);
      } else {
        // Add new entry
        projectAnalysisMap.set(employeeName, { LTD, YTD, Month, Week });
      }
    });

    // Convert the map back to an array
    let projectAnalysis = Array.from(projectAnalysisMap, ([employeeName, data]) => ({ employeeName, data }));
    //console.log(projectAnalysis);
    return projectAnalysis;
  };

  return (
    <div className="w-full p-4 my-8 border border-black rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Project Analysis</h1>
      <select className="mb-4 w-full text-black border border-black p-2 rounded-md" onChange={handleSelect}>
        <option value="">Select Project</option>
        {projects
          ?.filter((project) => project.project_status === 'Active')
          .map((project) => (
            <option key={project._id} value={project.project_name}>
              {project.project_name}
            </option>
          ))}
      </select>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Name
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              LTD
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              YTD
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Month
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Week
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                No data
              </td>
            </tr>
          ) : (
            AnalyseProject(data).map((analysis) => (
              <tr key={analysis.employeeName}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{analysis.employeeName}</td>
                <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">{analysis.data.LTD}</td>
                <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">{analysis.data.YTD}</td>
                <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">{analysis.data.Month}</td>
                <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">{analysis.data.Week}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectAnalysis;
