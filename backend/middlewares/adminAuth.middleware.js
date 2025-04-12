import jwt from "jsonwebtoken";

// You can store these secrets in your environment or configuration file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Middleware to authenticate based on access token, falling back to refresh token

function adminAuthMiddleware(req, res, next) {
    // Extract tokens from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
  
    // Helper function to generate and set a new access token cookie
    const generateAccessToken = (payload) => {
      // Generate a new access token (e.g., valid for 15 minutes)
      const newAccessToken = jwt.sign({ userId: payload.userId }, accessTokenSecret, { expiresIn: '15m' });
      // Set the new access token in an HTTP-only cookie
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Ensure secure cookies in production
        sameSite: 'strict'
      });
      return newAccessToken;
    };
  
    // If access token is present, try verifying it first
    if (accessToken) {
      jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
        if (err) {
          // If access token is invalid or expired but refresh token exists, try refreshing
          if (refreshToken) {
            jwt.verify(refreshToken, refreshTokenSecret, (rtErr, decodedRefresh) => {
              if (rtErr) {
                // Refresh token invalid or expired
                return res.status(401).json({ error: 'Unauthorized: Invalid refresh token.' });
              } else {
                // Valid refresh token: generate a new access token
                const newToken = generateAccessToken(decodedRefresh);
                // Optionally, you can update req.user with new token data or additional info
                req.user = { userId: decodedRefresh.userId, token: newToken };
                return next();
              }
            });
          } else {
            // Neither token is valid
            return res.status(401).json({ error: 'Unauthorized: No valid token provided.' });
          }
        } else {
          // Valid access token; attach user data to request object and proceed
          req.user = decoded;
          return next();
        }
      });
    } else if (refreshToken) {
      // No access token but refresh token exists; verify it to generate a new access token.
      jwt.verify(refreshToken, refreshTokenSecret, (rtErr, decodedRefresh) => {
        if (rtErr) {
          return res.status(401).json({ error: 'Unauthorized: Invalid refresh token.' });
        } else {
          // Generate a new access token using the refresh token data
          const newToken = generateAccessToken(decodedRefresh);
          req.user = { userId: decodedRefresh.userId, token: newToken };
          return next();
        }
      });
    } else {
      // No tokens found at all
      return res.status(401).json({ error: 'Unauthorized: Token missing.' });
    }
  }

export default adminAuthMiddleware
  
