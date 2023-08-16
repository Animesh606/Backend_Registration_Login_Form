const express = require('express');
const Student = require('../models/students');
const multer = require('multer');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads')      //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
  });
  
  const upload = multer({storage: storage,
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
      },
  });

const router = express.Router();

// router.post('/student', async (req, res) => {
//     try {
//         const createStudent = new Student();
//         const result = await createStudent.save();
//         res.status(201).send(result);
//     } catch (error) {
//         res.status(400).send();
//     }
// })
router.get('/', (req, res) => {
    res.render('index');
})
router.get('/register', (req, res) => {
    res.render('signup');
})
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/register', upload.single('file'), async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        console.log(req.file, req.body);
        if(password === cpassword){
            const securePassword = await bcrypt.hash(password, 10);
            const student = Student({
                name : req.body.name,
                roll : req.body.roll,
                dept : req.body.dept,
                email : req.body.email,
                phone : req.body.phone,
                gender : req.body.gender,
                password : securePassword,
                img : req.file.filename
            })
            const token = await student.generateAuthToken();
            res.cookie('jwt', token, {
                expires : 30000,
                httpOnly : true
            })
            const result = await student.save();
            res.status(201).render('index');
        }
        else
        res.status(400).send('password not match');
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error);
    }
})
router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const userDetails = await Student.findOne({email : username});
        const match = await bcrypt.compare(password, userDetails.password);
        const token = await userDetails.generateAuthToken();
        res.cookie('jwt', token, {
            expires : new Date(Date.now() + 60000),
            httpOnly : true
        })
        if(match)
            res.status(201).render('index');
        else
            res.status(400).send('Invalid details');
    } catch (error) {
        res.status(400).send('Invalid Details');
    }
})

module.exports = router;