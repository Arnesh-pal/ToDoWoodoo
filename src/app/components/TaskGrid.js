import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaClipboardList } from "react-icons/fa";

export default function TaskGrid({
  tasks,
  filter,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete, // <-- Receive the new prop
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleSaveTask = async (taskData) => {
    if (currentTask) {
      await onUpdateTask({ ...currentTask, ...taskData });
    } else {
      await onAddTask(taskData);
    }
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const openModalForNewTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const openModalForEditTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return filter === "completed" ? task.completed === true : task.completed !== true;
  });

  return (
    <div className="w-full">
      {/* Header with a prominent "Add Task" button */}
      <div className="flex justify-end items-center mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="!bg-primary hover:!bg-primary/90 !shadow-lg !shadow-primary/20"
          onClick={openModalForNewTask}
        >
          Add New Task
        </Button>
      </div>

      {/* Grid or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => openModalForEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onToggleComplete={() => onToggleComplete(task)} // <-- Pass the function to the card
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-[300px] text-center bg-card border-2 border-dashed border-border rounded-lg p-4">
          <FaClipboardList size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No tasks here!
          </h3>
          <p className="text-muted-foreground mb-6">
            Click &quot;Add New Task&quot; to get started.
          </p>
        </div>
      )}

      {/* The Modal for adding/editing tasks */}
      <TaskModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editTask={currentTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}