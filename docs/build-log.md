# Build Log

## 2026-05-09

Started serverless web application portfolio project.

### Completed

- Created GitHub repository
- Added main README
- Added frontend folder
- Added backend folder
- Added architecture notes

### Current Focus

Setting up professional project structure before building AWS services.

### Frontend Deployment

- Uploaded frontend files to S3
- Enabled S3 static website hosting
- Added public read bucket policy for learning/demo purposes
- Confirmed website loads in browser
- Confirmed JavaScript button interaction works

### API Gateway + Lambda + DynamoDB

Built first complete serverless backend flow.

Architecture:

Browser
→ API Gateway
→ Lambda
→ DynamoDB

Completed:
- Created Lambda backend
- Created HTTP API Gateway
- Added GET /hello route
- Connected frontend JavaScript fetch() to API Gateway
- Configured CORS for browser access
- Created DynamoDB table
- Added least-privilege IAM permission for Lambda
- Successfully stored items in DynamoDB

- ### Read + Display Messages

Completed:
- Added GET /messages route
- Added DynamoDB Scan permission
- Updated Lambda to read messages from DynamoDB
- Updated frontend to display saved messages
- Confirmed messages appear on the webpage

- CloudFront + CI/CD Deployment

Built automated frontend deployment pipeline.

Architecture:

GitHub
→ GitHub Actions
→ IAM Role (OIDC)
→ S3
→ CloudFront
→ Browser

Completed:

Created dedicated GitHub Actions IAM role
Configured OIDC trust between GitHub and AWS
Added least-privilege S3 deployment permissions
Created GitHub Actions deployment workflow
Configured automatic frontend deployment to S3
Created CloudFront distribution
Configured S3 bucket as CloudFront origin
Enabled private S3 access from CloudFront
Configured default root object (index.html)
Added CloudFront cache invalidation step to deployment workflow
Confirmed automatic deployment + cache invalidation working
