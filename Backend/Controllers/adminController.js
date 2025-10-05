import Task from "../Model/Task.js";
import User from "../Model/User.js";
import jwt from "jsonwebtoken";

export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const adminLogout = (req, res) => {
  try {
    res.cookie("admin", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAuth = (req, res) => {
  const token = req.cookies.admin;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
export const createTask = async (req, res) => {
  const {
    title,
    description,
    assignedTasks,
    status,
    dueDate,
    completedAt,
    priority,
  } = req.body;

  try {
    if (!title || !assignedTasks || !status || !priority) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: assignedTasks });
    const newTask = new Task({
      title,
      description,
      assignedTasks: user._id,
      status,
      dueDate,
      completedAt,
      priority,
    });

    await newTask.save();
    return res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    assignedTasks,
    status,
    dueDate,
    completedAt,
    priority,
  } = req.body;

  try {
    if (!title || !assignedTasks || !status || !priority) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }
    let userId = null;
    if (assignedTasks) {
      const user = await User.findOne({ email: assignedTasks });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      userId = user._id;
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (userId) task.assignedTasks = userId;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completedAt !== undefined) task.completedAt = completedAt;
    if (priority !== undefined) task.priority = priority;

    await task.save();

    return res
      .status(200)
      .json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    await Task.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const completedTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" }).populate(
      "assignedTasks",
      "name email"
    );

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const inProgressTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "In Progress" }).populate(
      "assignedTasks",
      "name email"
    );

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const PendingTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Pending" }).populate(
      "assignedTasks",
      "name email"
    );

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTasks", "name email");
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;

  try {
    if (!username || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.username = username;
    user.role = role;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
