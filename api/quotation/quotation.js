const Quotation = require("../../models/quotationModel");
const express = require("express");
const router = express.Router();
const { uploadFile, deleteFile } = require("../../utils/cloudinary");
// Create new quotation
router.post("/create-quotation", async (req, res) => {
  try {
    const quotation = new Quotation({
      ...req.body, // Include all fields from req.body
      terms: req.body.terms, // Explicitly include terms field
    });
    await quotation.save();
    res
      .status(201)
      .json({ message: "Quotation created successfully", quotation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quotation" });
  }
});
// Get all quotations
router.get("/getAll-quotation", async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.status(200).json({ message: "fetch quotations success", quotations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quotations" });
  }
});
// router.get("/:userId/getUserQuotation", async (req, res) => {
//   try {
//     const quotations = await Quotation.find({ user: req.params.userId });
//     res.status(200).json({ message: "fetch quotations success", quotations });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching quotations" });
//   }
// });
// Get quotation by ID
router.get("/:quotationId/get-quotation", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.quotationId);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.status(200).json(quotation); // Ensure terms are included in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quotation" });
  }
});
// // Edit quotation by ID
// router.put("/:quotationId/edit-quotation", async (req, res) => {
//   try {
//     const { quotationId } = req.params;
//     const {
//       title,
//       quotationNumber,
//       quotationDate,
//       validTill,
//       businessLogo,
//       sender,
//       client,
//       items,
//       descriptionField,
//       terms,
//     } = req.body;
//     if (!quotationNumber || !quotationDate || !validTill) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     // Find the existing quotation by ID
//     const existingQuotation = await Quotation.findById(quotationId);
//     if (!existingQuotation) {
//       return res.status(404).json({ message: "Quotation not found" });
//     }
//     // Update fields
//     existingQuotation.title = title;
//     existingQuotation.quotationNumber = quotationNumber;
//     existingQuotation.quotationDate = quotationDate;
//     existingQuotation.validTill = validTill;
//     existingQuotation.sender = sender;
//     existingQuotation.client = client;
//     existingQuotation.items = items;
//     existingQuotation.descriptionField = descriptionField;
//     existingQuotation.terms = terms; // Update terms
//     // Check if new images are provided, and replace the existing ones if so
//     console.log(businessLogo)
//     console.log(newBusinessLogoUrl)
//     if (businessLogo) {
//       // New logo is provided, upload the new logo and delete the old one
//       const newBusinessLogoUrl = await uploadFile(businessLogo);
//       if (newBusinessLogoUrl) { // Ensure the new logo was successfully uploaded
//         if (existingQuotation.businessLogo) {
//           await deleteFile(existingQuotation.businessLogo); // Delete the old logo if it exists
//         }
//         existingQuotation.businessLogo = newBusinessLogoUrl; // Set the new logo URL
//       }
//     } else {
//       // No new logo, keep the previous logo
//       existingQuotation.businessLogo = existingQuotation.businessLogo;
//     }
    
//     if (client.businessImage) {
//       // New image is provided, upload the new image and delete the old one
//       const newBusinessImageUrl = await uploadFile(client.businessImage);
//       if (newBusinessImageUrl) { // Ensure the new image was successfully uploaded
//         if (existingQuotation.client.businessImage) {
//           await deleteFile(existingQuotation.client.businessImage); // Delete the old image if it exists
//         }
//         existingQuotation.client.businessImage = newBusinessImageUrl; // Set the new image URL
//       }
//     } else {
//       // No new image, keep the previous image
//       existingQuotation.client.businessImage = existingQuotation.client.businessImage;
//     }
    
//     if (descriptionField.attachment) {
//       // New image is provided, so delete the old one and upload the new one
//       const newAttachmentUrl = await uploadFile(descriptionField.attachment);
//       if (newAttachmentUrl) { // Ensure the new image was successfully uploaded
//         if (existingQuotation.descriptionField.attachment) {
//           await deleteFile(existingQuotation.descriptionField.attachment); // Delete the old image
//         }
//         existingQuotation.descriptionField.attachment = newAttachmentUrl; // Set the new image URL
//       }
//     } else {
//       // No new image, so retain the previous image
//       existingQuotation.descriptionField.attachment = existingQuotation.descriptionField.attachment;
//     }
    
//     // Handle multiple items and their images
//     if (items && items.length) {
//       for (let i = 0; i < items.length; i++) {
//         if (items[i].thumbnailImage) {
//           // Upload new thumbnail and replace the old one
//           const newThumbnailUrl = await uploadFile(items[i].thumbnailImage);
//           if (newThumbnailUrl) { // Ensure the new thumbnail was successfully uploaded
//             if (existingQuotation.items[i].thumbnailImage) {
//               await deleteFile(existingQuotation.items[i].thumbnailImage); // Delete the old thumbnail if it exists
//             }
//             existingQuotation.items[i].thumbnailImage = newThumbnailUrl; // Set the new thumbnail URL
//           }
//         } else {
//           // No new thumbnail, keep the previous one
//           existingQuotation.items[i].thumbnailImage = existingQuotation.items[i].thumbnailImage;
//         }
//       }
//     }
    

