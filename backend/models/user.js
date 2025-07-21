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
        type: DataTypes.INTEGER,
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
        defaultValue: {
            bio: null,
            skills: [],
            resume: null,
            resumeOriginalName: null,
            companyId: null, // Foreign key reference
            profilePhoto: ""
        }
    }
},
    { tableName: "user", timestamps: true,createdAt: 'createdAt',updatedAt: 'updatedAt' }
);


export default User;