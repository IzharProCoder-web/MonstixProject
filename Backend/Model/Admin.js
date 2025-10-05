import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    monitoredTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    dashboardStats: {
      totalUsers: { type: Number, default: 0 },
      totalTasks: { type: Number, default: 0 },
      activeTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;