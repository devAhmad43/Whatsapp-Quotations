const express = require('express');
const router = express.Router();
const User = require("../../models/Mongoousers")
const VerificationModel = require("../../models/verificationModel")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require("../../utils/transpoter")



// Route to update isPaymentVerified to true
router.put('/updatePaymentVerified/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, { isPaymentVerified: true }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "isPaymentVerified updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update isPaymentVerified" });
    }
});

// Route to check if user created time is greater than 24 hours and isPaymentVerified is false
// router.get('/checkPaymentStatus/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const twentyFourHoursAgo = new Date();
//         console.log(twentyFourHoursAgo)
//         twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

//         console.log(twentyFourHoursAgo)
//         console.log(user.createdAt)

//         if (!user.isPaymentVerified && user.createdAt < twentyFourHoursAgo) {
//             return res.status(200).json({ navigateToPayment: true });
//         } else {
//             return res.status(200).json({ navigateToPayment: false });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to check payment status" });
//     }
// });

router.get('/checkPaymentStatus/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
       
        if (user.isPaymentVerified) {
            return res.status(200).json({
                paymentStatus: "Payment verified",
                isPaymentVerified: true,
                condition1: true,
                message: "Payment has been successfully verified."
            });
        } else if (user.createdAt < twentyFourHoursAgo) {
            return res.status(200).json({
                paymentStatus: "Payment not verified and 24 hours completed",
                isPaymentVerified: false,
                condition2: true,
                message: "Payment has not been verified and 24 hours have passed."
            });
        } else {
            return res.status(200).json({
                paymentStatus: "Payment not verified and 24 hours not completed",
                isPaymentVerified: false,
                condition3: true,
                message: "Payment has not been verified and 24 hours have not passed yet."
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check payment status", error: error.message });
    }
});

//User login 

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No User Found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const UserToken = jwt.sign({ id: user._id }, secretID, { expiresIn: '30d' });
        user.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
        user.jwttoken = UserToken;
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({ message: 'Successfully Sign In', user });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to login User" });
    }

});


// user singup
router.post('/add_user', async (req, res) => {

    try {
        const { userName, email, password, mobileNumber } = req.body;
        if (!userName || !email || !password || !mobileNumber) {
            return res.status(400).json({ message: 'Invalid feilds' });
        }
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "user already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = new User({ userName, email, password: hashedPassword, mobileNumber })
        newuser.isverified = true;
        newuser.status = true;
        const UserToken = jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' });
        newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
        newuser.jwttoken = UserToken;
        await newuser.save();
        res.status(200).json({ message: 'Successfully Sign In', newuser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign Up, try Again Later', error: error.message });
    }
});

//User login 
router.post('/forget-password', async (req, res) => {
    const { email } = req.body;
    try {

        if (!email) {
            return res.status(400).json({ message: "email not found" })
        }
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "user not found", })
        }

        if (!existingUser.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        // Check if there's an existing verification record for this user
        const existingVerification = await VerificationModel.findOne({ useremail: email });
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = new Date(Date.now() + 20 * 60 * 1000);
        if (existingVerification) {
            existingVerification.verificationCode = verificationCode;
            existingVerification.expirationTime = expirationTime;
            await existingVerification.save();
        } else {
            const verificationData = new VerificationModel({
                useremail: email,
                verificationCode,
                expirationTime,
            });
            await verificationData.save();
        }
        const mailOptions = {
            from: '"UmmahMap Application" <ibrarathar0007@gmail.com>',
            to: email,
            subject: 'Email Verification',
            html: `   
  <p>UmmahMap Application </p>
  <p>Use this Verification code to Complete Signup</p>
  <p>Your verification code is: ${verificationCode}</p>`
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent successfully", });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign-In , try Again Later', error: error.message });
    }
});

router.post('/verify_otp', async (req, res) => {
    try {
        const { email, userOTP, password } = req.body;

        if (!email || !userOTP || !password) {
            return res.status(400).json({ message: "invalid fields" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No User Found" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }

        const verificationData = await VerificationModel.findOne({ useremail: email });

        if (!verificationData) {
            return res.status(404).json({ message: 'Verification data not found' });
        }
        const currentTime = new Date();
        if (currentTime <= verificationData.expirationTime) {
            if (userOTP === verificationData.verificationCode) {
                await VerificationModel.deleteOne({ useremail: email });
                user.isemailVerified = true;
                const hashedPassword = await bcrypt.hash(password, 10);

                user.password = hashedPassword
                user.isverified = true;
                await user.save()
                return res.status(200).json({ message: 'password change successful', user });

            } else {
                return res.status(401).json({ message: 'Invalid verification code' });
            }
        } else {
            return res.status(400).json({ message: 'Verification code has expired' });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }

});




router.post('/:id/update_user_password', async (req, res) => {

    try {
        // const { id } = req.params
        const { oldpassword, newpassword } = req.body

        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials, User not found" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }
        if (!user.isverified) {
            return res.status(401).json({ message: 'User is not verified. Please Complete Sing Up' });
        }
        const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        user.password = hashedPassword;
        await user.save()

        res.status(200).json({ message: 'Password Changed Successfully', user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update password" });
    }

});

router.post('/:userId/update_token', async (req, res) => {

    try {

        const { userId } = req.params;
        const { updateToken } = req.body;

        const existingUser = await User.findOne({ _id: userId });

        // console.log(file);
        if (!existingUser) {
            return res.status(404).json({ message: "No User Found" });
        }
        if (!existingUser.status) {
            return res.status(401).json({ message: 'User is suspended' });
        }
        if (!updateToken) {
            return res.status(400).json({ message: "Empty Update Token" });
        }
        existingUser.token = updateToken;
        await existingUser.save();
        res.status(200).json({ message: 'Token Updated Successfully', existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update Token, try Again Later' });
    }
});



module.exports = router;
