const Quotation = require('../../models/quotationModel');
const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile } = require("../../utils/cloudinary");
// Create new quotation
router.post('/create-quotation', async (req, res) => {
  try {
    const quotation = new Quotation({
      ...req.body, // Include all fields from req.body
      terms: req.body.terms // Explicitly include terms field
    });
    await quotation.save();
    res.status(201).json({ message: "Quotation created successfully", quotation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating quotation' });
  }
});

// Get all quotations
router.get('/getAll-quotation', async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.status(200).json({message:"fetch quotations success",quotations});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quotations' });
  }
});
// Get quotation by ID
router.get('/:quotationId/get-quotation', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.quotationId);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.status(200).json(quotation); // Ensure terms are included in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quotation' });
  }
});
// Edit quotation by ID
router.put('/:quotationId/edit-quotation', async (req, res) => {
  try {
    const { quotationId } = req.params;
    const {
      title,
      quotationNumber,
      quotationDate,
      validTill,
      businessLogo,
      sender,
      client,
      items,
      descriptionField,
      terms // Include terms in the request
    } = req.body;

    if (!quotationNumber || !quotationDate || !validTill) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Find the existing quotation by ID
    const existingQuotation = await Quotation.findById(quotationId);
    if (!existingQuotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    // Update fields
    existingQuotation.title = title;
    existingQuotation.quotationNumber = quotationNumber;
    existingQuotation.quotationDate = quotationDate;
    existingQuotation.validTill = validTill;
    existingQuotation.sender = sender;
    existingQuotation.client = client;
    existingQuotation.items = items;
    existingQuotation.descriptionField = descriptionField;
    existingQuotation.terms = terms; // Update terms

    // Check if new images are provided, and replace the existing ones if so
    if (businessLogo) {
      await deleteFile(existingQuotation.businessLogo); // Delete old image from Cloudinary
      existingQuotation.businessLogo = await uploadFile(businessLogo); // Upload new image
    }
    if (client.businessImage) {
      await deleteFile(existingQuotation.client.businessImage);
      existingQuotation.client.businessImage = await uploadFile(client.businessImage);
    }
    if (descriptionField.attachment) {
      await deleteFile(existingQuotation.descriptionField.attachment);
      existingQuotation.descriptionField.attachment = await uploadFile(descriptionField.attachment);
    }
    // Handle multiple items and their images
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].thumbnailImage) {
          await deleteFile(existingQuotation.items[i].thumbnailImage); // Delete old image
          existingQuotation.items[i].thumbnailImage = await uploadFile(items[i].thumbnailImage); // Upload new image
        }
      }
    }

    // Save the updated quotation
    await existingQuotation.save();

    res.status(200).json({ message: 'Quotation updated successfully', updatedQuotation: existingQuotation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update quotation', error: error.message });
  }
});

// Delete quotation by ID
router.delete('/:quotationId/delete-quotation', async (req, res) => {
  const { quotationId } = req.params;
  try {
    const quotation = await Quotation.findOne({ _id: quotationId });

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Delete business logo if exists
    if (quotation.businessLogo) {
      await deleteFile(quotation.businessLogo);
    }

    // Delete client's business image if exists
    if (quotation.client && quotation.client.businessImage) {
      await deleteFile(quotation.client.businessImage);
    }
    if (quotation.descriptionField && quotation.descriptionField.attachment) {
      await deleteFile(quotation.descriptionField.attachment);
    }
    // Delete thumbnail images for items if exists
    if (quotation.items && quotation.items.length) {
      for (let item of quotation.items) {
        if (item.thumbnailImage) {
          await deleteFile(item.thumbnailImage);
        }
      }
    }

    // Finally, delete the quotation from the database
    await Quotation.deleteOne({ _id: quotationId });

    return res.status(200).json({ message: 'Quotation deleted successfully', quotation });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete quotation', error: error.message });
  }
});

// Route to delete a file (image/video) from a quotation
router.post('/delete_file_cloudinary', async (req, res) => {
  try {
    const { name, fileUrl, quotationId } = req.body;

    const existingQuotation = await Quotation.findOne({ _id: quotationId });
    if (!existingQuotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    await deleteFile(fileUrl);
    existingQuotation[name] = "";

    await existingQuotation.save();

    res.status(200).json({ message: "Media Deleted Successfully", updatedQuotation: existingQuotation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete media", error: error.message });
  }
});

module.exports = router;
