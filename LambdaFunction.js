
// SDk LAMBDA
/*
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIA6GBMEOIS2ZZIUMWW',
  secretAccessKey: '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',
  region: 'us-east-1'
});


const lambda = new AWS.Lambda();

const params = {
  Code: {
    ZipFile: Buffer.from(`
    const AWS = require('aws-sdk');
    const docClient = new AWS.DynamoDB.DocumentClient();
    exports.handler = async function(event) {
      try {
        if (!event.Records || !Array.isArray(event.Records)) {
          console.error('O evento não contém registros válidos.');
          return { statusCode: 400, body: 'Evento inválido.' };
        }
    
        console.log('Eventos recebidos:', event.Records);
    
        for (const record of event.Records) {
          const messageBody = JSON.parse(record.body);
    
          const params = {
            TableName: 'Dynamo-api-transaction',
            Item: {
              idempotencyId: messageBody.idempotencyId,
              amount: messageBody.amount,
              type: messageBody.type
            },
          };
    
          await docClient.put(params).promise();
        }
    
        return { statusCode: 200, body: 'Mensagens processadas com sucesso!' };
      } catch (error) {
        console.error('Erro ao processar mensagens:', error);
        throw error;
      }
    };
    `)
  },
  FunctionName: 'NomeDaSuaFuncaoLambda',
  Handler: 'index.handler',
  Role: 'arn:aws:iam::975050142245:role/service-role/Lambda-API-transaction-role-ab3cxxcg', 
  Runtime: 'nodejs16.x', 
  Description: 'Uma função Lambda de exemplo'
};


lambda.createFunction(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log(data);
});


lambda.invoke({
  FunctionName: 'NomeDaSuaFuncaoLambda',
  InvocationType: 'RequestResponse', 
  LogType: 'Tail', 
}, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log(data);
})
 */



// CODIGO LAMBDA
/* 
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async function(event) {
  try {
    if (!event.Records || !Array.isArray(event.Records)) {
      console.error('O evento não contém registros válidos.');
      return { statusCode: 400, body: 'Evento inválido.' };
    }

    console.log('Eventos recebidos:', event.Records);

    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);

      const params = {
        TableName: 'Dynamo-api-transaction',
        Item: {
          idempotencyId: messageBody.idempotencyId,
          amount: messageBody.amount,
          type: messageBody.type
        },
      };

      await docClient.put(params).promise();
    }

    return { statusCode: 200, body: 'Mensagens processadas com sucesso!' };
  } catch (error) {
    console.error('Erro ao processar mensagens:', error);
    throw error;
  }
}; 
*/