import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../controllers/projectController.js';
import { createTask, listTasks } from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import {
  projectCreateSchema,
  projectIdSchema,
  projectUpdateSchema,
  taskCreateSchema,
} from '../middleware/schemas.js';

const router = Router();

router.get('/', listProjects);
router.post('/', validate('body', projectCreateSchema), createProject);
router.get('/:projectId', validate('params', projectIdSchema), getProject);
router.patch('/:projectId', validate('params', projectIdSchema), validate('body', projectUpdateSchema), updateProject);
router.delete('/:projectId', validate('params', projectIdSchema), deleteProject);
router.get('/:projectId/tasks', validate('params', projectIdSchema), listTasks);
router.post('/:projectId/tasks', validate('params', projectIdSchema), validate('body', taskCreateSchema), createTask);

export default router;