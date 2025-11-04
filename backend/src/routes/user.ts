import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// Basic CRUD operations for users
router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, name, role, companyId } = req.body;
    const user = await prisma.user.create({
      data: { email, name, role, companyId }
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as userRouter };
