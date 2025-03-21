import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import TaskAssignment from "../components/TaskAssignment";
import TaskList from "../components/TaskList";
import CalendarView from "../components/CalendarView";
import Chart from "../components/Chart";
import ProgressChart from "../components/ProgressChart";
import { io } from "socket.io-client";

const API_BASE_URL = "https://zidio-task-management-api.vercel.app";

// ✅ Improved Socket Connection (WebSocket Preferred)
const socket = io(API_BASE_URL, {
  transports: ["polling"], // ✅ WebSocket First, Polling Fallback
  withCredentials: true,
});

const Home = () => {
  const [tasks, setTasks] = useState([]);

  // ✅ Fetch tasks with Authorization Token
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token
      if (!token) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setTasks(response.data);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      toast.error("Failed to load tasks!");
    }
  };

  // ✅ Add Task with Token & Real-time Update
  const handleAddTask = async (task) => {
    try {
      const token = localStorage.getItem("token"); // Get token
      if (!token) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/tasks`, task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const newTask = response.data;
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // ✅ Emit real-time event
      socket.emit("task-added", newTask);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("❌ Error adding task:", error);
      toast.error("Failed to add task! Check authentication.");
    }
  };

  useEffect(() => {
    fetchTasks();

    // ✅ Real-time task updates
    socket.on("task-updated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    return () => {
      socket.off("task-updated"); // ✅ Clean up event listener
    };
  }, []);

  return (
    <main className="container mx-auto px-4">
      <div className="container flex flex-col md:flex-row items-stretch mx-auto space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 bg-blue-50 rounded-lg p-6 flex flex-col justify-center items-center shadow-lg">
          <h4 className="text-2xl font-semibold text-gray-700 mb-2 text-center">Welcome to</h4>
          <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">Zidio Task Management</h2>
          <p className="text-lg text-gray-600 text-center px-4">
            Stay organized and boost productivity with Zidio. Effortlessly manage, track, and complete your tasks on time.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <TaskAssignment onAddTask={handleAddTask} />
        </div>
      </div>

      <div className="mt-6">
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>

      <div className="mt-6">
        <Chart tasks={tasks} />
      </div>

      <div className="mt-6">
        <ProgressChart tasks={tasks} />
      </div>

      <div className="mt-6">
        <CalendarView tasks={tasks} />
      </div>
    </main>
  );
};

export default Home;