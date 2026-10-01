import Project from '../models/Project.js';
import Task from '../models/Task.js';

export async function listProjects(req, res) {
  const projects = await Project.find({ owner: req.userId }).sort({ updatedAt: -1 }).lean();
  return res.json({ projects });
}

export async function createProject(req, res) {
  const project = await Project.create({ ...req.validated.body, owner: req.userId });
  return res.status(201).json({ project });
}

export async function getProject(req, res) {
  const project = await Project.findOne({ _id: req.validated.params.projectId, owner: req.userId }).lean();
  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found.' } });
  }
  return res.json({ project });
}

export async function updateProject(req, res) {
  const project = await Project.findOneAndUpdate(
    { _id: req.validated.params.projectId, owner: req.userId },
    { $set: req.validated.body },
    { new: true, runValidators: true },
  ).lean();
  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found.' } });
  }
  return res.json({ project });
}

export async function deleteProject(req, res) {
  const project = await Project.findOneAndDelete({ _id: req.validated.params.projectId, owner: req.userId });
  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found.' } });
  }
  await Task.deleteMany({ project: project.id, owner: req.userId });
  return res.status(204).end();
}