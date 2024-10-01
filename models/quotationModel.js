const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  title: { type: String,  },
  quotationNumber: { type: String,  },
  quotationDate: { type: Date,  },
  validTill: { type: Date,  },
  businessLogo: { type: String,  },
  sender: {
    name: { type: String,  },
    email: { type: String,  },
    phone: { type: String,  },
    city: { type: String,  },
    postalCode: { type: String,  },
    country: { type: String,  }
  },
  client: {
    businessImage: { type: String,  },
    name: { type: String,  },
    email: { type: String, },
    industry: { type: String,  },
    city: { type: String,  },
    country: { type: String,  }
  },
  items: [{
    itemName: { type: String,  },
    quantity: { type: Number,  },
    rate: { type: Number,  },
    amount: { type: Number,  },
    description: { type: String },
    thumbnailImage: { type: String }
  }],
  descriptionField: {
    description: { type: String,  },
    email: { type: String,  },
    phone: { type: String,  },
    attachment: { type: String,  },
    label: { type: String,  },
    inputText: { type: String,  }
  },
  terms: [{ type: String }] // Array of terms as strings
});

const Quotation = mongoose.model('Quotation', QuotationSchema);
module.exports = Quotation;
