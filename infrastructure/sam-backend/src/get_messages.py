import json
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("sam-messages-table")


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
