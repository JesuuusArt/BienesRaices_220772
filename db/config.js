import { Sequelize } from "sequelize";

const db = new Sequelize('bienesraices_220772', 'root', '1234', {
    host: "localhost",
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: { 
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

export default db;