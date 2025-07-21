import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Job = 
     sequelize.define("job", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        requirements: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        jobType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        company: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'company', 
                key: 'id'
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', 
                key: 'id'
            }
        },
        applications: {
            type: DataTypes.JSON, 
            allowNull: true,
            defaultValue: [], 
        }
    },
    { tableName: "job", timestamps: true }
    );


export default Job
