import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import * as yup from 'yup';
import Project from '../../db/models/Project'; // Assuming the path to your Project model

// Define the validation schema using yup for project data
const projectSchema = yup.object({
  project_id: yup.string().required(),
  project_name: yup.string().required(),
  project_revenue: yup.number(),
  project_status: yup.string().required().oneOf(['Active', 'Completed', 'Cancelled', 'Inactive', 'Overhead']),
  project_allocated_expense: yup.number(),
  expense_entry: yup.string(), // Assuming expense_entry is a string representing ObjectId
});

export default async function POST(req: NextRequest, res: NextResponse) {
  try {
    const verificationResponse = await verifyToken(req);
    if (verificationResponse.status !== 200) {
      return verificationResponse; // If token verification fails, return the response from verifyToken
    }
    // Validate the input against the schema
    const body = await req.json();
    const validatedData = await projectSchema.validate(body);

    // Connect to the database
    await connectMongo();

    // Check if the project already exists
    const existingProject = await Project.findOne({ project_id: validatedData.project_id });
    if (existingProject) {
      return NextResponse.json({ errors: ['Project ID already in use'] }, { status: 400 });
    }

    // Create the project
    const project = new Project(validatedData);

    // Save the project to the database
    await project.save();

    // Send the response
    return NextResponse.json({ message: 'Project added successfully', project }, { status: 201 });
  } catch (error) {
    // Handle validation errors and other errors
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export {POST};