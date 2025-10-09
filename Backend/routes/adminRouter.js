import express from "express";
import {
  adminLogin,
  adminLogout,
  checkAuth,
  completedTask,
  createTask,
  deleteTask,
  deleteUser,
  getAllTasks,
  inProgressTask,
  PendingTask,
  updateTask,
  updateUser,
} from "../Controllers/adminController.js";
import adminAuthenticated from "../Middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin);
adminRouter.get("/admin-logout", adminLogout, adminAuthenticated);
adminRouter.get("/check-auth", checkAuth, adminAuthenticated);
adminRouter.post("/create-task", createTask, adminAuthenticated);
adminRouter.put("/update-task/:id", updateTask, adminAuthenticated);
adminRouter.delete("/delete-task/:id", deleteTask, adminAuthenticated);
adminRouter.get("/get-tasks", getAllTasks, adminAuthenticated);
adminRouter.get("/complete-tasks", completedTask, adminAuthenticated);
adminRouter.get("/inprogress-tasks", inProgressTask, adminAuthenticated);
adminRouter.get("/pending-tasks", PendingTask, adminAuthenticated);
adminRouter.put("/update-user/:id", updateUser);
adminRouter.delete("/delete-user/:id", deleteUser, adminAuthenticated);

export default adminRouter;
