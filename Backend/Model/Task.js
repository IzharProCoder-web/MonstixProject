import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTasks: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {  type: String, required: true },
    dueDate: { type: Date },
    completedAt: { type: Date },
    priority: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
