"use client";
import { useEffect, useState } from 'react';

interface Employee {
  employee_name: string;
  // Add more properties as needed
}

const Dashboard = () => {
  // State to store the fetched employee details
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      Dashboard
      <div>
        {/* Render your employee details here */}
        {employeeDetails && (
          <div>
            {/* Assuming employeeDetails is an object. Adjust based on actual structure */}
            <p>Employee Name: {employeeDetails.employee_name}</p>
            {/* Add more fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;