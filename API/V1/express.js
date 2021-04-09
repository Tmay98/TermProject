const express = require("express");
const mysql = require("mysql");
const app = express();
const endPointRoot = "/API/v1/";
const error = {
    database: "Database error!",
};
const requestCounter = {
    "/API/v1/quiz/": {
        POST: 0,
        PUT: 0,
        GET: 0,
        DELETE: 0,
    },
    "/API/v1/score/": {
        POST: 0,
        PUT: 0,
        GET: 0,
        DELETE: 0,
    },
    "/API/v1/counter/": {
        GET: 0,
    },
};

const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Admin123Admin123",
    database: "labs",
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, OPTIONS"
    );
    next();
});

///////////////////////////////////////////////////////////////////
// QUIZ ENDPOINTS
// GET  - return entire question list as JSON
// POST - add new question
// PUT  - update existing question by id
// POST - delete existing question by id
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "quiz/", (req, res) => {
    requestCounter["/API/v1/quiz/"].GET++;

    const sql = "SELECT * FROM quiz";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("returned quiz");
        res.json(result);
    });
});

app.post(endPointRoot + "quiz/", (req, res) => {
    requestCounter["/API/v1/quiz/"].POST++;

    const createTableQuery = [
        "CREATE TABLE IF NOT EXISTS quiz",
        "(id INT AUTO_INCREMENT PRIMARY KEY,",
        "question VARCHAR(255),",
        "answer1 VARCHAR(255),",
        "answer2 VARCHAR(255),",
        "answer3 VARCHAR(255),",
        "answer4 VARCHAR(255),",
        "answerIndex INT)",
    ].join(" ");
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        // console.log(result);
        console.log("table quiz created");
    });

    let body = "";
    req.on("data", function (chunk) {
        if (chunk != null) {
            body += chunk;
            // console.log(body);
        }
    });

    req.on("end", function () {
        const bodyObj = JSON.parse(body);
        const sql = `INSERT INTO quiz(question, answer1, answer2, answer3, answer4, answerIndex) values ` +
                    `("${bodyObj.question}", ${bodyObj.answer1}, ${bodyObj.answer2}, ${bodyObj.answer3}, ${bodyObj.answer4}, ${bodyObj.answerIndex})`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            // console.log(result);
            console.log(`question "${bodyObj.question}" stored in DB.`);
        });
        res.end(body);
    });
});

app.put(endPointRoot + "quiz/", (req, res) => {
    requestCounter["/API/v1/quiz/"].PUT++;

    let body = "";
    req.on("data", function (chunk) {
        if (chunk != null) {
            body += chunk;
            // console.log(body);
        }
    });

    req.on("end", function () {
        const bodyObj = JSON.parse(body);
        const sql = `UPDATE quiz SET question = "${bodyObj.question}", ` +
                    `answer1 = ${bodyObj.answer1}, answer2 = ${bodyObj.answer2}, answer3 = ${bodyObj.answer3}, answer4 = ${bodyObj.answer4}, ` +
                    `answerIndex = ${bodyObj.answerIndex} WHERE id = ${bodyObj.id}`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            // console.log(result);
            console.log(`question "${bodyObj.id}" updated in DB.`);
        });
        res.end(body);
    });
});

app.post(endPointRoot + "quiz/delete/:id", (req, res) => {
    requestCounter["/API/v1/quiz/"].DELETE++;

    const sql = `DELETE FROM quiz WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(error.database)
            res.send(error.database)
        } else {
            // res.status(200).send(result);
            res.status(200).send(`question "${req.params.id}" deleted from DB.`);
        }
    });
});

///////////////////////////////////////////////////////////////////
// SCORE ENDPOINTS
// GET  - return entire score list as JSON
// POST - add new score
// PUT  - update existing score by name
// POST - delete existing score by name
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "score/", (req, res) => {
    requestCounter["/API/v1/score/"].GET++;

    const sql = "SELECT * FROM score";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("returned score");
        res.json(result);
    });
});

app.post(endPointRoot + "score/", (req, res) => {
    requestCounter["/API/v1/score/"].POST++;

    const createTableQuery = [
        "CREATE TABLE IF NOT EXISTS score",
        "(id INT AUTO_INCREMENT PRIMARY KEY,",
        "name VARCHAR(255),",
        "score INT)",
    ].join(" ");
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        // console.log(result);
        console.log("table score created");
    });

    let body = "";
    req.on("data", function (chunk) {
        if (chunk != null) {
            body += chunk;
            // console.log(body);
        }
    });

    req.on("end", function () {
        const bodyObj = JSON.parse(body);
        const sql = `INSERT INTO score(name, score) values ` +
                    `("${bodyObj.name}", ${bodyObj.score})`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            // console.log(result);
            console.log(`score "${bodyObj.name}: ${bodyObj.score}" stored in DB.`);
        });
        res.end(body);
    });
});

app.put(endPointRoot + "score/", (req, res) => {
    requestCounter["/API/v1/score/"].PUT++;

    let body = "";
    req.on("data", function (chunk) {
        if (chunk != null) {
            body += chunk;
            // console.log(body);
        }
    });

    req.on("end", function () {
        const bodyObj = JSON.parse(body);
        const sql = `UPDATE score SET score = ${bodyObj.score} WHERE name = "${bodyObj.name}"`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            // console.log(result);
            console.log(`score "${bodyObj.name}: ${bodyObj.score}" updated in DB.`);
        });
        res.end(body);
    });
});

app.post(endPointRoot + "score/delete/:name", (req, res) => {
    requestCounter["/API/v1/score/"].DELETE++;

    const sql = `DELETE FROM score WHERE name = "${req.params.name}"`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.send(error.database)
        } else {
            // res.status(200).send(result);
            res.status(200).send(`score "${req.params.name}" deleted from DB.`);
        }
    });
});

///////////////////////////////////////////////////////////////////
// COUNTER ENDPOINTS
// GET  - return access records as JSON
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "counter/", (req, res) => {
    requestCounter["/API/v1/counter/"].GET++;
    console.log("returned counter");
    res.json(requestCounter);
});

module.exports = app;
