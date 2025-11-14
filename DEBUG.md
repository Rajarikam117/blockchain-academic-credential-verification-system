# Debugging 405 Method Not Allowed Error

## Common Causes

1. **CORS Preflight (OPTIONS requests)** - Browser sends OPTIONS request before POST
2. **Route order** - Static files intercepting API routes
3. **Method mismatch** - Using GET on a POST-only route or vice versa
4. **Route pattern issues** - Express route patterns not matching correctly

## How to Debug

1. **Check server logs** - Look for the request method and path
2. **Check browser console** - See what request is failing
3. **Check Network tab** - See the actual HTTP request being made

## Current Fixes Applied

1. ✅ Added explicit CORS handling with OPTIONS support
2. ✅ Added request logging for API routes
3. ✅ Changed 404 handler to use `app.all()` instead of `app.use()`
4. ✅ Added better error messages with available endpoints

## Testing

1. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test credentials endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/credentials \
     -H "Content-Type: application/json" \
     -d '{"studentName":"Test","institutionName":"Test","degree":"Test","fieldOfStudy":"Test","graduationDate":"2023-01-01"}'
   ```

3. **Check server logs** when submitting from browser - should show:
   ```
   POST /api/credentials
   ```

## If Error Persists

1. **Check if server is running:**
   ```bash
   npm start
   ```

2. **Check server logs** for the actual request being made

3. **Check browser Network tab** to see:
   - Request method
   - Request URL
   - Response status
   - Response body

4. **Verify route is registered** - Check server.js for the route definition

