import json
import uuid
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("sam-messages-table")


def lambda_handler(event, context):

    route_key = f"{event['httpMethod']} {event['path']}"
    )

    if route_key == "GET /hello":
        return response(200, {
            "message": "Hello from SAM Lambda!"
        })

    if route_key == "POST /message":

        body = json.loads(event.get("body", "{}"))

        message = body.get("message", "")

        item = {
            "id": str(uuid.uuid4()),
            "message": message
        }

        table.put_item(Item=item)

        return response(200, {
            "message": "Message saved!",
            "item": item
        })

    return response(404, {
        "message": "Route not found"
    })


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }
