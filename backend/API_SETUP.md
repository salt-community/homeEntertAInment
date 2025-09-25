# API Setup Instructions

## Required Environment Variables

To use the image generation feature, you need to set up the following environment variables:

### 1. Create a .env file in the backend directory

Create a file named `.env` in the `/backend` directory with the following content:

```bash
# Database Configuration
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/entertainmentdb
JDBC_DATABASE_USERNAME=entertainmentdb
JDBC_DATABASE_PASSWORD=entertainmentdb
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false

# Clerk Authentication
CLERK_JWT_ISSUER_URI=https://your-clerk-domain.clerk.accounts.dev

# API Keys
GEMINI_API_KEY=your-gemini-api-key-here
CONVERT_API_TOKEN=your-convert-api-token-here
FAL_API_KEY=your-fal-api-key-here
RUNWARE_API_KEY=your-runware-api-key-here

# Server Configuration
SERVER_PORT=8080
LOG_LEVEL=INFO
SPRING_WEB_LOG_LEVEL=INFO
```

### 2. Get a Runware API Key

1. Go to [Runware.ai](https://runware.ai)
2. Sign up for an account
3. Get your API key from the dashboard
4. Replace `your-runware-api-key-here` with your actual API key

### 3. Restart the Backend

After setting up the environment variables, restart your backend server:

```bash
cd backend
./mvnw spring-boot:run
```

## Troubleshooting

If you're getting a 400 Bad Request error:

1. **Check if RUNWARE_API_KEY is set**: The error message will now clearly indicate if the API key is missing
2. **Verify API key validity**: Make sure your Runware API key is correct and active
3. **Check backend logs**: Look for detailed error messages in the console output

## Error Messages

The improved error handling will now show:

- "Error: RUNWARE_API_KEY is not configured" - if the environment variable is missing
- "Error: HTTP 400 - [detailed error message]" - if the API request fails
- Detailed request and response logging for debugging