//     // Save the updated quotation
//     await existingQuotation.save();

//     res
//       .status(200)
//       .json({
//         message: "Quotation updated successfully",
//         updatedQuotation: existingQuotation,
//       });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Failed to update quotation", error: error.message });
//   }
// });

// Assuming you have required necessary modules at the top
// const router = require('express').Router();
// const Quotation = require('../models/Quotation'); // Adjust the path as necessary
// const { deleteFile } = require('../utils/cloudinary'); // Function to delete images from Cloudinary

// Edit quotation by ID
router.put("/:quotationId/edit-quotation", async (req, res) => {
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
      terms,
    } = req.body;

    if (!quotationNumber || !quotationDate || !validTill) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing quotation by ID
    const existingQuotation = await Quotation.findById(quotationId);
    if (!existingQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
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
    existingQuotation.terms = terms;

    // Handle businessLogo
    if (businessLogo && businessLogo !== existingQuotation.businessLogo) {
      // Delete old image from Cloudinary
      if (existingQuotation.businessLogo) {
        await deleteFile(existingQuotation.businessLogo);
      }
      existingQuotation.businessLogo = businessLogo;
    }

    // Handle client businessImage
    if (client && client.businessImage && client.businessImage !== existingQuotation.client.businessImage) {
      // Delete old image from Cloudinary
      if (existingQuotation.client.businessImage) {
        await deleteFile(existingQuotation.client.businessImage);
      }
      existingQuotation.client.businessImage = client.businessImage;
    }

    // Handle descriptionField attachment
    if (descriptionField && descriptionField.attachment && descriptionField.attachment !== existingQuotation.descriptionField.attachment) {
      // Delete old image from Cloudinary
      if (existingQuotation.descriptionField.attachment) {
        await deleteFile(existingQuotation.descriptionField.attachment);
      }
      existingQuotation.descriptionField.attachment = descriptionField.attachment;
    }

    // Handle items and their images
    if (items && items.length) {
      // Create a map of existing items for easy lookup
      const existingItemsMap = {};
      existingQuotation.items.forEach((item, index) => {
        existingItemsMap[index] = item;
      });

      for (let i = 0; i < items.length; i++) {
        const newItem = items[i];
        const existingItem = existingItemsMap[i];

        if (existingItem) {
          // If thumbnailImage has changed, delete old image
          if (newItem.thumbnailImage && newItem.thumbnailImage !== existingItem.thumbnailImage) {
            if (existingItem.thumbnailImage) {
              await deleteFile(existingItem.thumbnailImage);
            }
            existingQuotation.items[i].thumbnailImage = newItem.thumbnailImage;
          }
          // Update other item fields
          existingQuotation.items[i].itemName = newItem.itemName;
          existingQuotation.items[i].quantity = newItem.quantity;
          existingQuotation.items[i].rate = newItem.rate;
          existingQuotation.items[i].amount = newItem.amount;
          existingQuotation.items[i].description = newItem.description;
        } else {
          // New item added
          existingQuotation.items.push(newItem);
        }
      }

      // Handle removed items
      if (existingQuotation.items.length > items.length) {
        for (let i = items.length; i < existingQuotation.items.length; i++) {
          if (existingQuotation.items[i].thumbnailImage) {
            await deleteFile(existingQuotation.items[i].thumbnailImage);
          }
        }
        existingQuotation.items.splice(items.length);
      }
    }

    // Save the updated quotation
    await existingQuotation.save();

    res.status(200).json({
      message: "Quotation updated successfully",
      existingQuotation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update quotation", error: error.message });
  }
});



// Delete quotation by ID
router.delete("/:quotationId/delete-quotation", async (req, res) => {
  const { quotationId } = req.params;
  try {
    const quotation = await Quotation.findOne({ _id: quotationId });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
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

    return res
      .status(200)
      .json({ message: "Quotation deleted successfully", quotation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete quotation", error: error.message });
  }
});

// Route to delete a file (image/video) from a quotation
router.post("/delete_file_cloudinary", async (req, res) => {
  try {
    const { name, fileUrl, quotationId } = req.body;

    const existingQuotation = await Quotation.findOne({ _id: quotationId });
    if (!existingQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await deleteFile(fileUrl);
    existingQuotation[name] = "";

    await existingQuotation.save();

    res
      .status(200)
      .json({
        message: "Media Deleted Successfully",
        updatedQuotation: existingQuotation,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete media", error: error.message });
  }
});

module.exports = router;
