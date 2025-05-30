import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import process from 'process';

// check password and confirmPassword
function isMatch(password, confirm_password) {
    if (password === confirm_password) return true
    return false
}

// validate email
function validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// validate password
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

// create refresh token
function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}

// create access token
function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

// user sign-up
export const signUp = async (req, res) => {
    try {
        const { personal_id, name, email, password, confirmPassword, address, phone_number } = req.body;

        if (!personal_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" });

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match" });

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails" });

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number,
            isVerified: false
        });

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const otpExpires = Date.now() + 10 * 60 * 1000;

        newUser.otp = otp;
        newUser.otpExpires = otpExpires;

        await newUser.save();

        // Send OTP to user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Registration',
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Nodemailer actual error:", error);
                return res.status(500).json({ message: 'Error sending OTP email', error: error.toString() })
            }
        
            console.log('Email sent: ' + info.response);
        
            return res.status(200).json({
                message: "User registered successfully. OTP sent to your email.",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await Users.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'No OTP found for this user' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// user sign-in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (!email || !password) return res.status(400).json({ message: "Please fill in all fields" });

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const refresh_token = createRefreshToken({ id: user._id });
        const access_token = createAccessToken({ id: user._id });

        const expiry = 24 * 60 * 60 * 1000;

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: expiry,
            expires: new Date(Date.now() + expiry)
        });

        // Set Authorization header
        res.set('Authorization', `Bearer ${access_token}`);

        res.status(200).json({
            message: "Sign In successfully!",
            access_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// user information
export const userInfor = async (req, res) => {
    try {
        const userId = req.user.id
        const userInfor = await Users.findById(userId).select("-password")

        res.json(userInfor)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update user details
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, phone_number, user_image } = req.body;

        const updateData = {};
        if (name) {
            if (name.length < 3) {
                return res.status(400).json({ message: "Your name must be at least 3 letters long" });
            }
            updateData.name = name;
        }
        if (address) updateData.address = address;
        if (phone_number) updateData.phone_number = phone_number;
        if (user_image) updateData.user_image = user_image;

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const deletedUser = await Users.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};