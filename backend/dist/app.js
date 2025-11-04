"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./middleware/auth");
const company_1 = require("./routes/company");
const user_1 = require("./routes/user");
const device_1 = require("./routes/device");
const vehicle_1 = require("./routes/vehicle");
const order_1 = require("./routes/order");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_1.authMiddleware);
// CRUD endpoints
app.use('/api/companies', company_1.companyRouter);
app.use('/api/users', user_1.userRouter);
app.use('/api/devices', device_1.deviceRouter);
app.use('/api/vehicles', vehicle_1.vehicleRouter);
app.use('/api/orders', order_1.orderRouter);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
exports.default = app;
//# sourceMappingURL=app.js.map