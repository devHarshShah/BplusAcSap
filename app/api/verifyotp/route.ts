import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import Otp from '../../db/models/Otp'; // Assuming this is the path to your Otp model
import Employee from '../../db/models/Employee'; // Assuming this is the path to your Employee model

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userEmail, enteredOtp } = await req.json(); // Extract enteredOtp and userEmail from request

    await connectMongo(); // Connect to MongoDB

    // Search the employee database for a matching employee_email
    const employee = await Employee.findOne({ employee_email: userEmail });

    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 }); // Employee not found
    }

    // Search the OTP collection for a matching OTP and userEmail
    const otpRecord = await Otp.findOne({
      otp: enteredOtp,
      employee: employee._id,
    });

    if (!otpRecord) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 }); // OTP not found or doesn't match
    }

    // Optionally, verify OTP expiration here if you have a timestamp in your OTP model

    // If OTP is valid and not expired, proceed with the intended action
    // For example, mark the OTP as used or delete it to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 }); // OTP verified successfully
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}
