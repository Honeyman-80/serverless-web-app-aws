# Lessons Learned

## GitHub Project Structure

- A repository is the container for the project.
- A commit is a saved checkpoint.
- Folders help separate different parts of the system.
- Documentation makes the project easier to revisit later.

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
