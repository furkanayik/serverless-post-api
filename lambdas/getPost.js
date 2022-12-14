const db = require('../dbClient');

const { GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } =require('@aws-sdk/util-dynamodb');

const getPost = async (event) => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ postId: event.pathParameters.postId }),
    };
    
    const { Item } = await db.send(new GetItemCommand(params));

    console.log({ Item });
    response.body = JSON.stringify({
      message: "Successfully retrieved the post.",
      data: (Item) ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch(e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
      message: "Failed to get the post.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  };

  return response;
};

module.exports = { getPost };
