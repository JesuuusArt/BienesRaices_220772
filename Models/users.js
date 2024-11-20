import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
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
}, {
    hooks: {
        beforeCreate: async function(user) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
    }
})

export default User