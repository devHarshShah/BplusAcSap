'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    employee_email: '',
    employee_pass: '',
    employee_branch: '',
    doj: '',
  });

  interface FormData {
    employee_id: string;
    employee_name: string;
    employee_email: string;
    employee_pass: string;
    employee_branch: string;
    doj: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Employee added successfully');
        // Reset form or handle success further
      } else {
        alert('Error: ' + JSON.stringify(data.errors));
        // Handle server validation errors
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the employee.');
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
        <h2 className="text-2xl m-4 text-white font-bold">Add Employee</h2>
        <form onSubmit={handleSubmit} className="w-[80%] mx-auto my-10 p-5 rounded-md shadow-lg bg-white">
          <div className="mb-4">
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input type="text" name="employee_id" id="employee_id" value={formData.employee_id} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input type="text" name="employee_name" id="employee_name" value={formData.employee_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="employee_email" className="block text-sm font-medium text-gray-700">
              Employee Email
            </label>
            <input type="email" name="employee_email" id="employee_email" value={formData.employee_email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="doj" className="block text-sm font-medium text-gray-700">
              Date of Joining
            </label>
            <input type="date" name="doj" id="doj" value={formData.doj} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="employee_pass" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input type="password" name="employee_pass" id="employee_pass" value={formData.employee_pass} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="employee_branch" className="block text-sm font-medium text-gray-700">
              Branch
            </label>
            <select name="employee_branch" id="employee_branch" value={formData.employee_branch} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 sm:text-sm text-black">
              <option value="">Select a branch</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
          <button type="submit" className="w-[12%] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E25037]">
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
