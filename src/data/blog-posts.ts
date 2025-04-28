
export interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  imageSrc?: string;
  author: {
    name: string;
    avatar: string;
  };
  featured?: boolean;
}

export const blogPosts: BlogPostData[] = [
  {
    id: "understanding-xss",
    title: "Understanding Cross-Site Scripting (XSS) Vulnerabilities",
    excerpt: "A comprehensive guide to XSS attacks, their types, and how to protect your web applications from these common security threats.",
    category: "XSS",
    date: "Apr 25, 2025",
    readTime: "8 min read",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    imageSrc: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    featured: true,
    content: `
# Understanding Cross-Site Scripting (XSS) Vulnerabilities

Cross-site scripting (XSS) remains one of the most prevalent web application security vulnerabilities. It allows attackers to inject malicious scripts into web pages viewed by other users.

## What is XSS?

XSS occurs when an application includes untrusted data in a new web page without proper validation or escaping. This allows attackers to execute scripts in the victim's browser, potentially stealing cookies, session tokens, or other sensitive information.

### Types of XSS Attacks

1. **Reflected XSS**: The malicious script comes from the current HTTP request.

\`\`\`javascript
// Vulnerable code example
const searchQuery = req.query.q;
res.send(\`<p>Search results for: ${searchQuery}</p>\`); // Dangerous!
\`\`\`

2. **Stored XSS**: The malicious script is stored on the target server.

\`\`\`javascript
// Vulnerability in comment system
app.post('/comments', (req, res) => {
  const comment = req.body.comment;
  comments.push(comment); // Stores unvalidated input
});
\`\`\`

3. **DOM-based XSS**: The vulnerability exists in client-side code.

\`\`\`javascript
// Unsafe DOM manipulation
const url = document.location.hash.substring(1);
document.getElementById("output").innerHTML = url; // Dangerous!
\`\`\`

## Prevention Techniques

### Content Security Policy (CSP)

A CSP header helps prevent XSS by specifying which resources can be loaded.

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' trusted-scripts.com
\`\`\`

### Input Validation and Sanitization

Always validate and sanitize user input:

\`\`\`javascript
// Using a library like DOMPurify
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
\`\`\`

### Output Encoding

Encode output based on the context where it will be placed:

\`\`\`javascript
// For HTML contexts
const escapeHTML = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
\`\`\`

## Conclusion

XSS vulnerabilities can lead to significant security breaches. Implementing proper validation, sanitization, encoding, and security headers is essential for protecting your web applications and users.
    `,
  },
  {
    id: "sql-injection-basics",
    title: "SQL Injection: The Basics Everyone Should Know",
    excerpt: "Learn how SQL injection attacks work and the best practices for protecting your databases from unauthorized access.",
    category: "SQL Injection",
    date: "Apr 22, 2025",
    readTime: "6 min read",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    imageSrc: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    content: `
# SQL Injection: The Basics Everyone Should Know

SQL injection is one of the oldest yet still most dangerous web application vulnerabilities. It occurs when untrusted data is sent to an interpreter as part of a command or query.

## How SQL Injection Works

SQL injection attacks happen when user-supplied data isn't properly validated and is directly included in SQL queries. Consider this vulnerable code:

\`\`\`javascript
// Vulnerable Node.js code
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = \`SELECT * FROM users WHERE id = ${userId}\`;
  // Execute query...
});
\`\`\`

If a malicious user supplies \`1 OR 1=1\` as the ID, the query becomes:

\`\`\`sql
SELECT * FROM users WHERE id = 1 OR 1=1
\`\`\`

This would return all users in the database, not just the intended one.

## Common SQL Injection Techniques

### 1. Union-Based

Attackers use UNION operators to combine the results of the original query with another query:

\`\`\`
' UNION SELECT username, password FROM users--
\`\`\`

### 2. Error-Based

Forcing the database to generate error messages that reveal information:

\`\`\`
' OR (SELECT CASE WHEN (1=1) THEN 1/0 ELSE 1 END)--
\`\`\`

### 3. Blind SQL Injection

When no error messages or results are visible, attackers use true/false questions to extract data:

\`\`\`
' OR (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--
\`\`\`

## Prevention Techniques

### Parameterized Queries

Always use parameterized queries or prepared statements:

\`\`\`javascript
// Safe approach using parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
connection.query(query, [userId], (error, results) => {
  // Handle results
});
\`\`\`

### ORM Frameworks

Use ORM frameworks that handle SQL escaping for you:

\`\`\`javascript
// Using Sequelize ORM
const user = await User.findOne({ 
  where: { id: userId } 
});
\`\`\`

### Principle of Least Privilege

Database accounts used by applications should have restricted permissions:

\`\`\`sql
GRANT SELECT ON products TO 'app_user'@'localhost';
\`\`\`

## Conclusion

SQL injection remains a critical threat to web applications. By understanding how these attacks work and implementing proper prevention techniques, you can protect your application's data integrity and confidentiality.
    `,
  },
  {
    id: "csrf-protection",
    title: "Protecting Against Cross-Site Request Forgery (CSRF)",
    excerpt: "Discover how CSRF attacks work and learn about effective strategies to protect your web application from this common security vulnerability.",
    category: "CSRF",
    date: "Apr 18, 2025",
    readTime: "5 min read",
    author: {
      name: "Marcus Thompson",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    imageSrc: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    content: `
# Protecting Against Cross-Site Request Forgery (CSRF)

Cross-Site Request Forgery (CSRF) is a type of attack that tricks a user's browser into executing unwanted actions on a website where they're already authenticated.

## How CSRF Works

CSRF attacks exploit the trust that a website has in a user's browser. Here's a simple example:

1. User logs into their bank account at bank.com
2. Without logging out, user visits malicious.com
3. malicious.com contains code like:

\`\`\`html
<img src="https://bank.com/transfer?to=attacker&amount=1000" style="display:none" />
\`\`\`

4. The user's browser sends the request to bank.com with the user's cookies
5. The bank processes the transfer thinking it was legitimately requested by the user

## Example Vulnerable Code

\`\`\`javascript
// Express route without CSRF protection
app.post('/transfer', (req, res) => {
  const { to, amount } = req.body;
  // Process transfer without verifying the request source
  transferFunds(req.user.id, to, amount);
  res.send('Transfer successful');
});
\`\`\`

## Prevention Techniques

### CSRF Tokens

Include a unique, unpredictable token with each form submission:

\`\`\`javascript
// Server-side token generation
app.get('/form', (req, res) => {
  const csrfToken = generateRandomToken();
  req.session.csrfToken = csrfToken;
  res.render('form', { csrfToken });
});

// Verify token on submission
app.post('/transfer', (req, res) => {
  if (req.body.csrf !== req.session.csrfToken) {
    return res.status(403).send('Invalid CSRF token');
  }
  // Process the request...
});
\`\`\`

### SameSite Cookies

Set cookies with the SameSite attribute:

\`\`\`javascript
res.cookie('sessionId', 'abc123', { 
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // Prevents the cookie from being sent in cross-site requests
});
\`\`\`

### Custom Request Headers

For AJAX requests, use custom headers that can only be set by your application:

\`\`\`javascript
// Client-side fetch with custom header
fetch('/api/data', {
  method: 'POST',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  // ...
});

// Server-side verification
if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
  return res.status(403).send('Forbidden');
}
\`\`\`

## Conclusion

CSRF attacks can be devastating but are preventable with proper security measures. By implementing CSRF tokens, using SameSite cookies, and verifying the origin of requests, you can significantly reduce the risk of CSRF attacks on your web application.
    `,
  },
  {
    id: "idor-vulnerabilities",
    title: "Insecure Direct Object References (IDOR) Explained",
    excerpt: "Learn about IDOR vulnerabilities and how to implement proper access controls to prevent unauthorized data access in your applications.",
    category: "IDOR",
    date: "Apr 15, 2025",
    readTime: "7 min read",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/100?img=4",
    },
    imageSrc: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    content: `
# Insecure Direct Object References (IDOR) Explained

Insecure Direct Object Reference (IDOR) is a common security vulnerability that occurs when an application provides direct access to objects based on user-supplied input without proper authorization checks.

## Understanding IDOR

IDOR vulnerabilities allow attackers to bypass authorization and access resources directly by modifying the value of a parameter that directly references a system object.

### Example Vulnerability

Consider an API endpoint that retrieves user data:

\`\`\`javascript
// Vulnerable endpoint
app.get('/api/users/:userId/data', (req, res) => {
  const { userId } = req.params;
  
  // No authorization check to verify the requesting user
  // should have access to this userId's data
  
  db.getUserData(userId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});
\`\`\`

In this example, an attacker could simply change the userId parameter in the URL to access another user's data.

## Real-World IDOR Example

\`\`\`
Original request:
GET /api/account/12345/statements HTTP/1.1
Host: bank.example.com
Cookie: session=USER_SESSION_TOKEN

Modified request:
GET /api/account/12346/statements HTTP/1.1
Host: bank.example.com
Cookie: session=USER_SESSION_TOKEN
\`\`\`

Just by changing the account number from 12345 to 12346, an attacker might gain access to another customer's statements.

## Prevention Techniques

### 1. Implement Proper Authorization Checks

Always verify that the current user has permission to access the requested resource:

\`\`\`javascript
// Secure implementation
app.get('/api/users/:userId/data', (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  
  // Check if the current user has permission to access this data
  if (userId != currentUserId && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  db.getUserData(userId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});
\`\`\`

### 2. Use Indirect Reference Maps

Instead of exposing internal database IDs, use a temporary mapping table or hash:

\`\`\`javascript
// Create a mapping for the user's session
const userResources = {
  "resource_a": 15, // Internal database ID 15
  "resource_b": 23, // Internal database ID 23
};
req.session.resourceMap = userResources;

// Access using the indirect reference
app.get('/api/resource/:resourceId', (req, res) => {
  const internalId = req.session.resourceMap[req.params.resourceId];
  if (!internalId) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  
  // Fetch and return the resource
});
\`\`\`

### 3. Consistent Authorization Mechanism

Use a consistent authorization mechanism across the entire application:

\`\`\`javascript
// Middleware for authorization
function authorizeResource(resourceType) {
  return async (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user.id;
    
    const hasAccess = await accessControlService.checkAccess(
      userId, 
      resourceType, 
      resourceId
    );
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  };
}

// Use the middleware in routes
app.get('/api/documents/:id', 
  authorizeResource('document'), 
  documentController.getDocument
);
\`\`\`

## Conclusion

IDOR vulnerabilities can lead to serious data breaches but are preventable with proper authorization checks. Always verify that a user should have access to a resource before providing it, regardless of how the resource is referenced in the request.
    `,
  }
];
