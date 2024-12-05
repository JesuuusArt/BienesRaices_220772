import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../db/config.js';

const User = db.define('Users', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate: { 
        type: DataTypes.DATE,
        allowNull: true, 
    },
    token: DataTypes.STRING,
    confirm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) { 
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

export default User;
