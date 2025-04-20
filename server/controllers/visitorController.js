const db = require('../config/db.js');
const userModel = require('../models/visitorModel.js');

exports.registerUser = async (req, res, body) => {
    const {first_name, last_name, email, password, phone, address} = body;
    if(!first_name || !last_name || !email || !password || !phone || !address){
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: 'All fields are required!'}));
    }
    try {
        const existingUser = await userModel.findUserByEmail(email, phone);
        if(existingUser){
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'An account with that email or phone already exists. Log in or try again.'}));
        }
        await userModel.createUsers({first_name, last_name, email, password, phone, address});
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'User registered successfully.'}));
    } catch (error) {
        console.error('Error registering user: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'An error occurred. Please try again.'}));
    }
};

exports.loginUser = async (req, res, body) => {
    const {email, password} = body;
    try {
        const user = await userModel.findUserByEmail(email);
        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'User not found.'}));
        }
        if(user.Password !== password){
            res.writeHead(401, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'Incorrect Password.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            id: user.Visitor_ID,
            first_name: user.First_name,
            last_name: user.Last_name,
            email: user.Email,
            phone: user.Phone,
            address: user.Address
        }));
        
    } catch (error) {
        console.error('Error during user login: ', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'An error occurred. Please try again.'}));
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const info = await userModel.getUserInfo();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: error.message}));
    }
};

exports.getUserById = async (req, res, id) => {
    try {
        const user = await userModel.getUserById(id);
        if (!user) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({message: 'User not found.'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: err.message}));
    }
};

exports.deleteAllUsers = async (req, res) => {
    try {
        await userModel.deleteAllUsers();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'All users deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: err.message}));
    }
};

exports.deleteUserById = async (req, res, body) => {
    try {
        const {Visitor_ID} = body;
        if(!Visitor_ID){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid visitor ID provided.' }));
        }
        await userModel.deleteUserById(Visitor_ID);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'User deleted successfully.'}));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: err.message}));
    }
};
exports.updateVisitor = async (req, res, id, body) => {
    const { first_name, last_name, email, phone, address } = body;
    try {
        await db.query(
            `UPDATE visitors 
             SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? 
             WHERE Visitor_ID = ?`,
            [first_name, last_name, email, phone, address, id]
        );
        const [updated] = await db.query(
            'SELECT * FROM visitors WHERE Visitor_ID = ?',
            [id]
        );
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            id: updated[0].Visitor_ID,
            first_name: updated[0].First_name,
            last_name: updated[0].Last_name,
            email: updated[0].Email,
            phone: updated[0].Phone,
            address: updated[0].Address
        }));
    } catch (error) {
        console.error('Error updating visitor:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Update failed'}));
    }
};

exports.updateVisitorInfo = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedUser = {...updatedData, Visitor_ID: id};
        const updatedUser = await userModel.updateVisitorInfo(selectedUser);
        if(!updatedUser){
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found or not updated.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User updated successfully.', user: updatedData }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};
