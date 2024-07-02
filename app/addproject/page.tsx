'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const AddProject = () => {
  const [formData, setFormData] = useState({
    project_id: '',
    project_name: '',
    project_revenue: '',
    project_status: '',
    project_allocated_expense: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addproject', {
        // Replace '/api/path-to-your-endpoint' with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Project added successfully');
        // Handle success
      } else {
        alert('Error: ' + JSON.stringify(data.errors));
        // Handle server validation errors
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the project.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'radial-gradient(circle 72rem at 80% 75%, rgb(226, 80, 55), rgb(113, 40, 27))',
      }}>
      <Navbar />
      <div className="flex flex-col justify-center items-center text-black">
        <h1 className="text-2xl m-4 text-white font-bold">Add Project</h1>
        <form onSubmit={handleSubmit} className="m-4 p-6 w-[80%] mx-auto bg-white rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">
              Project ID
            </label>
            <input type="text" name="project_id" id="project_id" placeholder="Project ID" value={formData.project_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input type="text" name="project_name" id="project_name" placeholder="Project Name" value={formData.project_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="project_revenue" className="block text-sm font-medium text-gray-700">
              Project Revenue
            </label>
            <input type="text" name="project_revenue" id="project_revenue" placeholder="Project Revenue" value={formData.project_revenue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="project_status" className="block text-sm font-medium text-gray-700">
              Project Status
            </label>
            <select name="project_status" id="project_status" value={formData.project_status} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm text-black">
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="project_allocated_expense" className="block text-sm font-medium text-gray-700 ">
              Allocated Expense
            </label>
            <input type="number" name="project_allocated_expense" id="project_allocated_expense" placeholder="Allocated Expense" value={formData.project_allocated_expense} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 text-gray-700" />
          </div>

          <button type="submit" className="w-[10%] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E25037] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
