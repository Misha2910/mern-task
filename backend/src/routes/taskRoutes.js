import { Router } from 'express';
import { deleteTask, getTask, updateTask } from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { taskIdSchema, taskUpdateSchema } from '../middleware/schemas.js';

const router = Router();

router.get('/:taskId', validate('params', taskIdSchema), getTask);
router.patch('/:taskId', validate('params', taskIdSchema), validate('body', taskUpdateSchema), updateTask);
router.delete('/:taskId', validate('params', taskIdSchema), deleteTask);

export default router;