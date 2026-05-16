import json
import boto3
import os
import time

dynamodb = boto3.resource("dynamodb")

table_name = os.environ["TABLE_NAME"]

table = dynamodb.Table(table_name)


def lambda_handler(event, context):

    for record in event.get("Records", []):
        time.sleep(10)

        item = json.loads(record["body"])

        table.put_item(Item=item)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Messages processed slowly"
        })
    }
