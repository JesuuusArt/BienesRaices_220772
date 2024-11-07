import { DataTypes } from "sequelize";
import db from "../db/config.js";

const User =  db.define('Users', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirm: DataTypes.BOOLEAN,
})

export default User