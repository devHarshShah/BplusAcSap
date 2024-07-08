import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the LeaveDocument interface based on your schema
interface LeaveDocument extends Document {
  employee_id: mongoose.Types.ObjectId; // Reference to the Employee
  leave_type: 'Annual' | 'Sick';
  duration_type: 'Full Day' | 'Half Day' | 'Quarter Day';
  start_date: Date;
  end_date: Date;
  duration: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

// Define the leaveSchema
const leaveSchema = new Schema<LeaveDocument>({
  employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leave_type: { type: String, enum: ['Annual', 'Sick'], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reason: { type: String, required: true }
});

// Attempt to retrieve the model, creating it if it doesn't exist
let Leave: Model<LeaveDocument>;

try {
	Leave = mongoose.model<LeaveDocument>('Leave');
} catch (error) {
	Leave = mongoose.model<LeaveDocument>('Leave', leaveSchema);
}

export default Leave;