import { Popconfirm, Button, Checkbox } from "antd"; // Import Checkbox
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaCalendarAlt } from "react-icons/fa";

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const formatDate = (date) => {
    if (!date) return "No date";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div
      className={`bg-card p-5 rounded-lg border border-border shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md ${task.completed ? "opacity-60" : ""
        }`}
    >
      {/* Card Header with Checkbox, Title, and Actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-x-3">
          <Checkbox
            checked={task.completed}
            onChange={onToggleComplete}
            className="mt-1"
          />
          <h3
            className={`text-lg font-bold text-foreground pr-4 ${task.completed ? "line-through text-muted-foreground" : ""
              }`}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex gap-x-2">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "var(--muted-foreground)" }} />}
            onClick={onEdit}
            className="flex items-center justify-center !w-8 !h-8 hover:!bg-muted"
          />
          <Popconfirm
            title="Delete this task?"
            description="This action cannot be undone."
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="flex items-center justify-center !w-8 !h-8 hover:!bg-red-500/10"
            />
          </Popconfirm>
        </div>
      </div>

      {/* Card Body */}
      <p className="text-muted-foreground text-sm mb-4">{task.description}</p>

      {/* Card Footer */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <FaCalendarAlt />
          <span>{formatDate(task.date)}</span>
        </div>
        {/* The text-based status indicator is no longer needed */}
      </div>
    </div>
  );
}