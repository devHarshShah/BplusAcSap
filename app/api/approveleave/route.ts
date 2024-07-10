import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import Leave from '../../db/models/Leave';
import sendCustomEmail from '@/app/sendEmail';
import { ObjectId } from 'mongodb'; // or wherever ObjectId is imported from in your project
import Employee from '@/app/db/models/Employee';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    const { leaveid } = await req.json(); // Extract employeeCode and mondayDate from request

    await connectMongo(); // Connect to MongoDB

    // Fetch timesheets for the employee
    const leave = await Leave.findByIdAndUpdate(leaveid, { status: 'Approved' }, { new: true }); // Replace 'employee_id' with the actual path in your Leave schema if it's different.
    const employee = await Employee.findById(leave?.employee_id); // Replace 'employee_id' with the actual path in your Leave schema if it's different.

    if(leave?.leave_type === 'Annual' && employee) {
        employee.available_leaves.annual -= leave.duration;
        await employee.save(); // Save the updated employee document
    } else if(leave?.leave_type === 'Sick' && employee) {
        employee.available_leaves.sick -= leave.duration;
        await employee.save(); // Save the updated employee document
    }

    const employeeEmail = employee?.employee_email; // Replace 'employee_email' with the actual field name in your Employee schema if it's different.

    if (employeeEmail) {
      const emailSubject = 'Leave Request Approved';
      const emailText = `Leave Request has been approved.`;
      const emailHtml = `<p>Leave request has been <strong>approved</strong>.</p>`;
      await sendCustomEmail(employeeEmail, emailSubject, emailText, emailHtml);
    }

    if (leave) {
      return NextResponse.json(leave); // Return the matching timesheet
    } else {
      return NextResponse.json({ message: 'Leave not found' }, { status: 404 }); // Timesheet not found
    }
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}