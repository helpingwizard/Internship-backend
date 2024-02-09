"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.con = void 0;
var mysql = require('mysql');
exports.con = mysql.createConnection({
    host: "bupscxtc1vx3dm9obrma-mysql.services.clever-cloud.com",
    user: "u1pkofqu9c2bjj0a",
    password: "PbibpNWGUxSL4mfU6ByY",
    database: "bupscxtc1vx3dm9obrma",
    port: 3306
});
exports.con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
