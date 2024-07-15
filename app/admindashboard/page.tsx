'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProjectAnalysis from '../components/ProjectAnalysis';

interface Leave {
  _id: string;
  employee_id: {
    employee_name: string;
    employee_branch: string;
    employee_id: string;
    available_leaves: { annual: number; sick: number };
  };
  start_date: string;
  end_date: string;
  reason: string;
  duration_type: string;
}

interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  project_status: string;
}

interface Employee {
  employee_name: string;
  employee_branch: string;
  employee_id: string;
  available_leaves: { annual: number; sick: number };
}

const AdminDashboard = () => {
  const [unapprovedLeaves, setUnapprovedLeaves] = useState<Leave[]>([]);
  const [projects, setProjects] = useState<Project[]>();
  const [employees, setEmployees] = useState<Employee[]>();
  useEffect(() => {
    const fetchUnapprovedLeaves = async () => {
      try {
        const response = await fetch('/api/leaveunapproved');
        const responseData = await response.json();
        if (!response.ok) {
          if (responseData.redirectTo) {
            window.location.href = responseData.redirectTo;
          }
        }
        if (response.status === 404) {
          setUnapprovedLeaves([]);
          return;
        }
        const data = await response.json();
        setUnapprovedLeaves(data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/fetchproject');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchemployee = async () => {
      try {
        const response = await fetch('/api/fetchallemployee');
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchemployee();
    fetchProjects();
    fetchUnapprovedLeaves();
  }, []);

  const handleApprove = async (event: React.MouseEvent<HTMLButtonElement>, leaveid: string) => {
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
      <div className="flex flex-col bg-white w-[95%] h-[80%] mx-auto my-auto p-5 rounded-xl text-black">
        <div className="flex flex-row p-2 space-x-8">
          <div className="w-1/2 p-2 border border-black rounded-xl">
            <h1 className="text-2xl font-bold">Unapproved Leaves</h1>
            {unapprovedLeaves?.length === 0 ? (
              <div>No unapproved leaves</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {unapprovedLeaves?.map((leave) => (
                  <div key={leave._id} className="py-2 hover:bg-gray-50 flex flex-row items-center justify-between">
                    <div className="flex-shrink pr-2 truncate">{leave.employee_id.employee_name}</div>
                    <div className="flex-shrink pl-1 pr-2">
                      <strong>A:</strong>
                      {leave.employee_id.available_leaves.annual} <strong>S:</strong>
                      {leave.employee_id.available_leaves.sick}
                    </div>
                    <div className="flex-shrink pr-2 pl-2">{leave.duration_type}</div>
                    <div className="flex-shrink pr-2 pl-2">
                      {new Date(leave.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}
                      {leave.duration_type === 'Full Day' ? ` - ${new Date(leave.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}` : ''}
                    </div>
                    <div className="flex-shrink pr-2 pl-2 truncate">{leave.reason}</div>
                    <div>
                      <button className="w-full md:w-auto px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out" onClick={(e) => handleApprove(e, leave._id)}>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/5 p-2 border border-black rounded-xl">
            <h1 className="text-2xl font-bold">Projects</h1>
            {projects?.length === 0 ? (
              <div>No projects</div>
            ) : (
              <div className="divide-y divide-gray-200 overflow-y-scroll h-[250px]">
                {projects
                  ?.filter((project) => project.project_status === 'Active')
                  .map((project) => (
                    <div key={project._id} className="py-2 hover:bg-gray-50 flex flex-row items-center justify-between">
                      <div className="flex-2 truncate p-2">{project.project_name}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="w-[30%] p-2 border border-black rounded-xl">
            <h1 className="text-2xl font-bold">Employees</h1>
            {employees?.length === 0 ? (
              <div>No employees</div>
            ) : (
              <div className="divide-y divide-gray-200 overflow-y-scroll h-[250px]">
                {employees?.map((employee) => (
                  <div key={employee.employee_id} className="py-2 hover:bg-gray-50 flex flex-row items-center justify-between">
                    <div className="flex-1 truncate px-2">{employee.employee_name}</div>
                    <div className="flex-1 px-2 text-center">{employee.employee_branch}</div>
                    <div className="flex-1 px-2 flex flex-row justify-end items-center">
                      <span className="font-semibold">A:</span>
                      <span className="ml-1 mr-3">{employee.available_leaves.annual}</span>
                      <span className="font-semibold">S:</span>
                      <span className="ml-1">{employee.available_leaves.sick}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ProjectAnalysis projects={projects} />
      </div>
    </div>
  );
};

export default AdminDashboard;
