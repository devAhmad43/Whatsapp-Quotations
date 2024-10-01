const express = require('express');
const router = express.Router();
const Suggestion = require("../../models/suggestionModel")
const User = require("../../models/Mongoousers")


router.post('/add-suggestion', async (req, res) => {
    try {
        const { SugDiscription, userId } = req.body;


        if (!SugDiscription || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const currentUser = await User.find({ _id: userId });

        if (!currentUser) {
            return res.status(400).json({ message: "User not found" })
        }

        const newSuggestion = new Suggestion({
            SugDiscription,
            userId
        });
        await newSuggestion.save();
        res.status(200).json({ message: 'Successfully Suggestion added', newSuggestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add Suggestion', error: error.message });
    }
});



router.get("/get-all-suggestion", async (req, res) => {
    try {
        const allSuggestion = await Suggestion.find().populate({
            path: 'userId',
            select: 'userName email'
        }).sort({ _id: -1 });

        if (!allSuggestion || allSuggestion.length === 0) {
            return res.status(404).json({ message: "suggestion not found" });
        }

        const sortedSuggestion = allSuggestion.filter((sug) => sug.userId !== null)
        res.status(200).json({ message: 'suggestion fetched successfully', allSuggestion: sortedSuggestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all suggestion', error: error.message });
    }
});

router.delete('/:suggestionId/delete_suggestion', async (req, res) => {
    const { suggestionId } = req.params;
    try {
        const deletedSuggestion = await Suggestion.findOne({ _id: suggestionId });

        if (!deletedSuggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }

        await Suggestion.deleteOne({ _id: suggestionId });
        return res.status(200).json({ message: 'suggestion deleted successfully', deletedSuggestion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Delete suggestion,', error: error.message });
    }
});





module.exports = router;