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
adminRouter.get("/admin-logout", adminAuthenticated, adminLogout );
adminRouter.get("/check-auth", adminAuthenticated, checkAuth, );
adminRouter.post("/create-task", adminAuthenticated, createTask);
adminRouter.put("/update-task/:id", adminAuthenticated,updateTask);
adminRouter.delete("/delete-task/:id", adminAuthenticated, deleteTask);
adminRouter.get("/get-tasks", getAllTasks);
adminRouter.get("/complete-tasks", adminAuthenticated, completedTask);
adminRouter.get("/inprogress-tasks", adminAuthenticated, inProgressTask );
adminRouter.get("/pending-tasks", adminAuthenticated, PendingTask, );
adminRouter.put("/update-user/:id", updateUser);
adminRouter.delete("/delete-user/:id", adminAuthenticated, deleteUser);

export default adminRouter;
