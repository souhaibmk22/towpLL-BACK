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


// that one use it on the profile page to get the user information 
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userProfile = await UserService.getUserProfile(userId);
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};


// that one use it on the profile page to update the user information 

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUserData = req.body;
        await UserService.updateUserProfile(userId, updatedUserData);
        res.json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update ' });
    }
};


// that one use it on the profile page delete the user  

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await UserService.deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};




// update the user location
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



//that one help us to show all towers on map 
    exports.getTowerLocations = async (req, res) => {
        try {
            const towers = await towerService.getTowerLocations();
            res.json(towers);
        } catch (error) {
            console.error('Error fetching tower locations:', error);
            res.status(500).json({ error: 'Failed to fetch tower locations' });
        }}




// that one help us to get tower info like number when driver tap on the spicified tower on the map
        exports.getTowerInfo = async (req, res) => {
            const towerId = req.params.id;
            try {
                const tower = await towerService.getTowerInfo(towerId);
                if (!tower) {
                    return res.status(404).json({ message: 'Tower not found' });
                }
                res.json(tower);
            } catch (error) {
                console.error('Error fetching tower information:', error);
                res.status(500).json({ error: 'Failed to fetch tower information' });
            }
        };

};