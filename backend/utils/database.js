import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "mysql",
    host:"localhost",
    port: 3306,
    database: "jobhunt",
    username: "root",
    password: "",
    logging: console.log,
    pool:{
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

export default sequelize;