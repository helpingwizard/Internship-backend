"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const db_1 = require("../model/db");
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=?`;
        const existingUser = yield db_1.con.query(findUserQuery, [email]);
        if (existingUser.length > 0) {
            return res.status(401).json("User already exists");
        }
        const newUserQuery = `INSERT INTO users(name, username, emailId, password) VALUES(?, ?, ?, ?)`;
        const newUser = yield db_1.con.query(newUserQuery, [name, username, email, password]);
        res.status(203).json({ message: "User successfully created" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=? AND password=?`;
        const user = yield db_1.con.query(findUserQuery, [email, password]);
        if (user.length === 0) {
            return res.status(401).json("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ id: user[0].userId, role: 'admin' }, auth_1.SECRET, { expiresIn: '1h' });
        res.status(203).json({ message: "User successfully signed in", token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
exports.router.get("/data", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db_1.con.query("SELECT * FROM users;", (err, results, fields) => {
            if (err)
                throw err;
            res.send(results);
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
exports.router.post("/createuser", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    try {
        const findUserQuery = `SELECT * FROM users WHERE emailId=?`;
        const newUser = yield db_1.con.query(findUserQuery, [email]);
        if (newUser.length > 0) {
            return res.status(401).json("User already exists");
        }
        const newUserQuery1 = `INSERT INTO users(name, username, emailId, password) VALUES(?, ?, ?, ?)`;
        const newUser1 = yield db_1.con.query(newUserQuery1, [name, username, email, password]);
        res.status(203).json({ message: "admin successfully created" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
exports.router.delete("/delete/:userId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const deleteUserQuery = `DELETE FROM users WHERE userId=?`;
        const deletedUser = yield db_1.con.query(deleteUserQuery, [userId]);
        if (deletedUser.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
exports.router.put("/update/:userId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { name, username, email, password } = req.body;
    try {
        const findUserQuery = `SELECT * FROM users WHERE userId=?`;
        const user = yield db_1.con.query(findUserQuery, [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const updateUserQuery = `
            UPDATE users 
            SET name=?, emailId=?, password=?, username=?
            WHERE userId=?
        `;
        yield db_1.con.query(updateUserQuery, [name, email, password, username, userId]);
        res.status(200).json({ message: "User updated successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
exports.default = exports.router;
