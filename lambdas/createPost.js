const db = require('../dbClient');

const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } =require('@aws-sdk/util-dynamodb');

const createPost = async (event) => {
  const response = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };

    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Post has been created succesfully",
      createResult,
    });
  } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to create the post.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
  }

  return response;
};

module.exports = { createPost };
