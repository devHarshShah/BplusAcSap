import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import Employee from '@/app/db/models/Employee';
import * as yup from 'yup';
import TimesheetWeek from '../../db/models/Timesheet';

// Define the validation schema for the timesheet entry
const timesheetEntrySchema = yup.object({
  weekEntries: yup.array().of(
    yup.object({
      description: yup.string(),
      projectId: yup.string(),
      projectName: yup.string(),
      workType: yup.string(),
    })
  ),
  approved: yup.boolean(),
  employeeCode: yup.string().required(),
});

export default async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    // Parse and validate the request body against the schema
    const body = await req.json();
    const validatedData = await timesheetEntrySchema.validate(body);

    // Connect to the database
    await connectMongo();

    // Create a new timesheet entry with the validated data
    const timesheetEntry = new TimesheetWeek(validatedData);

    // Save the timesheet entry to the database
    const savedTimesheetEntry = await timesheetEntry.save();

    const employee = await Employee.findById(validatedData.employeeCode);

    if (!employee) {
      // Handle case where employee is not found
      console.error('Employee not found');
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    employee.timesheet.push(savedTimesheetEntry._id as import("mongoose").Types.ObjectId);

    await employee.save();

    // Send the response
    return NextResponse.json({ message: 'Timesheet entry saved successfully' }, { status: 201 });
  } catch (error) {
    // Handle validation errors and other errors
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export { POST };