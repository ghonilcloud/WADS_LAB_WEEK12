import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../../api/axios";

const MyTaskComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
    
    // Listen for taskAdded events from AddTaskComponent
    const handleTaskAdded = () => {
      fetchTasks();
    };
    
    window.addEventListener('taskAdded', handleTaskAdded);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('taskAdded', handleTaskAdded);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    document.getElementById("update-modal").showModal();
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    try {
      setLoading(true);
      await api.put(`/tasks/${selectedTask._id}`, {
        title: updatedTitle,
        description: updatedDescription,
        completed: selectedTask.completed
      });
      
      // Update task in state
      setTasks(tasks.map(task => 
        task._id === selectedTask._id 
          ? { 
              ...task, 
              title: updatedTitle, 
              description: updatedDescription,
              completed: selectedTask.completed 
            }
          : task
      ));
      
      toast.success('Task updated successfully!');
      document.getElementById("update-modal").close();
      setLoading(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success('Task deleted successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newCompletedStatus = !task.completed;
      
      await api.put(`/tasks/${task._id}`, {
        completed: newCompletedStatus
      });
      
      // Update task in state
      setTasks(tasks.map(t => 
        t._id === task._id 
          ? { ...t, completed: newCompletedStatus }
          : t
      ));
      
      toast.success(newCompletedStatus 
        ? 'Task marked as completed!' 
        : 'Task marked as incomplete!');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  return (
    <div>
      {loading && <p className="text-gray-600">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-gray-500">No tasks available.</p>
      )}

      {!loading &&
        tasks.map((task) => (
          <div
            key={task._id}
            className={`flex flex-col gap-2 mt-2 p-3 text-white rounded-md shadow-md ${
              task.completed ? 'bg-green-900' : 'bg-green-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <h1 className={`text-xl font-semibold mb-2 ${
                task.completed ? 'line-through opacity-70' : ''
              }`}>{task.title}</h1>
              
              <button
                onClick={() => handleToggleComplete(task)}
                className="text-white text-2xl hover:scale-110 transition-transform"
                title={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? (
                  <MdCheckBox className="text-green-300" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-green-300" />
                )}
              </button>
            </div>
            
            <p className={`text-sm text-gray-100 ${
              task.completed ? 'line-through opacity-70' : ''
            }`}>{task.description}</p>

            <div className="flex w-full justify-end items-center gap-4 mt-4">
              <button
                className="btn btn-primary text-white flex gap-1 px-3"
                onClick={() => handleEdit(task)}
              >
                <FaRegEdit className="text-base" />
                Edit
              </button>

              <button
                className="btn btn-error bg-red-600 text-white flex gap-1 px-3"
                onClick={() => handleDelete(task._id)}
              >
                <MdDeleteOutline className="text-lg" />
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* Modal Popup for Update Task (DaisyUI component) */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Task</h3>
          <div className="py-4">
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />

            <label className="block text-gray-700 font-medium mt-3">
              Description
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            ></textarea>
            
            <div className="mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedTask?.completed || false}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask,
                    completed: e.target.checked
                  })}
                />
                <span>Mark as completed</span>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary text-white"
              onClick={handleUpdateTask}
            >
              Save Changes
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyTaskComponent;
