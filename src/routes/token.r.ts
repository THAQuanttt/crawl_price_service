import express from 'express';

import { validator } from '../shared/middlewares/validator';
import { fetchTokenSchema } from '../schemas/token.schema';
const router = express.Router();


import TokensController from '../controllers/token.controller';

router.get('/',
    validator(
        {
            query: fetchTokenSchema
        }
    ), TokensController.getOne);

// router.get('/price',
//     validator(
//         {
//             query: fetchTokenSchema
//         }
//     ), TokensController.executeCronjobs);


export default router;