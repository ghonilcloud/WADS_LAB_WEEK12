import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AddTaskComponent = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle || !taskDesc) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDesc,
      });

      toast.success("Task added successfully!");

      // Reset form
      setTaskTitle("");
      setTaskDesc("");

      // Trigger task refresh in parent component (we'll implement a custom event)
      window.dispatchEvent(new Event("taskAdded"));

      setLoading(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-1/4 flex-col gap-2 bg-green-100 rounded-md p-4">
        <h1 className="text-green-900 font-semibold text-lg">Add Your Task</h1>
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <input
            type="text"
            id="taskTitle"
            placeholder="Task Title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="p-3 w-full text-white rounded-md border-gray-100 bg-green-800 shadow-xs text-sm placeholder:text-gray-300"
          />

          <textarea
            id="taskDesc"
            cols="30"
            rows="12"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            className="p-3 rounded-md text-sm w-full text-white border-gray-100 bg-green-800 placeholder:text-gray-300 resize-none"
            placeholder="Write your task here..."
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full px-4 py-2 text-sm text-white rounded-md bg-green-600 hover:bg-green-800 transition ease-in-out"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTaskComponent;
