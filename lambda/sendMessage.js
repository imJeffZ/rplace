const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  let connectionData;

  try {
    connectionData = await ddb
      .scan({ TableName: TABLE_NAME, ProjectionExpression: "username" })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const postData = JSON.parse(event.body).data;
  const data_postData = JSON.parse(postData);

  var pixel = data_postData.pixel;
  var color = data_postData.color;

  const username = event.requestContext.connectionId;

  try {
    const params = {
      TableName: "placeTable",
      Key: {
        username: username,
      },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
      region: "us-east-1",
    });

    try {
      var data = await documentClient.get(params).promise();
      const old_date = new Date(data.Item.time);
      const currentDate = new Date();
      old_date.setSeconds(old_date.getSeconds() + 300);

      if (old_date < currentDate) {
        const params = {
          TableName: "placeTable",
          Item: {
            username: username,
            time: currentDate.toString(),
          },
        };
        var data = await documentClient.put(params).promise();

        const params2 = {
          TableName: "placeBoard",
          Item: {
            pixel: pixel,
            color: color,
          },
        };
        var data2 = await documentClient.put(params2).promise();
        
        let confirmData = {statusCode: "200", currentDate}
        try {
          await apigwManagementApi.postToConnection({ ConnectionId: username, Data: JSON.stringify(confirmData)}).promise();
        } catch (e) {
          if (e.statusCode === 410) {
            await ddb.delete({ TableName: TABLE_NAME, Key: { username } }).promise();
          } else {
            throw e;
          }
        }
        
      } else {
        // return { statusCode: 403, body: "Please wait 5 minutes before sending again" }; //UPDATE HERE RETURN 403 TO USER
      }
    } catch (err) {
      console.log(err);
    }
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${username}`);
      await ddb.delete({ TableName: TABLE_NAME, Key: { username } }).promise();
    } else {
      throw e;
    }
  }

  return { statusCode: 200, body: "Data sent." };
};
