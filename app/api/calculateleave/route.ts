import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/app/db/connectToDb";
import Employee from "@/app/db/models/Employee";

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  try {
    await connectMongo(); // Connect to the database
    const employees = await Employee.find({}); // Fetch all employees
    const employeeLeaveData = [];

    for (const employee of employees) {
      const doj = new Date(employee.doj); // Assuming 'doj' is stored in a suitable format
      const now = new Date();
      let monthsWorked = (now.getFullYear() - doj.getFullYear()) * 12 + now.getMonth() - doj.getMonth();
      let annualLeave = 0;
      let sickLeave = 0;

      if (monthsWorked > 12) {
        // If worked more than a year, calculate from the start of the current year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        monthsWorked = now.getMonth() + 1; // Months since start of the year
        annualLeave = 1.25 * monthsWorked;
        sickLeave = 0.5 * 12; // Full year sick leave
      } else {
        annualLeave = 1.25 * (monthsWorked+1);
        sickLeave = 0.5 * (12-monthsWorked+1);
      }

      // Update each employee document to include available_leave
      await Employee.updateOne(
        { _id: employee._id },
        {
          $set: {
            available_leaves: {
              annual: annualLeave,
              sick: sickLeave
            }
          }
        }
      );

      employeeLeaveData.push({
        employeeName: employee.employee_name,
        annualLeave,
        sickLeave
      });
    }

    return NextResponse.json(employeeLeaveData);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}