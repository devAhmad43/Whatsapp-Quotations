const express = require('express');
const router = express.Router();
const Site = require("../../models/siteModel")
const { uploadFile, uploadVideo, deleteFile } = require("../../utils/cloudinary")

// /api/sites/...
// /api/sites/add-site

//////////////////// delete hotel media from cloudinary ////////////////////////
router.post('/delete_file_cloudinary', async (req, res) => {
    try {
        const { name, fileUrl, siteId } = req.body
        const existingsite = await Site.findOne({ _id: siteId });
        if (!existingsite) {
            return res.status(404).json({ message: 'site not found' });
        }
        await deleteFile(fileUrl)
        existingsite[name] = ""
        await existingsite.save()

        res.status(200).json({ message: "Media Deleted Succesfully", existingsite })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete Media", error: error.message })
    }
})
router.post('/add-site', async (req, res) => {
    try {
        const { siteName, siteDescription, latitude, longitude, siteImage1, siteImage2, siteImage3, siteVideo, } = req.body;
        if (!siteName || !latitude || !longitude || !siteDescription) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newsite = new Site({
            siteName,
            siteDescription,
            latitude,
            longitude,
            siteImage1,
            siteImage2,
            siteImage3,
            siteVideo,
        });
        await newsite.save();
        res.status(200).json({ message: 'Successfully site added', newsite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add site', error: error.message });
    }
});
// editsite
router.put('/:siteId/edit-site', async (req, res) => {
    try {
        const { siteId } = req.params;
        const { siteName, siteDescription, latitude, longitude, siteImage1, siteImage2, siteImage3, siteVideo } = req.body;
        if (!siteName || !latitude || !longitude) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existingsite = await Site.findById(siteId);
        if (!existingsite) {
            return res.status(404).json({ message: 'site not found' });
        }
        existingsite.siteName = siteName;
        existingsite.siteDescription = siteDescription;
        existingsite.latitude = latitude;
        existingsite.longitude = longitude;
        if (siteImage1) {
            await deleteFile(existingsite.siteImage1)
            existingsite.siteImage1 = siteImage1
        }
        if (siteImage2) {
            await uploadFile(existingsite.siteImage2);
            existingsite.siteImage2 = siteImage2;
        }
        if (siteImage3) {
            await uploadFile(existingsite.siteImage3);
            existingsite.siteImage3 = siteImage3;
        }
        if (siteVideo) {
            await uploadFile(existingsite.siteVideo);
            existingsite.siteVideo = siteVideo;
        }

        await existingsite.save();
        res.status(200).json({ message: 'site updated successfully', updatedsite: existingsite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update site', error: error.message });
    }
});

router.get("/get-all-sites", async (req, res) => {
    try {
        const sites = await Site.find().sort({ _id: -1 });

        if (!sites || sites.length === 0) {
            return res.status(404).json({ message: "sites not found" });
        }

        res.status(200).json({ message: 'sites fetched successfully', sites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all sites', error: error.message });
    }
});

router.delete('/:siteId/delete-site', async (req, res) => {
    const { siteId } = req.params;
    try {
        const site = await Site.findOne({ _id: siteId });

        if (!site) {
            return res.status(404).json({ message: 'site not found' });
        }
        if (site.siteImage1) {
            await deleteFile(site.siteImage1);
        }
        if (site.siteImage2) {
            await deleteFile(site.siteImage2);
        }
        if (site.siteImage3) {
            await deleteFile(site.siteImage3);
        }
        if (site.siteVideo) {
            await deleteFile(site.siteVideo);
        }7
        await Site.deleteOne({ _id: siteId });
        return res.status(200).json({ message: 'site deleted successfully', site });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete site', error: error.message });
    }
});


router.post('/search-site', async (req, res) => {
    try {
        // Extract search term from the request query
        const { searchTerm } = req.body;

        // Define the regex pattern for case-insensitive global search
        const regexPattern = new RegExp(searchTerm.trim(), 'gi');

        // Query the database using Mongoose with regex for global search
        const sites = await Site.find({
            $or: [
                { siteName: regexPattern },
                // Add more fields as needed for the search
            ],
        }).sort({ _id: -1 });

        // Check if hotels were found
        if (!sites || sites.length === 0) {
            return res.status(404).json({ message: 'No sites found' });
        }

        // Return the search results
        res.status(200).json({ message: ' sites fetched successfully', sites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search  sites', error: error.message });
    }
});


module.exports = router;