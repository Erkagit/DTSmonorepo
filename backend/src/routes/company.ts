import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// GET /api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            orders: true,
          },
        },
      },
    });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// POST /api/companies
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check if company already exists
    const existing = await prisma.company.findUnique({
      where: { name },
    });

    if (existing) {
      return res.status(400).json({ error: 'Company with this name already exists' });
    }

    const company = await prisma.company.create({
      data: { name },
    });

    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

export { router as companyRouter };
