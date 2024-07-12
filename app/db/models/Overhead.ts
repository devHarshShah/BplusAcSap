import mongoose, { Document, Model, Schema } from 'mongoose';

interface OverheadDocument extends Document {
  employee: mongoose.Types.ObjectId;
  expense_type: string;
  amount: number;
}

const overheadSchema = new Schema<OverheadDocument>({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  expense_type: { type: String, required: true },
  amount: { type: Number, required: true }
});

let Overhead: Model<OverheadDocument>;

try {
  Overhead = mongoose.model<OverheadDocument>('Overhead');
} catch (error) {
  Overhead = mongoose.model<OverheadDocument>('Overhead', overheadSchema);
}

export default Overhead;