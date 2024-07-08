// Assuming '@/app/db/connectToDb' and '@/app/db/models/Employee' are path aliases,
// you might need to replace them with relative or absolute paths.
const connectMongo = require('./app/db/connectToDb');
const Employee = require('./app/db/models/Employee');

async function addLeaveFieldToAllEmployees() {
  try {
    await connectMongo();

    // Update all employee documents to add an empty 'leave' array
    const updateResult = await Employee.updateMany({}, { $set: { leave: [] } });

    console.log(updateResult); // Log the result to see the outcome of the update operation
  } catch (error) {
    console.error('Failed to add leave field to employees:', error);
  }
}

// Call the function to perform the update
addLeaveFieldToAllEmployees();