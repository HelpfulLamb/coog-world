const userModel = require('../models/visitorModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { first_name, last_name, email, password, phone, address } = req.body;

    if (!first_name || !last_name || !email || !password || !phone || !address) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Hashed Password:', hashedPassword);

        // Store the user in the database
        await userModel.createUsers({ 
            first_name, 
            last_name, 
            email, 
            password: hashedPassword, // Store the hashed password
            phone, 
            address 
        });

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('❌ Error registering user:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        console.log("🔍 Entered Password:", password);
        console.log("🔍 Stored Password in DB:", user.Password);

        const isMatch = await bcrypt.compare(password, user.Password);
        console.log("✅ Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserProfile = async (req, res) => {
    const visitorId = req.user.visitor_id;
    try {
        const user = await userModel.getUserById(visitorId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateUserProfile = async (req, res) => {
    const visitorId = req.user.visitor_id;
    const { first_name, last_name, email, phone, address } = req.body;

    try {
        await userModel.updateUserById(visitorId, { first_name, last_name, email, phone, address });
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrderHistory = async (req, res) => {
    const visitorId = req.user.visitor_id;
    try {
        const orders = await userModel.getOrderHistoryByUserId(visitorId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteAllUsers = async (req, res) => {
    try {
        await userModel.deleteAllUsers();
        res.status(200).json({ message: 'All users deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteUserById = async (req, res) => {
    try {
        await userModel.deleteUserById(req.params.id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};