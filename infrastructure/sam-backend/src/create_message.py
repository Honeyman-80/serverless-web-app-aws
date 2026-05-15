import json
import uuid
import boto3
import os

sqs = boto3.client("sqs")

queue_url = os.environ["QUEUE_URL"]


def lambda_handler(event, context):

    body = json.loads(event.get("body", "{}"))

    message = body.get("message", "")

    item = {
        "id": str(uuid.uuid4()),
        "message": message
    }

    sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(item)
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": "Message sent to queue!",
            "item": item
        })
    }
