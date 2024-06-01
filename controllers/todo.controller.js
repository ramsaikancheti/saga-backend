const Todo = require('../models/todo.model');

exports.createTodo = async (req, res) => {
    try {
        const { title, category } = req.body;
        const image = req.file.filename;

        const newTodo = new Todo({
            title,
            category,
            image
        });

        await newTodo.save();

        res.status(201).json({ success: true, message: 'added to ToDo successfully' });
    } catch (error) {
        console.error('Error creating ToDo entry:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getTodoData = async (req, res) => {
    try {
        const todoData = await Todo.find();
        res.status(200).json(todoData);
    } catch (error) {
        console.error('Error fetching ToDo data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.params;

        const deletedTodo = await Todo.findOneAndDelete({ todoId });

        if (!deletedTodo) {
            return res.status(404).json({ error: 'ToDo not found' });
        }

        res.status(200).json({ success: true, message: 'ToDo deleted successfully' });
    } catch (error) {
        console.error('Error deleting ToDo:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};