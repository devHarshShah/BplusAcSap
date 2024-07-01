import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import TimesheetWeek from '../../db/models/Timesheet';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    const { timesheetid } = await req.json(); // Extract employeeCode and mondayDate from request

    await connectMongo(); // Connect to MongoDB

    // Fetch timesheets for the employee
    const timesheet = await TimesheetWeek.findByIdAndUpdate(timesheetid, { approved: true }, { new: true });

    if (timesheet) {
      return NextResponse.json(timesheet); // Return the matching timesheet
    } else {
      return NextResponse.json({ message: 'Timesheet not found' }, { status: 404 }); // Timesheet not found
    }
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}
