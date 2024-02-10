import express from 'express';
export const router = express.Router();
import jwt from 'jsonwebtoken';
import { SECRET, authenticateJwt } from '../middleware/auth';
import { con } from '../model/db';




router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUserQuery = `SELECT * FROM admins WHERE name=? AND password=?`;
        const user = await con.query(findUserQuery, [email, password]);

        if (user.length === 0) {
            alert("Invalid credentials");
            return res.status(401).json("Invalid credentials");
        }

        const token = jwt.sign({id: user.email, role: 'admin'}, SECRET, { expiresIn: '1h' });
        res.status(203).json({ message: "Admin successfully signed in", token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;