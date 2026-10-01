import Project from '../models/Project.js';
import Task from '../models/Task.js';

export async function listTasks(req, res) {
  const projectId = req.validated.params.projectId;
  const projectExists = await Project.exists({ _id: projectId, owner: req.userId });
  if (!projectExists) {
    return res.status(404).json({ error: { message: 'Project not found.' } });
  }

  const tasks = await Task.find({ project: projectId, owner: req.userId }).sort({ updatedAt: -1 }).lean();
  return res.json({ tasks });
}

export async function createTask(req, res) {
  const projectId = req.validated.params.projectId;
  const projectExists = await Project.exists({ _id: projectId, owner: req.userId });
  if (!projectExists) {
    return res.status(404).json({ error: { message: 'Project not found.' } });
  }

  const task = await Task.create({ ...req.validated.body, project: projectId, owner: req.userId });
  return res.status(201).json({ task });
}

export async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.validated.params.taskId, owner: req.userId }).lean();
  if (!task) {
    return res.status(404).json({ error: { message: 'Task not found.' } });
  }
  return res.json({ task });
}

export async function updateTask(req, res) {
  const task = await Task.findOneAndUpdate(
    { _id: req.validated.params.taskId, owner: req.userId },
    { $set: req.validated.body },
    { new: true, runValidators: true },
  ).lean();
  if (!task) {
    return res.status(404).json({ error: { message: 'Task not found.' } });
  }
  return res.json({ task });
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.validated.params.taskId, owner: req.userId });
  if (!task) {
    return res.status(404).json({ error: { message: 'Task not found.' } });
  }
  return res.status(204).end();
}