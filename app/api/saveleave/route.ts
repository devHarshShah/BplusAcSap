import { NextResponse, NextRequest } from 'next/server';
import connectMongo from '@/app/db/connectToDb';
import { verifyToken } from '@/app/middleware/verifyToken';
import Leave from '@/app/db/models/Leave';
import Employee from '@/app/db/models/Employee'; // Assuming this is the model for employees
import * as yup from 'yup';
import sendCustomEmail from '@/app/sendEmail';

// Define the validation schema for the leave form
const leaveFormSchema = yup.object({
  leave_type: yup.string().oneOf(['Annual', 'Sick']).required(),
  start_date: yup.string().required(),
  end_date: yup.string(),
  reason: yup.string().required(),
  duration: yup.number().required(),
  duration_type: yup.string().oneOf(['Full Day', 'Half Day', 'Quarter Day']).required(),
  employee_id: yup.string().required(),
  employee_branch: yup.string().required(),
  employee_name: yup.string().required()
});

export async function POST(req: NextRequest, res: NextResponse) {
    try {
      const verificationResponse = await verifyToken(req);
      if (verificationResponse.status !== 200) {
        return verificationResponse;
      }
  
      const body = await req.json();
      const validatedData = await leaveFormSchema.validate(body);
  
      await connectMongo();
  
      const { employee_branch, employee_name, ...leaveData } = validatedData;

      const reason = leaveData.reason;
  
      const leaveEntry = new Leave(leaveData);
  
      await leaveEntry.save();
  
      await Employee.findByIdAndUpdate(
        validatedData.employee_id,
        { $push: { leave: leaveEntry._id } },
        { new: true, runValidators: true }
      );
  
      // Determine the recipient based on the employee_branch
      let emailRecipients;
      if (employee_branch === 'Mumbai' || employee_branch === 'Hyderabad') {
        emailRecipients = 'shahs@bplusac.com';
      } else if (employee_branch === 'Ahmedabad') {
        emailRecipients = 'shahr@bplusac.com';
      }
  
      // Send the email if there are recipients determined
      if (emailRecipients) {
        const emailSubject = 'New Leave Request';
        const emailText = `A new leave request has been submitted by ${employee_name}. Please review it.`;
        const emailHtml = `<p>A new leave request has been submitted by <strong> ${employee_name} </strong> for reason <strong>${reason}</strong>. Please review it <a href="https://https://bplus-ac-sap.vercel.app/applyleave/admin">here</a>.</p>`;
        // Send the email
        await sendCustomEmail(emailRecipients, emailSubject, emailText, emailHtml);
      }
  
      // Send the response
      return NextResponse.json({ message: 'Leave request submitted successfully' },{ status: 200 });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
  }