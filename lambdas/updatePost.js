const db = require('../dbClient');

const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } =require('@aws-sdk/util-dynamodb');

const updatePost = async (event) => {
  const response = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);
    const objKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ postId: event.pathParameters.postId }),
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }), {}),

      ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`:value${index}`]: body[key],
      }), {})),
    };

    const updateResult = await db.send(new UpdateItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully updated post.",
      updateResult,
    });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to update post.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
  }

  return response;
};

module.exports = { updatePost };
