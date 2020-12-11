import json
import os
import boto3
from botocore.exceptions import ClientError

table_name = os.environ['PlaceTable']
dynamodb_client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def broadcastRequestToClients(request):
    
    # Retrieve all connection IDs from the table
    try:
        response = dynamodb_client.scan(TableName=table_name,
                                        ProjectionExpression='username')
    except ClientError as e:
        logger.error(e)
        raise ValueError(e)

    # Send the message to each connection
    api_client = boto3.client('apigatewaymanagementapi', endpoint_url='https://yv3c4llyjg.execute-api.us-east-1.amazonaws.com/production')
    for item in response['Items']:
        message = json.dumps(request).encode('utf-8')
        connectionId = item['username']['S']
        try:
            print(f'trying to do stuff... {connectionId}')
            api_client.post_to_connection(Data=message,
                                          ConnectionId=connectionId)
            print('done post to connection')
        
        except ClientError as e:
            print(e)
            print('----CLIENTERROR-Deleting key-----')
            try:
                response = table.delete_item(Key={
                    'username': connectionId
                })
            except ClientError as e:
                if e.response['Error']['Code'] == "ConditionalCheckFailedException":
                    print(e.response['Error']['Message'])
                else:
                    raise
def lambda_handler(event, context):
    try:
        for record in event['Records']:
            print(record)
            if record['eventName'] == 'INSERT':
                handle_insert(record)
            if record['eventName'] == 'MODIFY':
                handle_modify(record)
    except Exception as e:
        print(e)
        raise e
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def handle_insert(record):
    newImage = record['dynamodb']['NewImage']
    newPixel = newImage['pixel']['N']
    newColor = newImage['color']['S'] if 'color' in newImage else ''
    broadcastRequestToClients({'pixel': newPixel, 'from': 'DB','color': newColor})
    

def handle_modify(record):
    oldImage = record['dynamodb']['OldImage']
    newImage = record['dynamodb']['NewImage']
    
    oldColor = oldImage['color']['S'] if 'color' in oldImage else ''
    oldPixel = oldImage['pixel']['N']
    newColor = newImage['color']['S'] if 'color' in newImage else ''
    newPixel = newImage['pixel']['N']
    broadcastRequestToClients({'pixel': newPixel, 'from': 'DB', 'color': newColor})
    