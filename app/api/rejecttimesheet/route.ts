import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/app/middleware/verifyToken';
import sendRejectionEmail from '@/app/sendEmail';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    const { dateRange, reason, receiver } = await req.json();

    let subject = 'Timesheet Rejected';
    let text = `Dear User,\n\nYour timesheet for the period ${dateRange} has been rejected due to the following reason:\n${reason}\n\nBest regards,\nThe Admin Team`;
    let html = `<p>Dear User,</p><p>Your timesheet for the period <strong>${dateRange}</strong> has been rejected due to the following reason:</p><p>${reason}</p><p>Best regards,<br>The Admin Team</p>`;

    await sendRejectionEmail(receiver, subject, text, html); // Assuming your email utility function accepts reason and dateRange

    return NextResponse.json({ message: 'Successfully sent email.' }, { status: 200 }); // Return the updated timesheet
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}