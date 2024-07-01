import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the ProjectDocument interface based on your schema
interface ProjectDocument extends Document {
  project_id: string;
  project_name: string;
  project_revenue?: number; // Optional due to `required: false`
  project_status: string;
  project_allocated_expense?: number; // Optional due to `required: false`
  expense_entry: mongoose.Types.ObjectId;
}

// Define the projectSchema
const projectSchema = new Schema<ProjectDocument>({
  project_id: { type: String, required: true },
  project_name: { type: String, required: true },
  project_revenue: { type: Number, required: false },
  project_status: { type: String, required: true, enum: ['Active', 'Inactive', 'Completed', 'Cancelled', 'Overhead'] },
  project_allocated_expense: { type: Number, required: false },
  expense_entry: { type: Schema.Types.ObjectId, ref: 'Expenses' }
});

// Attempt to retrieve the model, creating it if it doesn't exist
let Project: Model<ProjectDocument>;

try {
    Project = mongoose.model<ProjectDocument>('Project');
} catch (error) {
    Project = mongoose.model<ProjectDocument>('Project', projectSchema);
}

export default Project;