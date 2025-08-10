
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        console.log({ fullName, email, phoneNumber, password, role });
        console.log("File uploaded:", req.file ? "Yes" : "No");
        
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile picture upload
        let profilePhoto = null;
        if (req.file) {
            // If using disk storage (recommended)
            if (req.file.filename) {
                profilePhoto = `/public/uploads/images/${req.file.filename}`;
            }
            // If using memory storage
            else if (req.file.buffer) {
                // You'd need to save the buffer to disk here
                console.log("File received in memory, size:", req.file.buffer.length);
            }
        }

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: profilePhoto ? { profilePhoto } : {}
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log("Error in register:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            });
        }

        const tokenData = {
            userId: user.id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict' 
        }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true
        });
    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("=== UPDATE PROFILE REQUEST ===");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // Parse skills properly
        let skillsArray = [];
        if (skills) {
            if (typeof skills === 'string') {
                try {
                    skillsArray = JSON.parse(skills);
                } catch (e) {
                    skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill);
                }
            } else if (Array.isArray(skills)) {
                skillsArray = skills;
            }
        }

        console.log("Parsed skills:", skillsArray);

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        console.log("Current user profile:", user.profile);

        // Prepare updates
        const updates = {};

        // Basic field updates
        if (fullName !== undefined && fullName !== null) updates.fullName = fullName;
        if (email !== undefined && email !== null) updates.email = email;
        if (phoneNumber !== undefined && phoneNumber !== null) updates.phoneNumber = phoneNumber;

        // ✅ FIXED: Create a new profile object properly
        const currentProfile = user.profile || {};
        const newProfile = {
            bio: bio !== undefined ? bio : currentProfile.bio,
            skills: skillsArray.length > 0 ? skillsArray : currentProfile.skills || [],
            resume: currentProfile.resume,
            resumeOriginalName: currentProfile.resumeOriginalName,
            companyId: currentProfile.companyId,
            profilePhoto: currentProfile.profilePhoto || ""
        };

        // Handle file uploads
        if (req.files) {
            if (req.files.file && req.files.file[0]) {
                const resumeFile = req.files.file[0];
                newProfile.resume = `/public/uploads/images/${resumeFile.filename}`;
                newProfile.resumeOriginalName = resumeFile.originalname;
                console.log("Resume file processed:", resumeFile.filename);
            }
            
            if (req.files.profilePhoto && req.files.profilePhoto[0]) {
                const photoFile = req.files.profilePhoto[0];
                newProfile.profilePhoto = `/public/uploads/images/${photoFile.filename}`;
                console.log("Profile photo processed:", photoFile.filename);
            }
        }

        // Only update profile if there are changes
        const profileChanged = JSON.stringify(newProfile) !== JSON.stringify(currentProfile);
        if (profileChanged || bio !== undefined || skillsArray.length > 0 || req.files) {
            updates.profile = newProfile;
        }

        console.log("Updates to apply:", updates);

        
        if (Object.keys(updates).length > 0) {
            await user.update(updates);
        }

        
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        console.log("=== UPDATE SUCCESSFUL ===");
        console.log("New profile:", updatedUser.profile);

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error("=== UPDATE PROFILE ERROR ===");
        console.error("Error:", error);
        console.error("Error stack:", error.stack);
        
        return res.status(500).json({
            message: "Internal server error: " + error.message,
            success: false
        });
    }
};
