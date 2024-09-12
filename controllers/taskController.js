const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user._id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get tasks by user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        console.log("Task found"+task);
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        // Log the received parameters for debugging
        console.log(`Deleting task with ID: ${taskId} for user ID: ${userId}`);

        // Ensure the user has the Admin role
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied: Only Admins can delete tasks' });
        }

        // Find and delete the task with the provided ID
        const task = await Task.findOneAndDelete({ _id: taskId });

        // Log the result for debugging
        console.log('Deleted task:', task);

        // Check if the task was found and deleted
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respond with a success message if the task was deleted
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error deleting task:', error);

        // Respond with a generic error message and a 400 status
        res.status(400).json({ message: error.message });
    }
};


// Assign a task to a user
exports.assignTask = async (req, res) => {
    try {
        const { userId, taskId } = req.body;

        // Check if the requesting user is a Manager
        if (req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Access denied: Only managers can assign tasks' });
        }

        // Ensure that the userId is part of the manager's team
        const manager = await User.findById(req.user._id);
        if (!manager.team.includes(userId)) {
            return res.status(403).json({ message: 'You can only assign tasks to users in your team' });
        }

        // Find the task and assign it to the user
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.user = userId;  // Assign task to the user
        await task.save();

        res.status(200).json({ message: 'Task assigned successfully', task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// View tasks assigned to the user or team
exports.viewAssignedTasks = async (req, res) => {
    try {
        let tasks;
        
        if (req.user.role === 'Manager') {
            // Managers can view tasks assigned to their team
            const team = await User.findById(req.user._id).populate('team');
            const teamIds = team.team.map(member => member._id);
            tasks = await Task.find({ user: { $in: teamIds } });
        } else {
            // Users can only view their own tasks
            tasks = await Task.find({ user: req.user._id });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update task assignment
exports.updateTaskAssignment = async (req, res) => {
    try {
        const { taskId, userId } = req.body;

        // Check if the requesting user is a Manager
        if (req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'Access denied: Only managers can update task assignments' });
        }

        // Ensure that the new userId is part of the manager's team
        const manager = await User.findById(req.user._id);
        if (!manager.team.includes(userId)) {
            return res.status(403).json({ message: 'You can only assign tasks to users in your team' });
        }

        // Find the task and update the assignment
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.user = userId;  // Reassign the task to a new user
        await task.save();

        res.status(200).json({ message: 'Task assignment updated successfully', task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
