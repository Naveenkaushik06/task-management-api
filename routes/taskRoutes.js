// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { restrictTo } = require("../middlewares/rbac");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
  viewAssignedTasks,
  updateTaskAssignment,
} = require("../controllers/taskController");

router.route("/").post(protect, createTask).get(protect, getTasks);

router
  .route("/:taskId")
  .patch(protect, restrictTo("Admin", "User"), updateTask)
  .delete(protect, restrictTo("Admin"), deleteTask);

// Assign task to a user (Manager only)
router.post('/assign', protect, restrictTo('Manager'), assignTask);

// View assigned tasks (Users see their own, Managers see their team's)
router.get('/assigned', protect, viewAssignedTasks);

// Update task assignment (Manager only)
router.patch('/updateAssignment', protect, restrictTo('Manager'), updateTaskAssignment);

module.exports = router;