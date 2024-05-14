const { JsonWebTokenError } = require("jsonwebtoken");
const UserService =require("../services/user.services");



// THIS IS OUR REGISTRATION 
exports.register = async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        const { email, phone, password, userType } = req.body;

        const successRes = await UserService.registerUser(email, phone, password, userType);

        res.json({ status: true, success: "User registered successfully" });

    } catch (error) {
        throw error;
    }
};


// THIS OUR LOGIN API DON'T TOUCH IT IF IT WORKS 
exports.login = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;

        let user;
        if (email) {
            user = await UserService.checkUser(email);
        } else {
            user = await UserService.checkUser(phone);
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new Error('Invalid password or user.');
        }

    
        let tokenData = {
            _id: user._id,
            email: email ? user.email : null,
            phone: phone ? user.phone : null
        };

        // Generate token THIS TOKEN OF OUR USER 
        const token = await UserService.generateToken(tokenData, "secretKey", '1h');

        
        res.status(200).json({ status: true, token: token, message: "Login successful." });
    } catch (error) {
        
        console.error("Login error:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};
// THIS OUR OTP PHONE VERIFICATION 
exports.otpLogin = (req, res, next) => {
    UserService.createOtp(req.body, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            message: "Success",
            data: results
        });
    });
};

exports.verifyOTP = (req,res,next)=> {
    UserService.verifyOTP(req.body,(error,results)=>
    {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message:"Seccess",
            data: results,
        })
    });
};

exports.saveLocation = (req,res,next)=> {
    async (req, res) => {
        const { userId, latitude, longitude } = req.body;
        try {
            // Call saveUserLocation function from UserService
            const user = await UserService.saveUserLocation(userId, latitude, longitude);
            res.status(200).json({ message: 'Location saved successfully', user });
        } catch (error) {
            console.error('Error saving location:', error);
            res.status(500).json({ error: 'Failed to save location' });
        }
    }
};