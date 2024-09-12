const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'User'],
    default: 'User',
  },
  team: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      validate: {
        // Ensure that only Managers can have a team
        validator: function () {
          return this.role === 'Manager';
        },
        message: 'Only Managers can manage a team.',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to enforce only Managers have teams
UserSchema.pre('save', function (next) {
  // If the user is not a Manager but has a team, throw an error
  if (this.role !== 'Manager' && this.team && this.team.length > 0) {
    return next(new Error('Only Managers can have a team.'));
  }
  next();
});

// Middleware to allow Admin to bypass the team validation
UserSchema.methods.isAdmin = function () {
  return this.role === 'Admin';
};

module.exports = mongoose.model('User', UserSchema);
