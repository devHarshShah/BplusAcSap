import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import TimesheetWeek from '../../db/models/Timesheet';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    await connectMongo(); // Connect to MongoDB

    // Fetch timesheets for the employee
    const timesheets = await TimesheetWeek.find({ approved: false, total: { $gte: 40 } }).populate('employeeCode', 'employee_name employee_branch employee_id');

    if (timesheets.length !== 0) {
      return NextResponse.json(timesheets); // Return the matching timesheet
    } else {
      return NextResponse.json({ message: 'All timesheets approved' }); // Timesheet not found
    }
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}
