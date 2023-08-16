const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        uppercase : true,
        trim : true,
        minlength : 2
    },
    roll : {
        type : Number,
        required : true,
        min : 1,
        max : 200,
        unique : true
    },
    dept : {
        type : String,
        required : true,
        uppercase : true,
        enum : ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE']
    },
    email : {
        type : String,
        required : true,
        lowecase : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Invalid Email Id!');
        }
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isMobilePhone(value))
                throw new Error('Invalid Mobile number!');
        }
    },
    gender : {
        type : String,
        required : true,
        lowercase : true,
        enum : ['male', 'female', 'transgender']
    },
    password : {
        type : String,
        required : true,
    },
    img : {
        type : String,
        required : true
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

studentSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id : this._id}, process.env.SECRET_KEY, {expiresIn : "2 minutes"});
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

// studentSchema.pre("save", async function(next){
//     if(this.isModified("password")){
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// })

const StudentRegister = mongoose.model('StudentRegister', studentSchema);

module.exports = StudentRegister;