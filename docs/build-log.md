# Build Log

## 2026-05-09 — Project Started

Started serverless web application portfolio project.

### Initial Repo Setup

Completed:

- Created GitHub repository
- Added main README
- Added `frontend/` folder
- Added `backend/` folder
- Added `docs/` folder
- Added `infrastructure/` folder
- Added `.github/workflows/` folder

Goal:

Build a full serverless web application while learning AWS architecture deeply.

---

## Frontend Deployment

Built and deployed initial static frontend.

### Architecture

Browser → CloudFront → S3

### Completed

- Uploaded frontend files to S3
- Enabled S3 static website hosting for early testing
- Confirmed website loads in browser
- Confirmed JavaScript button interaction works
- Created CloudFront distribution
- Configured S3 as CloudFront origin
- Configured default root object: `index.html`
- Moved toward private S3 access through CloudFront
- Confirmed frontend loads through CloudFront

---

## API Gateway + Lambda + DynamoDB

Built first complete serverless backend flow.

### Architecture

Browser → API Gateway → Lambda → DynamoDB

### Completed

- Created Lambda backend
- Created HTTP API Gateway
- Added `GET /hello` route
- Connected frontend JavaScript `fetch()` calls to API Gateway
- Configured CORS for browser access
- Created DynamoDB table: `serverless-web-app-messages`
- Added least-privilege DynamoDB permissions for Lambda
- Successfully stored messages in DynamoDB

---

## Read + Display Messages

Added persistent message display.

### Completed

- Added `POST /messages`
- Added `GET /messages`
- Added DynamoDB `PutItem` permission
- Added DynamoDB `Scan` permission
- Updated Lambda to save messages
- Updated Lambda to read messages
- Updated frontend to display saved messages
- Confirmed messages appear on webpage after refresh

---

## Full CRUD Functionality

Expanded app from create/read to full CRUD.

### Architecture

Frontend UI → API Gateway routes → Lambda route handling → DynamoDB operations

### Completed

- Added `DELETE /messages/{id}`
- Added DynamoDB `DeleteItem` permission
- Added Delete buttons beside messages
- Debugged CORS issue for DELETE method
- Added `PATCH /messages/{id}`
- Added DynamoDB `UpdateItem` permission
- Built inline editing in frontend
- Clicking a message turns it into an input box
- Pressing Enter sends PATCH request
- Confirmed create, read, update, and delete all work

### CRUD Mapping

| User Action | HTTP Method | DynamoDB Operation |
|---|---|---|
| Create message | POST | PutItem |
| Load messages | GET | Scan / Query |
| Edit message | PATCH | UpdateItem |
| Delete message | DELETE | DeleteItem |

---

## GitHub Actions + CloudFront CI/CD

Built automated frontend deployment pipeline.

### Architecture

GitHub → GitHub Actions → IAM Role via OIDC → S3 → CloudFront → Browser

### Completed

- Created dedicated GitHub Actions IAM role
- Configured OIDC trust between GitHub and AWS
- Added least-privilege S3 deployment permissions
- Created GitHub Actions deployment workflow
- Configured automatic frontend deployment to S3
- Added CloudFront cache invalidation step
- Confirmed frontend changes deploy automatically after push
- Confirmed CloudFront invalidation completes successfully

---

## Cognito Authentication

Added user login with Amazon Cognito.

### Architecture

Browser → Cognito Hosted Login → CloudFront Frontend

### Completed

- Created Cognito User Pool
- Created App Client without client secret for browser-based frontend
- Configured Cognito managed login page
- Configured Cognito domain
- Added CloudFront URL as allowed callback URL
- Added CloudFront URL as allowed sign-out URL
- Created test user
- Tested Cognito login flow
- Confirmed Cognito redirects user back to frontend after login

### Key Learning

- User Pool stores and manages users
- App Client defines how an application uses the User Pool
- Browser apps should not use client secrets
- Callback URLs control where Cognito is allowed to redirect users
- Cognito acts as the identity provider

---

## JWT Authorization with API Gateway

Protected backend API routes with JWT authentication.

### Architecture

Browser → JWT Token → API Gateway JWT Authorizer → Lambda

### Completed

- Created API Gateway JWT authorizer
- Configured issuer URL using Cognito User Pool
- Configured audience using Cognito App Client ID
- Attached authorizer to protected routes:
  - `GET /messages`
  - `POST /messages`
  - `PATCH /messages/{id}`
  - `DELETE /messages/{id}`
- Left `GET /hello` public as a simple health-check route
- Confirmed unauthenticated requests are blocked
- Updated frontend to send JWT in Authorization header
- Confirmed authenticated API calls work

### Key Learning

- Authentication proves who the user is
- Authorization controls what the user can access
- JWTs are signed proof of identity
- API Gateway can validate JWTs before Lambda runs
- Lambda receives verified user identity through request context

---

## Frontend Token Handling

Updated frontend to use Cognito tokens.

