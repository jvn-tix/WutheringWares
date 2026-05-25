const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

     const username =
        req.body.username.trim();

    const email =
        req.body.email
        .trim()
        .toLowerCase();

    const password =
        req.body.password.trim();

    const hashedPassword =
    await bcrypt.hash(password, 10);
    
    const [existingUser] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
    );

    if (existingUser.length > 0) {
    return res.status(400).json({
    message: 'Email already exists'
    });
    }

    db.query(
        `INSERT INTO users
        (username,email,password)
        VALUES (?,?,?)`,
        [
            username,
            email,
            hashedPassword
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: 'Register success'
            });
        }
    );
};

exports.login = (req, res) => {

     const email =
        req.body.email
        .trim()
        .toLowerCase();

    const password =
        req.body.password.trim();

    console.log(email);

    db.query(
        'SELECT DATABASE() AS db',
        (err, result) => {

            console.log("DATABASE:");
            console.log(result);
        }
    );

    db.query(
        'SHOW TABLES',
        (err, result) => {

            console.log("TABLES:");
            console.log(result);
        }
    );

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, result) => {
            
            console.log(result);
            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const user = result[0];

            const validPassword =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!validPassword) {
                return res.status(401).json({
                    message: 'Wrong password'
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );

            res.json({
                message: 'Login success',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        }
    );
};