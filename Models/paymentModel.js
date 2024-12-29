const mongoose = require("mongoose");

const PaymentDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentNumber: {
      type: String,
      default: "",
    },
    phonePayNumber: {
      type: String,
      default: "",
    },
    gpayNumber: {
      type: String,
      default: "",
    },
    bankDetails: {
      accountNumber: { type: String, default: "" },
      IFSC: { type: String, default: "" },
      bankName: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const PaymentDetails = mongoose.model("PaymentDetails", PaymentDetailsSchema);
module.exports = PaymentDetails;
