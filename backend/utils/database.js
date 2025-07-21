import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "mysql",
    host:"localhost",
    port: 3306,
    database: "jobhunt",
    username: "root",
    password: "",
    logging: (msg) => {
        // Only show actual errors, not routine SQL
        if (msg.includes('ERROR') || msg.includes('error') || msg.includes('failed')) {
          console.log('Database Error:', msg);
        }
    },
    pool:{
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

export default sequelize;