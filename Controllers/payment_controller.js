const PaymentDetails = require("../Models/paymentModel");

// Create Payment Details
exports.createPaymentDetails = async (req, res) => {
  try {
    const { userId, paymentNumber, phonePayNumber, gpayNumber, bankDetails } = req.body;

    // Check if PaymentDetails already exists for the user
    const existingDetails = await PaymentDetails.findOne({ userId });
    if (existingDetails) {
      return res.status(400).json({ message: "Payment details already exist for this user." });
    }

    const newPaymentDetails = new PaymentDetails({
      userId,
      paymentNumber,
      phonePayNumber,
      gpayNumber,
      bankDetails,
    });

    const savedDetails = await newPaymentDetails.save();
    res.status(201).json({ message: "Payment details created successfully.", data: savedDetails });
  } catch (error) {
    console.error("Error creating payment details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getPaymentDetails = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Await the database query
      const payment = await PaymentDetails.findOne({ userId: userId });
  
      // Check if payment details exist
      if (!payment) {
        return res.status(404).json({ message: "Payment details not found for this user." });
      }
  
      // Return payment details
      res.status(200).json({ message: "Payment details retrieved successfully.", data: payment });
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
  

// Update Payment Details
exports.updatePaymentDetails = async (req, res) => {
    try {
      const { id } = req.params;  // Extracting 'id' from params
      const { paymentnumber, phonepaynumber, gpaynumber, bankDetails } = req.body;
  
      // Check if payment details already exist for the user
      const existingDetails = await PaymentDetails.findOne({ userId: id });  // Using 'id' here
      console.log("existingDetails" ,existingDetails);
      if (existingDetails) {
        // If payment details exist, update them
        const updatedDetails = await PaymentDetails.findOneAndUpdate(
          { userId: id },  // Using 'id' here as well
          { paymentNumber:paymentnumber, phonePayNumber:phonepaynumber, gpayNumber:gpaynumber, bankDetails },
          { new: true, runValidators: true }
        );
  
        return res.status(200).json({
          message: "Payment details updated successfully.",
          data: updatedDetails,
        });
      } else {
        // If payment details don't exist, create new ones
        const newPaymentDetails = new PaymentDetails({
          userId: id,  // Using 'id' here
          paymentNumber:paymentnumber,
          phonePayNumber:phonepaynumber,
          gpayNumber:gpaynumber,
          bankDetails,
        });
  
        const savedDetails = await newPaymentDetails.save();
        return res.status(201).json({
          message: "Payment details created successfully.",
          data: savedDetails,
        });
      }
    } catch (error) {
      console.error("Error updating or creating payment details:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
