import express, { Request, Response } from 'express';
import { addSchool, listSchools } from '../controller/schoolController';



const router = express.Router();
router.post('/addSchool', async (req, res) => {
  await addSchool(req, res);
});
router.get('/listSchools',async (req, res) => {
  await listSchools(req, res);
});

export default router;