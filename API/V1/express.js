const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const app = express();
const endPointRoot = "/API/v1/";
const error = {
    database: "Database error!",
};
const connection = mysql.createConnection({
    host: "localhost",
    user: "Admin",
    password: "Admin123Admin123",
    database: "labs",
});
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
    "/API/v1/register/": {
        POST: 0,
    },
    "/API/v1/login/": {
        POST: 0,
    },
    "/API/v1/counter/": {
        GET: 0,
    },
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://tommy-may.herokuapp.com");
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// For easier access to request body
app.use(express.urlencoded({ extended: false }));

///////////////////////////////////////////////////////////////////
// QUIZ ENDPOINTS
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "quiz/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(error.database)
        } else {
            if (result.length > 0) {
                requestCounter["/API/v1/quiz/"].GET++;

                sql = "SELECT * FROM quiz";
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log("returned quiz");
                    res.status(200).json(result);
                });
            } else {
                console.log("invalid API key!");
                res.status(400).send("invalid API key!")
            }
        }
    });
});

app.post(endPointRoot + "quiz/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
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
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                    // console.log(body);
                }
            });
        
            req.on("end", () => {
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
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

app.put(endPointRoot + "quiz/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/quiz/"].PUT++;

            let body = "";
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                    // console.log(body);
                }
            });
        
            req.on("end", () => {
                const bodyObj = JSON.parse(body);
                sql = `UPDATE quiz SET question = "${bodyObj.question}", ` +
                            `answer1 = ${bodyObj.answer1}, answer2 = ${bodyObj.answer2}, answer3 = ${bodyObj.answer3}, answer4 = ${bodyObj.answer4}, ` +
                            `answerIndex = ${bodyObj.answerIndex} WHERE id = ${bodyObj.id}`;
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    // console.log(result);
                    console.log(`question "${bodyObj.id}" updated in DB.`);
                });
                res.end(body);
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

app.delete(endPointRoot + "quiz/delete/:id", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/quiz/"].DELETE++;

            sql = `DELETE FROM quiz WHERE id = ${req.params.id}`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(error.database)
                    res.status(404).send(error.database)
                } else {
                    // res.status(200).send(result);
                    res.status(200).send(`question "${req.params.id}" deleted from DB.`);
                }
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

///////////////////////////////////////////////////////////////////
// SCORE ENDPOINTS
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "score/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(error.database)
        } else {
            if (result.length > 0) {
                requestCounter["/API/v1/score/"].GET++;
    
                sql = "SELECT * FROM score";
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log("returned score");
                    res.json(result);
                });
            } else {
                console.log("invalid API key!");
                res.status(400).send("invalid API key!")
            }
        }
    });
});

app.post(endPointRoot + "score/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
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
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                    // console.log(body);
                }
            });
        
            req.on("end", () => {
                const bodyObj = JSON.parse(body);
                sql = `INSERT INTO score(name, score) values ` +
                            `("${bodyObj.name}", ${bodyObj.score})`;
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    // console.log(result);
                    console.log(`score "${bodyObj.name}: ${bodyObj.score}" stored in DB.`);
                });
                res.end(body);
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

app.put(endPointRoot + "score/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/score/"].PUT++;

            let body = "";
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                    // console.log(body);
                }
            });
        
            req.on("end", () => {
                const bodyObj = JSON.parse(body);
                sql = `UPDATE score SET score = ${bodyObj.score} WHERE name = "${bodyObj.name}"`;
                connection.query(sql, (err, result) => {
                    if (err) throw err;
                    // console.log(result);
                    console.log(`score "${bodyObj.name}: ${bodyObj.score}" updated in DB.`);
                });
                res.end(body);
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

app.delete(endPointRoot + "score/delete/:name", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/score/"].DELETE++;

            sql = `DELETE FROM score WHERE name = "${req.params.name}"`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(404).send(error.database)
                } else {
                    // res.status(200).send(result);
                    res.status(200).send(`score "${req.params.name}" deleted from DB.`);
                }
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});


///////////////////////////////////////////////////////////////////
// REGISTER/LOGIN ENDPOINTS
///////////////////////////////////////////////////////////////////

app.post(endPointRoot + "register/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/register/"].POST++;

            let body = "";
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                }
            });
        
            req.on("end", () => {
                const bodyObj = JSON.parse(body);
        
                const createTableQuery = [
                    "CREATE TABLE IF NOT EXISTS user",
                    "(id INT AUTO_INCREMENT PRIMARY KEY,",
                    "username VARCHAR(255),",
                    "password VARCHAR(255))",
                ].join(" ");
                connection.query(createTableQuery, (err, result) => {
                    if (err) throw err;
                    // console.log(result);
                    console.log("table user created");
                });
        
                const hashedPassword = bcrypt.hashSync(bodyObj.password, 10);
                sql = `SELECT * FROM user WHERE username = "${bodyObj.username}"`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(error.database)
                    } else {
                        if (result.length === 0) {
                            sql = `INSERT INTO user(username, password) VALUES ` +
                                  `("${bodyObj.username}", "${hashedPassword}")`;
                            connection.query(sql, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).send(error.database)
                                } else {
                                    // res.status(201).send(result);
                                    console.log(`User "${bodyObj.username}" added to DB.`);
                                    res.status(201).send(`User "${bodyObj.username}" added to DB.`);
                                }
                            });
                        } else {
                            res.status(400).send("user with this username already exists!")
                        }
                    }
                });
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

app.post(endPointRoot + "login/", async (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/login/"].POST++;

            let body = "";
            req.on("data", (chunk) => {
                if (chunk != null) {
                    body += chunk;
                }
            });

            req.on("end", () => {
                const bodyObj = JSON.parse(body);
                // const hashedPassword = bcrypt.hashSync(bodyObj.password, 10);

                sql = `SELECT * FROM user WHERE username = "${bodyObj.username}"`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(error.database)
                    } else {
                        if (result.length === 0) {
                            res.status(401).send("Login failed. Invalid username!")
                        } else {
                            if (bcrypt.compareSync(bodyObj.password, result[0].password)) {
                                console.log("Logged successfully.");
                                res.status(200).send("Logged successfully.");
                            } else {
                                res.status(401).send("Login failed. Invalid password!")
                            }
                        }
                    }
                });
            });
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

///////////////////////////////////////////////////////////////////
// COUNTER ENDPOINTS
///////////////////////////////////////////////////////////////////

app.get(endPointRoot + "counter/", (req, res) => {
    let sql = `SELECT * FROM apikey WHERE apikey="${req.query.apikey}"`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            requestCounter["/API/v1/counter/"].GET++;
            console.log("returned counter");
            res.json(requestCounter);
        } else {
            console.log("invalid API key!");
            res.status(400).send("invalid API key!")
        }
    });
});

module.exports = app;
