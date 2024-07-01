const projects = [
  {
    project_id: '00000001',
    project_name: 'Annual Leave',
    project_status: 'Overhead',
  },
  {
    project_id: '00000002',
    project_name: 'Sick Leave',
    project_status: 'Overhead',
  },
  {
    project_id: '00000003',
    project_name: 'Public Holiday',
    project_status: 'Overhead',
  },
  {
    project_id: '00000004',
    project_name: 'Business Development',
    project_status: 'Overhead',
  },
  {
    project_id: '00000005',
    project_name: 'Admin',
    project_status: 'Overhead',
  },
  {
    project_id: '00000006',
    project_name: 'IT Outage',
    project_status: 'Overhead',
  },
  {
    project_id: '00000007',
    project_name: 'Bench',
    project_status: 'Overhead',
  },
  {
    project_id: '00000008',
    project_name: 'CPD',
    project_status: 'Overhead',
  },
];

const addProject = async (project: any) => {
  try {
    const response = await fetch('http://localhost:3000/api/addproject', {
      // replace with your actual endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error adding project:', error);
    } else {
      console.log('Project added successfully:', project.project_id);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

projects.forEach(addProject);
