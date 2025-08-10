
import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'recruiter'),
        allowNull: false,
        validate: {
            isIn: [['student', 'recruiter']]
        }
    },
    profile: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null, // ✅ CRITICAL FIX: Use null instead of complex object
        get() {
            const value = this.getDataValue('profile');
            // ✅ Handle null/undefined values properly
            if (!value) {
                return {
                    bio: null,
                    skills: [],
                    resume: null,
                    resumeOriginalName: null,
                    companyId: null,
                    profilePhoto: ""
                };
            }
            return value;
        },
        set(value) {
            // ✅ Ensure we're setting a proper object
            if (!value || value === null) {
                this.setDataValue('profile', null);
            } else {
                // Clean the object to ensure it's serializable
                const cleanValue = {
                    bio: value.bio || null,
                    skills: Array.isArray(value.skills) ? value.skills : [],
                    resume: value.resume || null,
                    resumeOriginalName: value.resumeOriginalName || null,
                    companyId: value.companyId || null,
                    profilePhoto: value.profilePhoto || ""
                };
                this.setDataValue('profile', cleanValue);
            }
        }
    }
}, {
    tableName: "user",
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    // ✅ Add these options for better JSON handling
    hooks: {
        beforeCreate: (user) => {
            if (!user.profile) {
                user.profile = {
                    bio: null,
                    skills: [],
                    resume: null,
                    resumeOriginalName: null,
                    companyId: null,
                    profilePhoto: ""
                };
            }
        },
        beforeUpdate: (user) => {
            if (user.changed('profile') && user.profile) {
                // Ensure profile is a clean object
                const profile = user.profile;
                user.profile = {
                    bio: profile.bio || null,
                    skills: Array.isArray(profile.skills) ? profile.skills : [],
                    resume: profile.resume || null,
                    resumeOriginalName: profile.resumeOriginalName || null,
                    companyId: profile.companyId || null,
                    profilePhoto: profile.profilePhoto || ""
                };
            }
        }
    }
});

export default User;
