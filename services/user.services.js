
const jwt = require('jsonwebtoken');
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";
const UserModel = require("../model/user_model");

class UserService {
    static async registerUser(email, phone, password, userType) {
        try {
            const createUser = new UserModel({ email, phone, password, userType });
            const user = await createUser.save();
            console.log('your new user id is '+user._id);
            return user._id; // Return the user ID upon successful registration
        } catch (error) {
            throw error;
        }
    }


    
    static async checkUser(emailOrPhone) {
        try {
            // Check if the input matches an email format
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);

            let user;
            if (isEmail) {
                // If input is an email, search for user by email
                user = await UserModel.findOne({ email: emailOrPhone });
            } else {
                // If input is not an email, assume it's a phone number and search for user by phone
                user = await UserModel.findOne({ phone: emailOrPhone });
            }

            return user;
        } catch (error) {
            throw error;
        }
    };



    // services/userService.js

    static async saveUserLocation(userId, latitude, longitude) {
        try {
          const user = await UserModel.findByIdAndUpdate(
            userId, 
            { latitude, longitude }, 
            { new: true } 
          );
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        } catch (error) {
          throw error;
        }
      };
      

      // that funtions help us to show all  towers on the app 
     static async getTowerLocations() {
        try {
            const towers = await TowerModel.find({ type: 'tower' }).select('latitude longitude');
            return towers;
        } catch (error) {
            throw error;
        }
    };
    
        // that one help us to get tower info like number when driver tap on the spicified tower on the map

static async getTowerInfo (towerId)  {
    try {
        const tower = await TowerModel.findOne({ _id: towerId, type: 'tower' });
        return tower;
    } catch (error) {
        throw error;
    }
};


    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
    };

    // Function to create or generate an OTP of 5 digits
    static async createOtp(params, callback) {
        const otp = otpGenerator.generate(5, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        const ttl = 5 * 60 * 1000; // OTP validity period: 5 minutes
        const expires = Date.now() + ttl; // Calculate expiration time
        const data = `${params.phone}.${otp}.${expires}`; // Concatenate phone, OTP, and expiration time
        const hash = crypto.createHash("sha256", key).update(data).digest("hex"); // Generate hash
        const fullHash = `${hash}.${expires}`; // Combine hash and expiration time

        console.log(`Your OTP is: ${otp}`);

        return callback(null, fullHash);
    }

    // Function to verify the OTP
    static async verifyOTP(params, callback) {
        try {
            let [hashValue, expires] = params.hash.split('.'); // Split hash and expiration time
            expires = parseInt(expires); // Parse expiration time as integer

            let now = Date.now(); // Get current time
            if (now > expires) {
                console.log("OTP expired:", expires);
                return callback("OTP expired");
            }

            // Recreate the data used during OTP generation
            let data = `${params.phone}.${params.otp}.${expires}`;
            // Recreate the hash using the same key and data
            let newCalculateHash = crypto.createHash("sha256", key).update(data).digest("hex");

            console.log("Expected hash:", hashValue);
            console.log("Calculated hash:", newCalculateHash);

            // Compare the newly calculated hash with the provided hash
            if (newCalculateHash === hashValue) {
                console.log("OTP verification successful");
                return callback(null, "success");
            } else {
                console.log("Invalid OTP");
                return callback("Invalid OTP");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return callback("Error verifying OTP");
        }
    }

    
}

module.exports = UserService;
