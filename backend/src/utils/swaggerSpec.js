import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meeting Room Booking API",
      version: "1.0.0",
      description: `
API documentation for the Meeting Room Booking App backend.

## Authentication

This API uses JWT Bearer token authentication.

### How to get a token:

1. **Register a new user** (POST /api/auth/register)
   - Email: test@example.com
   - Password: password123

2. **Login** (POST /api/auth/login)
   - Use the same credentials
   - Response includes \`accessToken\`

3. **Use the token in Swagger UI:**
   - Click the "Authorize" button (🔒) at the top
   - Enter: \`Bearer YOUR_ACCESS_TOKEN_HERE\`
   - Or just: \`YOUR_ACCESS_TOKEN_HERE\` (Bearer prefix is added automatically)

### Token Format:
- Access tokens expire in 15 minutes
- Refresh tokens are stored in httpOnly cookies
- Use the refresh endpoint to get a new access token

### Example:
\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`
      `,
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token. Get it from /api/auth/login endpoint.",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;



