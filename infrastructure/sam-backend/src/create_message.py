import json
import uuid
import boto3
import os

dynamodb = boto3.resource("dynamodb")

table_name = os.environ["TABLE_NAME"]

table = dynamodb.Table(table_name)


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
