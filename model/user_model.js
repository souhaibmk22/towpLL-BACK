const mongoose=require("mongoose");
const Schema =mongoose.Schema;
const bcrypt = require("bcryptjs");



const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    userType: {
        type: String,
        enum: ['driver', 'tower'], // Enum to specify the user type
        required: true
    },
    latitude: { type: Number },
    longitude: { type: Number }
});

userSchema.pre('save', async function(next) {
    try {
        var user = this;
        // Check if the password is provided and is modified
        if (!user.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(user.password, salt);
        user.password = hashpass;
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(userPassword) {
    try {
    
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    } catch (error) {
        throw error
        
    }
    
}




const UserModel = mongoose.model('user',userSchema);
module.exports= UserModel;