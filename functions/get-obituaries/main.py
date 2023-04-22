import boto3


def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('the-last-show-30160521')

    try:
        response = table.scan()
        items = response['Items']
        return {
            'statusCode': 200,
            'body': items
        }
    except Exception as e:
        print("Query failed: " + str(e))
        return {
            'statusCode': 500,
            'body': str(e)
        }
