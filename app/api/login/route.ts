import { NextResponse, NextRequest } from 'next/server';
import { SignJWT } from 'jose';
import connectMongo from '@/app/db/connectToDb';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import Employee from '../../db/models/Employee';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

const loginSchema = yup.object({
  employee_email: yup.string().email().required(),
  employee_pass: yup.string().min(5).required(),
});

export async function POST(req: NextRequest) {
  try {
    // Validate the input against the schema
    const body = await req.json();
    const validatedData = await loginSchema.validate(body);

    // Connect to the database
    await connectMongo();

    const existingEmployee = await Employee.findOne({ employee_email: validatedData.employee_email });
    if (!existingEmployee) {
      return NextResponse.json({ errors: ['Email does not exist'] }, { status: 400 });
    } else {
        const isMatch = await bcrypt.compare(validatedData.employee_pass, existingEmployee.employee_pass);
        if (!isMatch) {
          return NextResponse.json({ errors: ['Invalid password'] }, { status: 400 });
        }
    }

const token = await new SignJWT({ id: existingEmployee.employee_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Set expiration to 1 hour
      .sign(key);

    // Create the response and set the cookie
    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    response.cookies.set('token', token, { path: '/' });

    return response;
  } catch (error) {
    // Handle validation errors and other errors
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}