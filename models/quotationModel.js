const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    title: { type: String,  }, // Assuming title is required
    quotationNumber: { type: String,  }, // Ensure required if needed
    quotationDate: { type: Date,  },
    validTill: { type: Date,  },
    businessLogo: { type: String },
    sender: {
      name: { type: String,  },
      email: { type: String,  },
      phone: { type: String,  },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    
    client: {
      businessImage: { type: String },
      name: { type: String,  },
      email: { type: String,  },
      industry: { type: String }, // Added industry
      city: { type: String },
      country: { type: String },
    },
    
    items: [
      {
        itemName: { type: String,  },
        quantity: { type: Number,  },
        rate: { type: Number,  },
        amount: { type: Number,  }, // Usually calculated based on quantity * rate
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
