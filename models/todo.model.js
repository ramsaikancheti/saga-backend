const mongoose = require('mongoose');
const path = require('path');

const todoSchema = new mongoose.Schema({
    todoId: { type: Number, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }
});

todoSchema.pre('save', async function (next) {
    try {
        if (!this.isNew) {
            return next();
        }

        const lastTodo = await this.constructor.findOne({}, {}, { sort: { 'todoId': -1 } });

        if (lastTodo && lastTodo.todoId) {
            this.todoId = lastTodo.todoId + 1;
        } else {
            this.todoId = 1;
        }

        this.image = "uploads/todo/" + this.image;

        next();
    } catch (error) {
        console.error('Error generating todoId:', error.message);
        next(error);
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
