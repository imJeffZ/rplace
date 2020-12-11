const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });


exports.handler = async event => {
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() - 500);
  const putParams = {
    TableName: process.env.USERNAME,
    Item: {
      username: event.requestContext.connectionId,
      time: currentDate.toString()
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
  
  return { statusCode: 200, body: 'success' };
};
