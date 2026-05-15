import json
import uuid
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("sam-messages-table")


def lambda_handler(event, context):

    body = json.loads(event.get("body", "{}"))

    message = body.get("message", "")

    item = {
        "id": str(uuid.uuid4()),
        "message": message
    }

    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": "Message saved!",
            "item": item
        })
    }
