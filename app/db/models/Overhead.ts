import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const overheadSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    expense_type: { type: String, required: true },
    amount: { type: Number, required: true }
});

const Overhead = mongoose.model('Overhead', overheadSchema);

module.exports = Overhead;
