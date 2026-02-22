import { Router } from "express";
import authRoutes from "./authRoutes.js";
import roomRoutes from "./roomRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utils/swaggerSpec.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);

// Swagger docs with custom options
router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Meeting Room Booking API",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js",
    ],
  }),
);

export default router;


