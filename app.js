import "dotenv/config.js";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import celebratePkg from "celebrate";
import cookieParser from "cookie-parser";
import announcementsRouter from "./src/routes/announcements.routes.js";
import authRouter from "./src/routes/auth.routes.js";

const { isCelebrateError } = celebratePkg;
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/announcements", announcementsRouter);
app.use("/auth", authRouter);
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Announcements API",
      version: "1.0.0",
      description: "A RESTful API for managing announcements",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Announcement: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier",
            },
            title: {
              type: "string",
              description: "Announcement title",
            },
            description: {
              type: "string",
              description: "Announcement description",
            },
            price: {
              type: "number",
              description: "Announcement price",
            },
            category: {
              type: "string",
              enum: ["sale", "service", "job", "other"],
              description: "Announcement category",
            },
            contactInfo: {
              type: "string",
              description: "Contact information",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/announcements", announcementsRouter);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  // Celebrate validation errors
  if (isCelebrateError(error)) {
    const details = {};
    for (const [key, value] of error.details) {
      details[key] = value.details.map((detail) => detail.message);
    }
    return res.status(400).json({ error: "Validation error", details });
  }

  // Prisma P2025 error (record not found)
  if (error.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  // Prisma validation errors
  if (error.code === "P2003" || error.code === "P2014") {
    return res.status(400).json({ error: error.message });
  }

  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  // Generic error
  console.error("Error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger API docs available at http://localhost:${PORT}/api-docs`,
  );
});
