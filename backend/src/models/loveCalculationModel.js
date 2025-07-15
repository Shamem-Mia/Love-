import mongoose from "mongoose";

const loveCalculationSchema = new mongoose.Schema({
  yourName: {
    type: String,
    required: true,
  },
  yourAge: {
    type: Number,
    required: true,
  },
  yourEducation: {
    type: String,
    required: true,
  },
  crushName: {
    type: String,
    required: true,
  },
  crushAge: {
    type: Number,
    required: true,
  },
  crushEducation: {
    type: String,
    required: true,
  },
  relationshipDays: {
    type: Number,
    default: 0,
  },
  relationshipMonths: {
    type: Number,
    default: 0,
  },
  lovePercentage: {
    type: Number,
    required: true,
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
  idPin: {
    type: String,
    required: true,
  },
});

const LoveCalculation = mongoose.model(
  "LoveCalculation",
  loveCalculationSchema
);

export default LoveCalculation;
