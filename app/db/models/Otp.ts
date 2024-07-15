import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the OtpDocument interface based on your schema
interface OtpDocument extends Document {
  otp: string;
  employee: mongoose.Types.ObjectId; // Reference to Employee
  createdAt: Date; // To automatically expire the OTP
  isValid: boolean; // To mark the OTP as used or unused
}

// Define the otpSchema
const otpSchema = new Schema<OtpDocument>({
  otp: { type: String, required: true },
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // OTP expires after 5 minutes
  isValid: { type: Boolean, default: true },
});

// Attempt to retrieve the model, creating it if it doesn't exist
let Otp: Model<OtpDocument>;

try {
  Otp = mongoose.model<OtpDocument>('Otp');
} catch (error) {
  Otp = mongoose.model<OtpDocument>('Otp', otpSchema);
}

export default Otp;