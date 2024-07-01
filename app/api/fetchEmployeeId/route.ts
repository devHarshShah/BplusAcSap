import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import Employee from '../../db/models/Employee';
import { verifyToken } from '../../middleware/verifyToken'; // Adjust the path as necessary
import { decodeJwt } from 'jose';

export default async function POST(req: NextRequest) {
  try {
    // First, verify the token
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }

    // Connect to the database
    await connectMongo();

    // Extract the employee ID from the verified token
    const tokenPayload = await req.cookies.get('token');
    const jwt = tokenPayload?.value; // Adjust according to how you've structured your token payload
    const employeeId = jwt ? decodeJwt(jwt).id : undefined;
    
    return NextResponse.json({ employeeId: employeeId }, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export {POST}

// Make sure to use this function as an API route handler in your Next.js application