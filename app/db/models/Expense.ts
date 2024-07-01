import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const expensesSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    expense_type: { type: String, required: true },
    amount: { type: Number, required: true }
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
