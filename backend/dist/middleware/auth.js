"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
exports.requireCompanyAccess = requireCompanyAccess;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function authenticate(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'];
        const userId = req.headers['x-user-id'];
        if (!apiKey || !userId) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please provide x-api-key and x-user-id headers'
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            include: { company: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId || undefined
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: roles,
                current: req.user.role
            });
        }
        next();
    };
}
function requireCompanyAccess(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role === client_1.Role.ADMIN) {
        return next();
    }
    const requestedCompanyId = parseInt(req.params.companyId || req.body?.companyId);
    if (!req.user.companyId) {
        return res.status(403).json({ error: 'User not assigned to any company' });
    }
    if (req.user.companyId !== requestedCompanyId) {
        return res.status(403).json({ error: 'Access denied to this company' });
    }
    next();
}
//# sourceMappingURL=auth.js.map