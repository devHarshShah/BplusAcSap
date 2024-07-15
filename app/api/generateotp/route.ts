import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import Employee from '../../db/models/Employee'; // Assuming this is the path to your Employee model
import Otp from '../../db/models/Otp'; // Assuming this is the path to your Otp model
import sendCustomEmail from '@/app/sendEmail';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
	const { userEmail } = await req.json(); // Extract userEmail from request

	await connectMongo(); // Connect to MongoDB

	// Search the employee database for a matching employee_email
	const employee = await Employee.findOne({ employee_email: userEmail });

	if (!employee) {
	  return NextResponse.json({ message: 'Employee not found' }, { status: 404 }); // Employee not found
	}

	// Generate a 4-digit OTP
	const otp = Math.floor(1000 + Math.random() * 9000).toString();

	// Store the OTP in the OTP collection with a reference to the found employee
	const newOtp = new Otp({
	  otp: otp,
	  employee: employee._id, // Reference to the employee
	});

	await newOtp.save(); // Save the OTP document

    await sendCustomEmail(userEmail, 'OTP Verification', `Your OTP is: ${otp} and is valid only for 5 minutes`, `<p>Your OTP is <strong>${otp}</strong> valid for 5 minutes`); // Send the OTP via email

	return NextResponse.json({ message: 'OTP generated successfully' }); // Success response
  } catch (error) {
	console.error(error); // Log error
	return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}