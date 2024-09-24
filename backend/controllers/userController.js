const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
var cloudinary = require('cloudinary').v2;

const updateUser = async (req, res) => {
    const {fullName, email, username, currentPassword, newPassword, role} = req.body;
    let {profileImg} = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ message: "Please enter both current and new password" });
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if(newPassword.length < 6) {
                return res.status(400).json({ message: "New password should be atleast 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg) {
            console.log('Uploading new profile image');
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
                folder: 'Elegant'
              })
            profileImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profileImg = profileImg || user.profileImg;
        user.role = role || user.role;

        user = await user.save();

        user.password =  null;

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser:", error.message)
        res.status(500).json({ error: error.message });
    }
}

module.exports = { updateUser };