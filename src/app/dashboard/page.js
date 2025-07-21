"use client";
import { useState, useEffect } from "react";
import { message } from "antd";
import Sidebar from "../components/Sidebar";
import TaskGrid from "../components/TaskGrid";
import FocusGraph from "../components/FocusGraph";
import StickyNotes from "../components/StickyNotes";
import PomodoroTimer from "../components/PomodoroTimer";
import { FaBars } from "react-icons/fa";

export default function Dashboard() {
    // State Management
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("all");
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [taskSummary, setTaskSummary] = useState({
        tasksCompletedToday: 0,
        focusSessionsToday: 0,
        totalFocusTime: 0,
    });

    const handleToggleComplete = async (taskToToggle) => {
        const updatedTaskData = { ...taskToToggle, completed: !taskToToggle.completed };

        try {
            const response = await fetch(`/api/tasks/${taskToToggle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTaskData),
            });
            if (!response.ok) throw new Error('Failed to update task status');

            const updatedTask = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        } catch (error) {
            console.error("Error toggling task complete:", error);
            message.error('Failed to update task status');
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            await Promise.all([fetchTasks(), fetchFocusData()]);
            setLoading(false);
        };
        initialLoad();

        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            message.error("Failed to load tasks");
        }
    };

    const fetchFocusData = async () => {
        try {
            const res = await fetch("/api/focus");
            if (!res.ok) throw new Error("Failed to fetch focus data");
            const { tasksCompleted, focusData } = await res.json();
            const today = new Date().toLocaleDateString("en-CA");

            const tasksToday = tasksCompleted.find((t) => t.createdAt === today)?._count.completed || 0;
            const focusToday = focusData.find((f) => f.date === today)?._sum.duration || 0;

            setTaskSummary({
                tasksCompletedToday: tasksToday,
                focusSessionsToday: focusToday > 0 ? Math.floor(focusToday / 25) : 0,
                totalFocusTime: focusToday,
            });
        } catch (error) {
            console.error("Error fetching focus data:", error);
            message.error("Failed to load focus data");
        }
    };

    const handleAddTask = async (newTaskData) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskData),
            });
            if (!response.ok) throw new Error('Failed to add task');
            const savedTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, savedTask]);
            message.success('Task added successfully!');
        } catch (error) {
            console.error("Error adding task:", error);
            message.error('Failed to add task');
        }
    };

    const handleUpdateTask = async (updatedTaskData) => {
        try {
            const response = await fetch(`/api/tasks/${updatedTaskData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTaskData),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
            message.success('Task updated!');
        } catch (error) {
            console.error("Error updating task:", error);
            message.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete task');
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            message.success('Task deleted.');
        } catch (error) {
            console.error("Error deleting task:", error);
            message.error('Failed to delete task');
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <div className="hidden lg:block lg:w-64">
                <Sidebar onFilterChange={setFilter} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {isMobile && (
                <>
                    <div className="fixed top-0 left-0 right-0 z-30 flex items-center p-4 bg-background/80 backdrop-blur-sm border-b border-border">
                        <button onClick={() => setSidebarVisible(true)} className="text-foreground p-2 focus:outline-none">
                            <FaBars size={24} />
                        </button>
                        <h1 className="ml-4 text-xl font-bold">Task Manager</h1>
                    </div>
                    {sidebarVisible && (
                        <div id="backdrop" className="fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarVisible(false)}>
                            <div className="w-64 h-full bg-card" onClick={(e) => e.stopPropagation()}>
                                <Sidebar onFilterChange={setFilter} activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />
                            </div>
                        </div>
                    )}
                </>
            )}

            <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8">
                <h1 className="text-3xl font-bold mb-6">📝 All Tasks</h1>

                <TaskGrid
                    tasks={tasks}
                    filter={filter}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                    loading={loading}
                />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PomodoroTimer />
                    <StickyNotes />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FocusGraph />
                    <div className="bg-card border border-border p-6 rounded-lg shadow-sm text-foreground">
                        <h2 className="text-lg font-bold mb-4">📅 Today&apos;s Summary</h2>
                        <ul className="text-md space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="text-muted-foreground">✅ Tasks Completed</span>
                                <span className="font-bold text-green-400 text-lg">{taskSummary.tasksCompletedToday}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-muted-foreground">⏳ Focus Sessions</span>
                                <span className="font-bold text-yellow-400 text-lg">{taskSummary.focusSessionsToday}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-muted-foreground">🔥 Total Focus Time</span>
                                <span className="font-bold text-blue-400 text-lg">{taskSummary.totalFocusTime} min</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
