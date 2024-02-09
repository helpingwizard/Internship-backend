
var mysql = require('mysql');

export const con = mysql.createConnection({
  host: "bupscxtc1vx3dm9obrma-mysql.services.clever-cloud.com",
  user: "u1pkofqu9c2bjj0a",
  password: "PbibpNWGUxSL4mfU6ByY",
  database: "bupscxtc1vx3dm9obrma",
  port: 3306
});

con.connect(function(err: any) {
  if (err) throw err;
  console.log("Connected!");
});