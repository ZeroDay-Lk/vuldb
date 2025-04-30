import { supabase } from "@/integrations/supabase/client";
import type { BlogPostData } from "@/data/blog-posts";

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<BlogPostData[]> {
  try {
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        authors:author_id (
          name,
          avatar
        )
      `)
      .order('featured', { ascending: false })
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }

    // Transform the data to match the BlogPostData interface
    return blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: post.read_time,
      imageSrc: post.image_src,
      featured: post.featured,
      author: {
        name: post.authors.name,
        avatar: post.authors.avatar
      }
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

// Get a single blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPostData | null> {
  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        authors:author_id (
          name,
          avatar
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: post.read_time,
      imageSrc: post.image_src,
      featured: post.featured,
      author: {
        name: post.authors.name,
        avatar: post.authors.avatar
      }
    };
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

// Create a new blog post
export async function createBlogPost(blogPost: Omit<BlogPostData, 'id' | 'author' | 'date'>): Promise<string | null> {
  try {
    console.log("Creating blog post with data:", blogPost);
    
    // Get the default author
    const { data: authors, error: authorError } = await supabase
      .from("authors")
      .select("id")
      .limit(1);

    if (authorError || !authors || authors.length === 0) {
      console.error("Error fetching default author:", authorError);
      throw authorError;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        category: blogPost.category,
        image_src: blogPost.imageSrc || '/placeholder.svg',
        read_time: blogPost.readTime || "5 min read",
        featured: blogPost.featured || false,
        author_id: authors[0].id,
        date: new Date().toISOString() // Add current date
      })
      .select();

    if (error) {
      console.error("Error creating blog post:", error);
      return null;
    }

    console.log("Blog post created successfully:", data);
    return data[0].id;
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return null;
  }
}

// Create a sample blog post about XSS vulnerabilities
export async function createSamplePost(sampleNumber: number = 1): Promise<string | null> {
  const samplePosts = [
    {
      title: "Understanding Cross-Site Scripting (XSS) Vulnerabilities",
      excerpt: "XSS attacks are among the most common web application vulnerabilities. Learn how they work and how to prevent them in your applications.",
      content: `# Understanding Cross-Site Scripting (XSS) Vulnerabilities

Cross-Site Scripting (XSS) is one of the most prevalent web application security vulnerabilities. This attack occurs when malicious scripts are injected into trusted websites, allowing attackers to execute scripts in victims' browsers.

## Types of XSS Attacks

There are three main types of XSS attacks:

- **Reflected XSS**: Where the malicious script comes from the current HTTP request
- **Stored XSS**: Where the malicious script comes from the website's database
- **DOM-based XSS**: Where the vulnerability exists in client-side code

## Example of an XSS Vulnerability

Here's a simple example of a vulnerable code snippet:

\`\`\`javascript
// Vulnerable code
const userInput = document.getElementById('userInput').value;
document.getElementById('output').innerHTML = userInput;
\`\`\`

The above code directly inserts user input into the DOM without sanitization, allowing attackers to inject scripts.

## Prevention Techniques

To prevent XSS attacks, follow these best practices:

- Always validate and sanitize user inputs
- Implement Content Security Policy (CSP)
- Use modern frameworks that automatically escape potentially dangerous characters
- Apply the principle of least privilege when including external scripts

Remember: Security is a continuous process, not a one-time implementation.`,
      category: "Web Security",
      imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      readTime: "7 min read",
      featured: true
    },
    {
      title: "SQL Injection Attacks and Prevention",
      excerpt: "SQL injection remains one of the most dangerous vulnerabilities for web applications. Learn how to identify and mitigate these threats.",
      content: `# SQL Injection: Understanding and Prevention

SQL Injection is a code injection technique that exploits vulnerabilities in applications that interact with databases. Attackers can insert malicious SQL statements that can read, modify, or delete data from your database.

## How SQL Injection Works

When applications fail to properly sanitize user input before incorporating it into SQL queries, attackers can inject additional SQL commands that the database will execute.

## Common Examples

Consider this vulnerable code:

\`\`\`javascript
// Vulnerable code
const username = request.getParameter("username");
const query = "SELECT * FROM users WHERE username = '" + username + "'";
\`\`\`

If an attacker inputs: \`' OR '1'='1\`, the resulting query becomes:

\`\`\`sql
SELECT * FROM users WHERE username = '' OR '1'='1'
\`\`\`

This will return all rows in the users table since '1'='1' is always true.

## Prevention Techniques

1. **Use Parameterized Queries**:

\`\`\`javascript
// Safe code
const query = "SELECT * FROM users WHERE username = ?";
preparedStatement = connection.prepareStatement(query);
preparedStatement.setString(1, username);
\`\`\`

2. **ORM Libraries**: Use Object-Relational Mapping libraries that handle SQL sanitization

3. **Input Validation**: Validate user input against strict patterns

4. **Least Privilege**: Ensure database users have minimum required permissions

Remember that SQL injection can occur in any SQL statement, not just SELECT queries.`,
      category: "Database Security",
      imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      readTime: "8 min read",
      featured: false
    },
    {
      title: "CSRF Attacks: How They Work and How to Stop Them",
      excerpt: "Cross-Site Request Forgery attacks trick users into performing actions they didn't intend to. Learn effective defense strategies.",
      content: `# Understanding CSRF Attacks

Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users to execute unwanted actions on a web application in which they're currently authenticated.

## The Mechanics of CSRF

CSRF attacks exploit the trust that a website has in a user's browser. When a user is authenticated to a site, their browser typically sends authentication data automatically with each request to that site.

A typical CSRF attack follows these steps:

1. The user logs into a legitimate website (e.g., their bank) and receives a session cookie
2. Without logging out, the user visits a malicious website
3. The malicious site contains code that automatically submits a form to the legitimate website
4. Since the user's browser still has the active session cookie, the request is processed as legitimate

## Example Attack Scenario

Consider a bank's fund transfer functionality:

\`\`\`html
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="recipient" value="account-number">
  <input type="hidden" name="amount" value="10000">
  <input type="submit" value="Click here to win a prize!">
</form>
\`\`\`

If this form is hosted on an attacker's website and automatically submitted, the victim's browser will send their cookies with the request, potentially transferring money without their knowledge.

## Prevention Techniques

1. **CSRF Tokens**: Include unique, unpredictable tokens with each request and validate them

\`\`\`html
<form action="/transfer" method="post">
  <input type="hidden" name="csrf_token" value="random-token-here">
  <!-- other form fields -->
</form>
\`\`\`

2. **Same-Site Cookies**: Configure cookies with the SameSite attribute

3. **Custom Headers**: Require custom headers that simple forms can't generate

4. **Verify Origin and Referer Headers**: Check these headers to verify the source of requests

5. **Re-Authentication**: Require password re-entry for sensitive actions

Implementing multiple layers of these protections provides the strongest defense against CSRF attacks.`,
      category: "Web Security",
      imageSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      readTime: "6 min read",
      featured: false
    },
    {
      title: "Broken Authentication: Common Flaws and Fixes",
      excerpt: "Authentication vulnerabilities can lead to account takeovers. Discover the most common authentication flaws and how to address them.",
      content: `# Broken Authentication: Risks and Remedies

Authentication is the cornerstone of security for most applications, but when implemented incorrectly, it can lead to devastating security breaches.

## Common Authentication Vulnerabilities

### 1. Weak Password Policies

Many applications still allow users to create passwords like "password123" or "qwerty". These are trivial to guess or brute-force.

**Solution**: Implement strong password requirements:
- Minimum length (at least 12 characters)
- Mix of character types
- Check against common password databases
- Encourage passphrases

### 2. Brute Force Protection Failures

Without proper rate limiting, attackers can try thousands of password combinations until they succeed.

**Example of a proper rate-limiting implementation**:

\`\`\`javascript
async function loginAttempt(username, password) {
  // Check if account is locked
  const lockout = await getLoginLockoutStatus(username);
  if (lockout.isLocked) {
    return {
      success: false,
      message: \`Account temporarily locked. Try again in \${lockout.remainingMinutes} minutes\`
    };
  }

  // Verify credentials
  const isValid = await verifyCredentials(username, password);
  
  if (isValid) {
    // Reset failed attempt counter
    await resetFailedLoginAttempts(username);
    // Proceed with login...
  } else {
    // Increment failed attempt counter
    await incrementFailedLoginAttempts(username);
    // Check if we should lock the account
    const attempts = await getFailedLoginAttempts(username);
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      await lockAccount(username, LOCKOUT_DURATION_MINUTES);
    }
  }
}
\`\`\`

### 3. Insecure Session Management

After authentication, many applications fail to properly manage the user's session.

**Best practices**:
- Generate strong, random session IDs
- Transmit over secure channels (HTTPS)
- Implement proper expiration
- Provide logout functionality
- Rotate session IDs after authentication

### 4. Missing Multi-Factor Authentication

Relying solely on passwords leaves applications vulnerable, even with strong password policies.

**Recommendation**: Implement MFA options such as:
- Time-based one-time passwords (TOTP)
- SMS verification (though less secure than other methods)
- Push notifications to mobile devices
- Hardware security keys

## Implementation Checklist

✅ Use established authentication frameworks rather than building your own
✅ Store passwords using strong adaptive hashing functions (Argon2, bcrypt)
✅ Implement account lockout after failed attempts
✅ Enforce MFA for sensitive operations
✅ Use secure session management
✅ Implement HTTPS across your entire site

Remember that authentication security is not a one-time implementation but requires regular review and updates as threats evolve.`,
      category: "Authentication Security",
      imageSrc: "https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      readTime: "9 min read",
      featured: false
    },
    {
      title: "Insecure Direct Object References (IDOR) Explained",
      excerpt: "IDOR vulnerabilities occur when applications expose direct references to internal objects. Learn how to identify and fix these security gaps.",
      content: `# Insecure Direct Object References (IDOR)

Insecure Direct Object References (IDOR) occur when an application provides direct access to objects based on user-supplied input. This typically happens when a developer exposes a reference to an internal implementation object, such as a file, directory, database record, or key, without proper access control checks.

## How IDOR Vulnerabilities Work

IDOR vulnerabilities are fundamentally authorization problems. Consider this URL:

\`\`\`
https://example.com/account/statement/1234
\`\`\`

Where "1234" is a direct reference to a specific account statement. If an attacker can simply change this value to "1235" and access another user's statement, that's an IDOR vulnerability.

## Common Examples

### Example 1: Exposed Database IDs

**Vulnerable code:**

\`\`\`javascript
app.get('/api/users/:userId/documents', (req, res) => {
  const documents = getDocumentsByUserId(req.params.userId);
  res.json(documents);
});
\`\`\`

**Problem:** Any authenticated user can access any other user's documents just by changing the userId parameter.

### Example 2: Predictable Resource References

**Vulnerable situation:**
User profile pictures stored as: \`profile_pic_1234.jpg\` where 1234 is the user ID.

**Problem:** Anyone can access or enumerate other users' profile pictures by guessing IDs.

## Prevention Techniques

### 1. Implement Proper Access Controls

Always verify that the currently logged-in user has permission to access the requested resource:

\`\`\`javascript
app.get('/api/users/:userId/documents', (req, res) => {
  // First check if the current user has permission to access these documents
  if (req.session.userId !== req.params.userId && !isAdmin(req.session.userId)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Only fetch documents if authorized
  const documents = getDocumentsByUserId(req.params.userId);
  res.json(documents);
});
\`\`\`

### 2. Use Indirect References

Instead of exposing internal database IDs, use indirection maps:

\`\`\`javascript
// Create a temporary, session-specific mapping
const userResourceMap = {
  'temp_resource_12345': 'actual_resource_id_67890'
};

// User only sees and uses the temporary reference
\`\`\`

### 3. Implement Proper Object-Level Authorization

When using an ORM or direct database access, include authorization checks in your data access layer:

\`\`\`javascript
// Example using an ORM with policy-based access control
Document.findOne({
  where: {
    id: documentId,
    userId: currentUserId // Enforces ownership
  }
});
\`\`\`

## Testing for IDOR

To find IDOR vulnerabilities in your applications:

1. Identify all endpoints that accept user-supplied object references
2. Create at least two test accounts
3. Using one account, perform actions that generate object references
4. While logged in as the second user, try to access those same resources
5. Observe whether access is properly restricted

Remember that IDOR vulnerabilities can exist in any part of your application that accepts references to internal objects, including APIs, file downloads, and admin interfaces.`,
      category: "Application Security",
      imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      readTime: "7 min read",
      featured: false
    },
    {
      title: "Security Headers: Your First Line of Defense",
      excerpt: "HTTP security headers can significantly improve your application security posture with minimal effort. Learn which headers to implement and how.",
      content: `# Essential HTTP Security Headers

HTTP security headers provide an additional layer of security by helping to mitigate certain types of attacks like Cross-Site Scripting (XSS) and Clickjacking. They're easy to implement and should be part of any application's security baseline.

## Key Security Headers to Implement

### 1. Content-Security-Policy (CSP)

CSP helps prevent XSS attacks by specifying which dynamic resources are allowed to load.

**Example implementation:**

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; img-src 'self' https://img-cdn.com; style-src 'self' 'unsafe-inline';
\`\`\`

This policy:
- Allows scripts only from the same origin and trusted-cdn.com
- Allows images only from the same origin and img-cdn.com
- Allows styles from the same origin and allows inline styles

**Implementing in Express.js:**

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    imgSrc: ["'self'", "https://img-cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  }
}));
\`\`\`

### 2. X-XSS-Protection

While mostly superseded by CSP, this header is still useful for older browsers.

\`\`\`
X-XSS-Protection: 1; mode=block
\`\`\`

### 3. X-Frame-Options

Prevents clickjacking attacks by controlling whether a page can be embedded in an iframe.

\`\`\`
X-Frame-Options: DENY
\`\`\`

Or, if you need to allow embedding on your own site:

\`\`\`
X-Frame-Options: SAMEORIGIN
\`\`\`

### 4. Strict-Transport-Security (HSTS)

Enforces secure connections to the server.

\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

### 5. X-Content-Type-Options

Prevents MIME type sniffing.

\`\`\`
X-Content-Type-Options: nosniff
\`\`\`

### 6. Referrer-Policy

Controls how much referrer information should be included with requests.

\`\`\`
Referrer-Policy: strict-origin-when-cross-origin
\`\`\`

### 7. Permissions-Policy (formerly Feature-Policy)

Allows you to control which features and APIs can be used in the browser.

\`\`\`
Permissions-Policy: camera=(), microphone=(), geolocation=()
\`\`\`

## Implementation Approaches

### Using Helmet for Node.js Applications

[Helmet](https://helmetjs.github.io/) is a collection of middleware functions for Express.js that set security headers:

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// Set all security headers at once
app.use(helmet());

// Or configure them individually
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Custom CSP directives
      },
    },
    xFrameOptions: { action: 'deny' },
    // Other configurations
  })
);
\`\`\`

### For Apache Server

Add to your .htaccess file:

\`\`\`
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self';"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "DENY"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
\`\`\`

### For Nginx

Add to your server configuration:

\`\`\`
add_header Content-Security-Policy "default-src 'self';" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
\`\`\`

## Testing Your Headers

Use these online tools to verify your security headers:
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

Remember to test your site after implementing these headers to ensure they don't break any functionality, especially when implementing CSP.`,
      category: "Web Security",
      imageSrc: "https://images.unsplash.com/photo-1478432780021-b8d273730d8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80",
      readTime: "10 min read",
      featured: false
    },
    {
      title: "Secure File Upload Implementations",
      excerpt: "File uploads can be a major security risk if not properly implemented. Learn best practices for securing this common vulnerability.",
      content: `# Securing File Uploads

File upload functionality is a common feature in web applications that can introduce significant security risks if not properly implemented. Attackers can exploit vulnerable file upload mechanisms to execute malicious code, perform denial-of-service attacks, or gain unauthorized access to sensitive data.

## Common File Upload Vulnerabilities

### 1. Insufficient File Type Validation

Many applications only check the file extension or MIME type provided by the client, which is easily spoofed.

**Vulnerable example:**

\`\`\`javascript
// INSECURE: Relies only on extension
function isImageFile(filename) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}
\`\`\`

### 2. Missing File Content Validation

Even if the extension is valid, the file content might be malicious.

### 3. Storing Files in Accessible Locations

Storing uploaded files within the webroot or application directory allows them to be executed by the web server.

### 4. Predictable File Naming

Using predictable names makes it easier for attackers to locate and access uploaded files.

## Secure Implementation Best Practices

### 1. Validate Both File Extension and Content

\`\`\`javascript
const fileType = require('file-type');
const fs = require('fs');

async function validateImage(filePath) {
  // Check file size first
  const stats = await fs.promises.stat(filePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  if (fileSizeInMB > 5) {
    throw new Error('File exceeds 5MB size limit');
  }
  
  // Analyze the file content
  const buffer = await fs.promises.readFile(filePath);
  const fileInfo = await fileType.fromBuffer(buffer);
  
  // Verify it's actually an image
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!fileInfo || !validTypes.includes(fileInfo.mime)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed');
  }
  
  return true;
}
\`\`\`

### 2. Use a Secure Location Outside the Webroot

Store uploaded files in a location that cannot be directly accessed via URL, or use a dedicated storage service.

\`\`\`javascript
// Store files outside webroot
const uploadDir = path.join(__dirname, '..', 'secure_uploads');

// Or use cloud storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('my-secure-bucket');

async function storeFile(file) {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(file.name);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    
    blobStream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    });
    
    blobStream.on('error', (err) => {
      reject(err);
    });
    
    blobStream.end(file.buffer);
  });
}
\`\`\`

### 3. Implement Random File Names

\`\`\`javascript
const crypto = require('crypto');
const path = require('path');

function generateSecureFilename(originalFilename) {
  const extension = path.extname(originalFilename);
  const randomName = crypto.randomBytes(16).toString('hex');
  return \`\${randomName}\${extension}\`;
}
\`\`\`

### 4. Set Proper Content Disposition and Headers for Downloads

\`\`\`javascript
app.get('/download/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const fileInfo = await getFileInfo(fileId); // Your function to get file metadata
  
  if (!fileInfo) {
    return res.status(404).send('File not found');
  }
  
  // Verify user has permission to access this file
  if (!userCanAccess(req.user, fileInfo)) {
    return res.status(403).send('Access denied');
  }
  
  // Set headers for secure download
  res.setHeader('Content-Disposition', \`attachment; filename="\${fileInfo.originalName}"\`);
  res.setHeader('Content-Type', fileInfo.mimeType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Send the file
  const fileStream = getFileStream(fileInfo.path);
  fileStream.pipe(res);
});
\`\`\`

### 5. Scan Uploaded Files for Malware

Consider integrating with virus scanning services, especially for applications that allow document uploads.

\`\`\`javascript
const NodeClam = require('clamscan');

const clamscan = new NodeClam().init({
  clamdscan: {
    socket: '/var/run/clamav/clamd.sock',
    host: 'localhost',
    port: 3310,
  }
});

async function scanFile(filePath) {
  try {
    const { isInfected, viruses } = await clamscan.scanFile(filePath);
    if (isInfected) {
      console.error(\`Virus detected: \${viruses.join(', ')}\`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error scanning file:', err);
    // Depending on your policy, you might reject or accept the file if scanning fails
    return false;
  }
}
\`\`\`

### 6. Use Content-Security-Policy to Prevent XSS

For applications that display user-uploaded images:

\`\`\`
Content-Security-Policy: default-src 'self'; img-src 'self' https://your-storage-domain.com;
\`\`\`

## Beyond Technical Controls

Remember that technical controls should be complemented by:

1. **User education** - Inform users about acceptable file types and sizes
2. **Rate limiting** - Prevent DoS attacks via excessive uploads
3. **Periodic cleanup** - Remove old or unused uploaded files
4. **Monitoring** - Watch for unusual upload patterns or suspicious files
5. **Clear documentation** - Ensure developers understand how to use the upload mechanism securely

By implementing these measures, you can provide file upload functionality while minimizing the associated security risks.`,
      category: "Application Security",
      imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80",
      readTime: "11 min read",
      featured: false
    },
    {
      title: "Server-Side Request Forgery (SSRF) Attacks",
      excerpt: "SSRF attacks allow attackers to induce the server-side application to make HTTP requests to an arbitrary domain. Learn how to prevent this growing threat.",
      content: `# Server-Side Request Forgery (SSRF)

Server-Side Request Forgery (SSRF) is a web security vulnerability that allows attackers to induce a server-side application to make requests to unintended locations. This vulnerability occurs when a web application fetches remote resources without properly validating the user-supplied URL.

## Why SSRF is Dangerous

SSRF vulnerabilities are particularly dangerous because they can allow attackers to:

1. **Bypass network security controls** - Access internal services behind firewalls that are normally inaccessible
2. **Scan internal networks** - Discover and map internal network services
3. **Access sensitive data** - Retrieve data from internal services, cloud metadata endpoints, or other protected resources
4. **Execute server-side exploits** - Leverage known vulnerabilities in internal services

## Common SSRF Scenarios

### Example 1: Basic SSRF

Consider an application that takes a URL parameter to fetch an image:

\`\`\`
https://example.com/get-image?url=https://legitimate-site.com/image.jpg
\`\`\`

An attacker might modify this to:

\`\`\`
https://example.com/get-image?url=http://internal-service.local/api/admin
\`\`\`

### Example 2: Cloud Metadata Exploitation

In cloud environments, metadata services are typically available at well-known addresses:

\`\`\`
https://example.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin
\`\`\`

This could allow attackers to access AWS IAM credentials or similar sensitive information.

## Vulnerable Code Examples

### Example 1: Direct URL fetch in Node.js

\`\`\`javascript
// VULNERABLE: No URL validation
app.get('/fetch-data', async (req, res) => {
  try {
    const response = await axios.get(req.query.url);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching URL');
  }
});
\`\`\`

### Example 2: File inclusion in PHP

\`\`\`php
// VULNERABLE: No validation
$file = $_GET['file'];
include($file);
\`\`\`

## Prevention Techniques

### 1. Allowlist Validation

Only allow requests to pre-approved domains or resources:

\`\`\`javascript
const ALLOWED_DOMAINS = [
  'api.trusted-service.com',
  'cdn.your-app.com',
  'images.your-app.com'
];

app.get('/fetch-data', async (req, res) => {
  try {
    const url = new URL(req.query.url);
    
    // Check if the domain is allowed
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      return res.status(403).send('Domain not allowed');
    }
    
    const response = await axios.get(req.query.url);
    res.send(response.data);
  } catch (error) {
    res.status(
