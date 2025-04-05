const db = require('../config/db.js');
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
        res.status(200).json({
            id: user.Visitor_ID,
            first_name: user.First_name,
            last_name: user.Last_name,
            email: user.Email,
            phone: user.Phone,
            address: user.Address
        });
        
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
exports.updateVisitor = async (req, res) => {
    const visitorId = req.params.id;
    const { first_name, last_name, email, phone, address } = req.body;

    try {
        await db.query(
            `UPDATE visitors 
             SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? 
             WHERE Visitor_ID = ?`,
            [first_name, last_name, email, phone, address, visitorId]
        );

        const [updated] = await db.query(
            'SELECT * FROM visitors WHERE Visitor_ID = ?',
            [visitorId]
        );

        res.status(200).json({
            id: updated[0].Visitor_ID,
            first_name: updated[0].First_name,
            last_name: updated[0].Last_name,
            email: updated[0].Email,
            phone: updated[0].Phone,
            address: updated[0].Address
        });
        
    } catch (error) {
        console.error('Error updating visitor:', error);
        res.status(500).json({ message: 'Update failed' });
    }
};
