import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function requireRole(...roles: Role[]): (req: Request, res: Response, next: NextFunction) => any;
export declare function requireCompanyAccess(req: Request, res: Response, next: NextFunction): any;
//# sourceMappingURL=auth.d.ts.map