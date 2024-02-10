import express from 'express';
export const router = express.Router();
import jwt from 'jsonwebtoken';
import { SECRET, authenticateJwt } from '../middleware/auth';
import { con } from '../model/db';

router.post("/signup", async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=?`;
        const existingUser = await con.query(findUserQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(401).json("User already exists");
        }

        const newUserQuery = `INSERT INTO users(name, username, emailId, password) VALUES(?, ?, ?, ?)`;
        const newUser = await con.query(newUserQuery, [name, username, email, password]);

        res.status(203).json({ message: "User successfully created" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=? AND password=?`;
        const user = await con.query(findUserQuery, [email, password]);

        if (user.length === 0) {
            return res.status(401).json("Invalid credentials");
        }

        const token = jwt.sign({ id: user[0].userId, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.status(203).json({ message: "User successfully signed in", token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/data", authenticateJwt, async (req, res) => {
    

    try {
        con.query("SELECT * FROM users;", (err: Error, results: any[], fields: any) => {
            if(err) throw err;
            res.send(results);
        
        })
        
        
        
        

    } catch (err) {
        res.status(400).send(err.message);
    }
});



router.post("/createuser",authenticateJwt, async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=?`;
        const newUser = await con.query(findUserQuery, [email]);

        if (newUser.length > 0) {
            return res.status(401).json("User already exists");
        }

        const newUserQuery1 = `INSERT INTO users(name, username, emailId, password) VALUES(?, ?, ?, ?)`;
        const newUser1 = await con.query(newUserQuery1, [name, username, email, password]);

        
        res.status(203).json({ message: "admin successfully created"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/delete/:userId",authenticateJwt, async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const deleteUserQuery = `DELETE FROM users WHERE userId=?`;
        const deletedUser = await con.query(deleteUserQuery, [userId]);

        if (deletedUser.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put("/update/:userId",authenticateJwt,  async (req, res) => {
    const userId = req.params.userId;
    const { name, username, email, password } = req.body;

    try {

        const findUserQuery = `SELECT * FROM users WHERE userId=?`;
        const user = await con.query(findUserQuery, [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateUserQuery = `
            UPDATE users 
            SET name=?, emailId=?, password=?, username=?
            WHERE userId=?
        `;
        await con.query(updateUserQuery, [name, email, password, username, userId]);


        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;
