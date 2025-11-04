import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// Basic CRUD operations for companies
router.get('/', async (_req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const company = await prisma.company.create({
      data: { name }
    });
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as companyRouter };
