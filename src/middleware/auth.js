const jwt = require('jsonwebtoken');
const Student = require('../models/students');
const cookieParser = require('cookie-parser');

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyStudent = jwt.verify(token, SECRET_KEY);
        console.log(verifyStudent);
        const student = await Student.findOne({_id : verifyStudent._id});
        console.log(student);
        next();
    }catch(err) {
        console.log(err);
        res.status(401).send(err);
    }
}

module.exports = auth;