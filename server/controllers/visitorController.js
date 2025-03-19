const userModel = require('../models/visitorModel.js');

exports.createUser = async (req, res) => {
    try {
        const {fname, lname, email, phone, address, purchased_tickets, ticket_type} = req.body;
        const userId = await userModel.createUsers(fname, lname, email, phone, address, purchased_tickets, ticket_type);
        res.status(201).json({id: userId, fname, lname, email, phone, address, purchased_tickets, ticket_type});
    } catch (error) {
        res.status(500).json({message: error.message});
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