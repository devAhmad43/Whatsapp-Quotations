const express = require('express');
const router = express.Router();
const User = require("../../models/Mongoousers")
const jwt = require('jsonwebtoken');
const secretID = process.env.secret_ID_JWT
// Getting user
router.get('/get_all_users', async (req, res) => {
    try {
        const users = await User.find().sort({ _id: -1 });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'users  not found' });
        }
        res.status(200).json({ message: 'User Fetched Successfully', users });

    } catch (error) {
        res.status(500).json({ message: 'Failed to Fetch Users' });
    }
});
router.get('/:id/get_user', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.isverified) {
            return res.status(401).json({ message: 'User is not verified. Please complete sign-up' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is suspended' });
        }
        res.status(200).json({ message: 'User Data fetched', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later' });
    }
});
router.post('/get_user_by_MobileNumber', async (req, res) => {
    try {
        const { contact } = req.body;
        console.log([contact])
        const user = await User.findOne({ mobileNumber: contact }); // Convert mobileNumber to string

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.isverified) {
            return res.status(401).json({ message: 'User is not verified. Please complete sign-up' });
        }

        if (!user.status) {
            return res.status(401).json({ message: 'User is suspended' });
        }

        res.status(200).json({ message: 'User Data fetched', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later' });
    }
});


router.get('/:id/verfiy_user_token', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.status) {
            return res.status(401).json({ message: 'User is suspended' });
        }
        if (!user.isverified) {
            return res.status(401).json({ message: 'User is not verified. Please complete sign-up' });
        }

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Invalid or missing token' });
        }
        const token = authorization.split(' ')[1];
        jwt.verify(token, secretID, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid Token or Token Expired' });
            }
            // Token is valid, you can use the decoded information if needed
            res.status(200).json({ message: 'User Data fetched', user });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later' });
    }
});

//  used by both admin and user,  delte user and also delete user collection
router.delete('/:id/delete_user', async (req, res) => {

    const { id } = req.params;


    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is suspended' });
        }
        await User.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Account deleted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Delete Account, try Again Later' });
    }
});

router.post('/:id/update_user_status', async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (status) {
            user.status = true;
        } else {
            user.status = false;
        }
        await user.save();

        res.status(200).json({ message: 'User Status Update Successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update User, try Again Later', error: error.message });
    }
});

router.delete('/deleteUnverified', async (req, res) => {
    try {
        console.log("aya");
        const result = await User.deleteMany({ isverified: false });

        res.json({ message: 'Users not verified deleted', result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete unverified users', error });
    }
});

router.get("/active-users", async (req, res) => {
    try {
        const allUsers = await User.find();

        if (!allUsers && allUsers.length === 0) {
            return res.status(404).json({ message: 'users not found' });
        }

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const activeUsers = allUsers.filter(user => {
            const lastLoginDate = new Date(user.lastLogin);
            return lastLoginDate >= oneWeekAgo;
        });
        res.json({ message: 'Active Users fetched Successfully', activeUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch active users', error: error.message });
    }

})

router.post("/update_location/:id", async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const{id} = req.params;
        const currentUser = await User.findOne({ _id: id });

        if (!currentUser) {
            return res.status(404).json({ message: 'users not found' });
        }
        currentUser.latitude = latitude;
        currentUser.longitude = longitude;
        await currentUser.save()

        res.json({ message: 'user location updated', currentUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user location', error: error.message });
    }

})

// change user status , suspend or active
// router.post('/:id/update_user_status', async (req, res) => {

//     const { id } = req.params;
//     const { status } = req.body;

//     try {
//         const user = await User.findOne({ _id: id });

//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }
//         if (status === "Active") {
//             user.status = true;
//         } else if (status === "Suspended") {
//             user.status = false;
//         }
//         await user.save();

//         res.status(200).json({ message: 'User Status Update Successfully', user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to Update User, try Again Later' });
//     }
// });

module.exports = router;