### Completed

- Added Cognito domain, app client ID, and redirect URI to frontend config
- Added authorization-code handling after Cognito redirect
- Exchanged Cognito authorization code for token
- Stored `idToken` in browser local storage
- Added `Authorization: Bearer <idToken>` header to API requests
- Confirmed API Gateway accepts authenticated frontend requests

### Key Learning

The browser now participates in the auth flow:

Browser → Cognito Login → Authorization Code → Token Exchange → JWT → API Request

---

## User Ownership Model

Added per-user ownership to messages.

### Architecture

JWT Claims → Lambda → DynamoDB `user_id`

### Completed

- Extracted authenticated user ID from JWT claims in Lambda
- Used Cognito `sub` claim as stable `user_id`
- Added `user_id` field to new DynamoDB message items
- Confirmed new messages store authenticated owner ID
- Updated `GET /messages` to only return messages owned by current user
- Confirmed old public messages no longer appear for authenticated user

### Key Learning

Authentication alone is not enough.

The app also needs authorization rules that enforce ownership.

---

## Secure PATCH and DELETE Authorization

Protected update and delete operations with ownership checks.

### Architecture

PATCH/DELETE request → GetItem → Ownership Check → Update/Delete

### Completed

- Added DynamoDB `GetItem` permission
- Added helper function to fetch message and verify owner
- Updated PATCH route to check ownership before update
- Updated DELETE route to check ownership before delete
- Returned `403 Forbidden` when authenticated user does not own item
- Tested unauthorized delete attempt against an old/non-owned item
- Confirmed API returns 403
- Confirmed owner can still create, edit, and delete own messages

### Key Learning

Authenticated users should not automatically be trusted to access every record.

Each protected operation must verify resource ownership.

---

## DynamoDB Access Pattern Optimization

Replaced inefficient scan/filter logic with a DynamoDB GSI query.

### Architecture

Authenticated User → Lambda → DynamoDB GSI Query

### Completed

- Created Global Secondary Index
- GSI partition key: `user_id`
- GSI sort key: `created_at`
- Updated `GET /messages` to query by authenticated user ID
- Added DynamoDB `Query` permission
- Added IAM permission for GSI ARN
- Fixed AccessDenied issue caused by missing GSI resource ARN
- Confirmed messages load through GSI query
- Confirmed only owned messages appear
- Confirmed newest messages appear first

### Key Learning

DynamoDB design is access-pattern driven.

Instead of scanning all records and filtering in Lambda, the app now queries the exact user partition through a GSI.

---

## Logout + Session Handling

Added frontend logout flow and session validation logic.

### Architecture

Browser → Local Storage JWT → Cognito Logout → Redirect Back To Frontend

### Completed

- Added Logout button to frontend UI
- Connected Logout button to JavaScript event listener
- Removed `idToken` from browser local storage during logout
- Redirected browser through Cognito logout endpoint
- Redirected user back to CloudFront frontend after logout
- Added startup check for valid `idToken`
- Redirected unauthenticated users to Cognito login page
- Prevented frontend from calling protected API routes without JWT
- Fixed frontend 401 errors caused by missing token after logout
- Confirmed logout flow works end-to-end

### Key Learning

Frontend authentication state is stored in the browser.

Protected API routes require a valid JWT before requests are sent.

The frontend application must validate session state before attempting authenticated API calls.

---

## Current Architecture

CloudFront frontend  
↓  
Cognito login  
↓  
JWT token stored in browser  
↓  
API Gateway JWT authorizer  
↓  
Lambda backend  
↓  
DynamoDB table + GSI  

---

## Current Features

- Static frontend hosted behind CloudFront
- Automated frontend deployment with GitHub Actions
- API Gateway HTTP API
- Lambda backend
- DynamoDB persistence
- Full CRUD operations
- Cognito login
- JWT-protected API routes
- Per-user message ownership
- Authorization checks for update/delete
- GSI-based per-user message query

---

## Important Lessons Learned

- CloudFront hosts and serves the frontend, but the browser connects the frontend to backend APIs
- API Gateway routes map HTTP methods and paths to Lambda logic
- Lambda acts as backend business logic
- DynamoDB stores persistent application data
- CORS is enforced by the browser, not Lambda
- Cognito manages user identity and login
- App clients configure how applications use Cognito
- JWTs are signed proof of authentication
- API Gateway authorizers protect routes before Lambda runs
- Authentication and authorization are different
- DynamoDB GSIs support alternate access patterns
- GSI queries require IAM permission on the index ARN
- Python indentation directly controls backend logic flow
- CloudWatch logs are essential for debugging Lambda failures

---

## Next Possible Improvements

- Add logout button and proper session handling
- Add token expiration handling
- Improve frontend UI and error messages
- Move infrastructure into AWS SAM / CloudFormation / Terraform
- Add input validation
- Add rate limiting or AWS WAF
- Add better production-style logging
- Add custom domain
- Add unit/integration tests
