import express from 'express';
import accountRouter from './account/router';
import profileRouter from './profile/router';

const router = express.Router();

router.use(express.json());
router.use('/api/accounts', accountRouter);
router.use('/api/profiles', profileRouter);
export default router;