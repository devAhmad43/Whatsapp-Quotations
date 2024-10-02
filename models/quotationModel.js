const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Assuming title is required
    quotationNumber: { type: String, required: true }, // Ensure required if needed
    quotationDate: { type: Date, required: true },
    validTill: { type: Date, required: true },
    businessLogo: { type: String },
    
    // Linking quotation to a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure a quotation is linked to a user
    },
    
    sender: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    
    client: {
      businessImage: { type: String },
      name: { type: String, required: true },
      email: { type: String, required: true },
      industry: { type: String }, // Added industry
      city: { type: String },
      country: { type: String },
    },
    
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }, // Usually calculated based on quantity * rate
        description: { type: String },
        thumbnailImage: { type: String },
      },
    ],
    
    descriptionField: {
      description: { type: String },
      email: { type: String },
      phone: { type: String },
      attachment: { type: String },
      label: { type: String },
      inputText: { type: String },
    },
    
    terms: [{ type: String }], // Array of terms as strings
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Quotation = mongoose.model("Quotation", QuotationSchema);
module.exports = Quotation;
