import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Application = sequelize.define("application",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    job: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'job',
            key: 'id'
        }
    },
    applicant:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending','accepted','rejected'),
        allowNull: false,
        validate: {
            isIn: [['pending','accepted','rejected']]
        },
        defaultValue:'pending'
    },

},
{ tableName: "application", timestamps: true }
);

export default Application

