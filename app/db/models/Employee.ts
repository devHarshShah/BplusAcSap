import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the EmployeeDocument interface based on your schema
interface EmployeeDocument extends Document {
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_pass: string;
  employee_branch: 'Mumbai' | 'Ahmedabad' | 'Hyderabad';
  doj: Date;
  cost_rate_per_hour_rs: number;
  overhead_expenses: Array<mongoose.Types.ObjectId>;
  timesheet: Array<mongoose.Types.ObjectId>;
  leave: Array<mongoose.Types.ObjectId>;
}

// Define the employeeSchema
const employeeSchema = new Schema<EmployeeDocument>({
  employee_id: { type: String, required: true },
  employee_name: { type: String, required: true },
  employee_email: { type: String, required: true },
  employee_pass: { type: String, required: true },
  employee_branch: { type: String, enum: ['Mumbai', 'Ahmedabad', 'Hyderabad'], required: true },
  doj: { type: Date, required: false },
  cost_rate_per_hour_rs: { type: Number, required: false },
  overhead_expenses: [{ type: Schema.Types.ObjectId, ref: 'Overhead' }],
  timesheet: [{ type: Schema.Types.ObjectId, ref: 'Overhead' }],
  leave: [{ type: Schema.Types.ObjectId, ref: 'Leave' }]
});

// Attempt to retrieve the model, creating it if it doesn't exist
let Employee: Model<EmployeeDocument>;

try {
    Employee = mongoose.model<EmployeeDocument>('Employee');
} catch (error) {
    Employee = mongoose.model<EmployeeDocument>('Employee', employeeSchema);
}

export default Employee;