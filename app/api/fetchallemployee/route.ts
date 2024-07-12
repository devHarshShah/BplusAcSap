import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import Employee from '../../db/models/Employee';

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }
      // Connect to the database
      await connectMongo();

      // Fetch the list of all projects with only the project name and id
      const projects = await Employee.find({}, 'employee_name employee_branch employee_id available_leaves');

      // Send the response with the projects
      return new NextResponse(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      return new NextResponse(JSON.stringify({ message: 'An error occurred while fetching the projects' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    // Method Not Allowed
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405, headers: { 'Allow': 'GET' } });
  }
}