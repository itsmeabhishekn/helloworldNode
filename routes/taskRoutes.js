const express = require('express');
const authenticateUser = require('../routes/authMiddleware');
const Task = require('../models/Task');

const router = express.Router();

// Example route using the authentication middleware
router.get('/', authenticateUser, async (req, res) => {
    try {
        console.log('inside try');
        // Use the userId attached to the request object to retrieve user-specific tasks
        const tasks = await Task.find({ user: req.userId });
        console.log(tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add task route
router.post('/', authenticateUser, async (req, res) => {
    try {
        console.log('inside post');
        // Extract the task details from the request body
        const { title, description, completed } = req.body;

        // Create a new task object
        const newTask = new Task({
            title,
            description,
            user: req.userId,
            completed
        });

        // Save the task to the database
        await newTask.save();

        // Respond with success message
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route to update a task
router.put('/:taskId', authenticateUser, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, completed } = req.body;
        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this task' });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed || task.completed;


        await task.save();

        // Respond with success message
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        // Handle errors
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE route to delete a task
router.delete('/:taskId', authenticateUser, async (req, res) => {
    try {
        const { taskId } = req.params;
        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this task' });
        }
        await Task.findByIdAndDelete(taskId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
