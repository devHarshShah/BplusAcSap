const axios = require('axios');

const employees = [
  {
    employee_id: '1',
    employee_name: 'Sameer Shah',
    employee_email: 'shahs@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '51',
    employee_name: 'Vidhyadhar Bommeri',
    employee_email: 'bommeriv@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Hyderabad',
  },
  {
    employee_id: '2',
    employee_name: 'Rupesh Maurya',
    employee_email: 'mauryar@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '3',
    employee_name: 'Bhoomi Naik',
    employee_email: 'naikb@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '4',
    employee_name: 'Shilpa Ghadi',
    employee_email: 'ghadis@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '5',
    employee_name: 'Rahil Shaikh',
    employee_email: 'shaikhr@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '6',
    employee_name: 'Dhaval Mehta',
    employee_email: 'mehtad@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '7',
    employee_name: 'Abha Kachaliya',
    employee_email: 'kachaliyaa@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '8',
    employee_name: 'Aniket Ghule',
    employee_email: 'ghulea@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '52',
    employee_name: 'Madhav Reddy',
    employee_email: 'reddym@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Hyderabad',
  },
  {
    employee_id: '9',
    employee_name: 'Faisal Kadiwala',
    employee_email: 'kadiwalaf@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '10',
    employee_name: 'Kunal Thakur',
    employee_email: 'thakurk@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '101',
    employee_name: 'Ronak Shah',
    employee_email: 'shahr@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Ahmedabad',
  },
  {
    employee_id: '11',
    employee_name: 'Kishori Jain',
    employee_email: 'jaink@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '102',
    employee_name: 'Utsav Mevada',
    employee_email: 'mevadau@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Ahmedabad',
  },
  {
    employee_id: '12',
    employee_name: 'Akshay Thakur',
    employee_email: 'thakura@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
  {
    employee_id: '13',
    employee_name: 'Meet Shah',
    employee_email: 'shahm@bplusac.com',
    employee_pass: 'defaultPass123',
    employee_branch: 'Mumbai',
  },
];
async function addEmployee(employee) {
  try {
    const response = await axios.post('http://localhost:3000/api/addemployee', employee);
    console.log(`Added employee: ${employee.employee_name}, Response status: ${response.status}`);
  } catch (error) {
    console.error(`Error adding employee: ${employee.employee_name}, Error: ${error.message}`);
  }
}

async function addAllEmployees() {
  for (const employee of employees) {
    await addEmployee(employee);
  }
}

addAllEmployees();
