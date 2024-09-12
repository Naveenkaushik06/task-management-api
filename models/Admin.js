const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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
    enum: ["Admin"], 
    default: "Admin",
    required: true
  },
  permissions: {
    type: [String],  // List of permissions that admin may have
    default: ['manage_users', 'manage_tasks', 'view_reports']  // Example permissions
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
