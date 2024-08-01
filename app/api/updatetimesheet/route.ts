import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import TimesheetWeek from '../../db/models/Timesheet';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { timeSheetId, weekEntries, total } = await req.json(); // Extract employeeCode and mondayDate from request

    await connectMongo(); // Connect to MongoDB

    // Assuming weekEntries is an object like { hoursWorked: 40, project: "New Project" }
    const timeSheetUpdated = await TimesheetWeek.findByIdAndUpdate(timeSheetId, { weekEntries: weekEntries, total: total}, { new: true });

    if (timeSheetUpdated) {
      return NextResponse.json(timeSheetUpdated);
    } else {
      return NextResponse.json({ message: 'Timesheet not found' }, { status: 404 }); // Timesheet not found
    }
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}
