const userModel = require('../models/visitorModel.js');

exports.registerUser = async (req, res) => {
    const {first_name, last_name, email, password, phone, address} = req.body;
    console.log('Request Body: ', req.body)
    if(!first_name || !last_name || !email || !password || !phone || !address){
        return res.status(400).json({message: 'All fields are required!'});
    }
    try {
        const existingUser = await userModel.findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({message: 'An account with that email already exists. Log in or try again.'});
        }
        await userModel.createUsers({first_name, last_name, email, password, phone, address});
        res.status(201).json({message: 'User registered successfully.'});
    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findUserByEmail(email);
        if(!user){
            return res.status(404).json({message: 'User not found.'});
        }
        if(user.Password !== password){
            return res.status(401).json({message: 'Invalid Password.'});
        }
        res.status(200).json({message: 'User Login Successful'});
    } catch (error) {
        console.error('Error during user login: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAllUsers = async (req, res) => {
    try {
        await userModel.deleteAllUsers();
        res.status(200).json({ message: 'All users deleted successfully.' });
    } catch (error) {
        res.status(500).json({message: error.message});
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