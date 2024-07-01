import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/app/middleware/verifyToken';
import * as yup from 'yup';
import Employee from '../../db/models/Employee';

// Define the validation schema
const employeeSchema = yup.object({
  employee_id: yup.string().required(),
  employee_name: yup.string().required(),
  employee_email: yup.string().email().required(),
  employee_pass: yup.string().min(5).required(),
  employee_branch: yup.string().oneOf(['Mumbai', 'Ahmedabad', 'Hyderabad']).required(),
});

export default async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }
    // Validate the input against the schema

    const body = await req.json();
    console.log(body);

    const validatedData = await employeeSchema.validate(body);

    // Connect to the database
    const db = await connectMongo();

    const existingEmployee = await Employee.findOne({ employee_email: validatedData.employee_email });
    if (existingEmployee) {
      return NextResponse.json({ errors: ['Email already in use'] }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.employee_pass, salt);

    // Create the employee
    const employee = new Employee({
      ...validatedData,
      employee_pass: hashedPassword,
    });

    // Save the employee to the database
    await employee.save();

    // Send the response
    return NextResponse.json({ message: 'Employee created successfully', employee }, { status: 201 });
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