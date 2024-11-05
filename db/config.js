import { Sequelize } from "sequelize";

const db = new Sequelize('bienesraices_220772', 'JesuusArt', 'pass123', {
    host: "localhost",
    port: 3307,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    port: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    operatorsAliases: false
})

export default db;