import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import bcrypt from 'bcrypt';
import Employee from '../../db/models/Employee'; // Assuming this is the path to your Employee model

export async function POST(req: NextRequest) {
  try {
	const { userEmail, newPassword } = await req.json(); // Extract userEmail and newPassword from request

	await connectMongo(); // Connect to MongoDB

	// Search the employee database for a matching employee_email
	const employee = await Employee.findOne({ employee_email: userEmail.toLowerCase() });

	if (!employee) {
	  return NextResponse.json({ message: 'Employee not found' }, { status: 404 }); // Employee not found
	}

	// Encrypt the new password
	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(newPassword, salt);

	// Update the employee's password in the database
	await Employee.updateOne({ _id: employee._id }, { $set: { employee_pass: encryptedPassword } });

	return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 }); // Password updated successfully
  } catch (error) {
	console.error(error); // Log error
	return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}