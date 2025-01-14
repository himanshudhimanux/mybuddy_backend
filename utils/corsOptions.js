const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://mybuddyfrontend.netlify.app",  // Your production frontend URL
        "http://localhost:5173",               // Your local development frontend
      ];
  
      // Check if the incoming request's origin matches any allowed origin
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);  // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'), false);  // Reject the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],     // Allowed request headers
    credentials: true,                                    // Allow credentials (cookies, auth headers)
    preflightContinue: false,                             // Send response for preflight requests
  };
  
  module.exports = corsOptions;
  