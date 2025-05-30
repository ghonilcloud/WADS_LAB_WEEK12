import TodolistModel from "../models/todolistModel.js";

export const validateTodoFields = (req, res, next) => {
    const { todo_name, todo_status } = req.body;
    
    if (!todo_name) {
        return res.status(400).json({ message: "Todo name is required" });
    }

    if (todo_status && !["active", "finished"].includes(todo_status)) {
        return res.status(400).json({ message: "Todo status must be either 'active' or 'finished'" });
    }

    next();
};

export const validateTodoId = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid todo ID format" });
        }

        const todo = await TodolistModel.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        req.todo = todo;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};