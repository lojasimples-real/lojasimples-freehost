const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        document: { type: String, required: true },
        phone_number: { type: String, required: true }
    },
    password: { type: String },
    plan: {
        name: { type: String },
        charge_frequency: { type: String } 
    },
    isActive: { type: Boolean, default: false },
    licenseStatus: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },

    passwordResetToken: { type: String },
    tokenExpires: { type: Date }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);