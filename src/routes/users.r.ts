import express from 'express';
const router = express.Router();

// const upload = multer({ dest: 'src/uploads/' });
// upload.single('file')

import usersController from '../controllers/users.c';

router.get('/', usersController.getAll);
router.get('/email', usersController.getUserInformation);

router.post('/', usersController.create);

router.patch('/:id/role', usersController.updateRole)

router.delete('/:id', usersController.deleteUser)

export default router;