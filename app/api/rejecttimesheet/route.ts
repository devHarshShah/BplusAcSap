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

    await sendRejectionEmail(reason, dateRange, receiver); // Assuming your email utility function accepts reason and dateRange

    return NextResponse.json({ message: 'Successfully sent email.' }, { status: 200 }); // Return the updated timesheet
  } catch (error) {
    console.error(error); // Log error
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 }); // Internal server error
  }
}