import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface IWeekEntry {
  description: string;
  hours: Map<string, string>;
  projectId: string;
  projectName: string;
  workType: string;
}

interface ITimesheetWeekDocument extends Document {
  weekEntries: IWeekEntry[];
  approved: boolean;
  saved: boolean;
  employeeCode: Types.ObjectId;
}

const WeekEntrySchema = new Schema<IWeekEntry>({
  description: { type: String, required: false },
  hours: {
    type: Map,
    of: String,
  },
  projectId: { type: String, required: false },
  projectName: { type: String, required: false },
  workType: { type: String, required: false },
});

const TimesheetWeekSchema = new Schema<ITimesheetWeekDocument>({
  weekEntries: [WeekEntrySchema], // Array of week entries
  approved: { type: Boolean, required: false, default: false },
  saved: { type: Boolean, required: false, default: false },
  employeeCode: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Employee' // Assuming 'Employee' is the name of your employee model
  },
});

let TimesheetWeek: Model<ITimesheetWeekDocument>;

try {
  TimesheetWeek = mongoose.model<ITimesheetWeekDocument>('TimesheetWeek');
} catch (error) {
  TimesheetWeek = mongoose.model<ITimesheetWeekDocument>('TimesheetWeek', TimesheetWeekSchema);
}

export default TimesheetWeek;
