import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")

table_name = os.environ["TABLE_NAME"]

table = dynamodb.Table(table_name)


def lambda_handler(event, context):

    result = table.scan()

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "messages": result["Items"]
        })
    }
