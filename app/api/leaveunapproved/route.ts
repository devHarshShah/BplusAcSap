import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import Leave from '../../db/models/Leave';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    await connectMongo(); // Connect to MongoDB

    // Fetch timesheets for the employee
    const leaves = await Leave.find({ status: 'Pending' }).populate('employee_id', 'employee_name employee_branch employee_id');

    if (leaves.length !== 0) {
      return NextResponse.json(leaves); // Return the matching timesheet
    } else {
      return NextResponse.json({ message: 'All leaves approved' }); // Timesheet not found
    }
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}
