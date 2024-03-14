const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: 'AKIA6GBMEOISV6EV5DO6',
    secretAccessKey: '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'
});

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
AWS.config.update({ region: 'us-east-1' });
const sqs = new AWS.SQS();
const queueUrl = 'https://sqs.us-east-1.amazonaws.com/975050142245/api';
const dynamodb = new AWS.DynamoDB.DocumentClient(); 

app.use(bodyParser.json());

let transactionsStarted = false;

app.post('/transacao', async (req, res) => {
    const { idempotencyId, amount, type } = req.body;

    try {
        const params = {
            MessageBody: JSON.stringify({ idempotencyId, amount, type }),
            QueueUrl: queueUrl
        };

        await sqs.sendMessage(params).promise();
        console.log(`Transação enviada com sucesso: ID ${idempotencyId}, Valor ${amount}`);
        
        if (!transactionsStarted) {
            transactionsStarted = true;
            createMultipleTransactions();
        }

        res.status(201).json({ message: 'Transação enviada com sucesso para a fila SQS.' });
    } catch (err) {
        console.error('Erro ao enviar mensagem para a fila SQS:', err);
        res.status(500).json({ error: 'Erro ao processar a transação.' });
    }
});


app.get('/transacoes', async (req, res) => {
    const params = {
        TableName: 'Dynamo-api-transaction',
    };
    try {
        const data = await dynamodb.scan(params).promise();
        res.status(200).json(data.Items);
    } catch (err) {
        console.error('Erro ao buscar transações no DynamoDB:', err);
        res.status(500).json({ error: 'Erro ao buscar transações.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const apiUrl = `http://localhost:${PORT}/transacao`;
const totalTransactions = 100;

async function createTransaction() {
    const maxAmount = 10000;
    const minAmount = 0; 
    const idempotencyId = uuidv4();
    let amount;
    if (Math.random() < 0.5) { 
        amount = (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2); 
    } else {
        amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount; 
    }
    const type = Math.random() < 0.5 ? 'credit' : 'debit'; 

    try {
        await axios.post(apiUrl, { idempotencyId, amount, type });
    } catch (error) {
        console.error('Erro ao enviar transação:', error.response.data.error);
    }
}

async function createMultipleTransactions() {
    console.log(`Enviando ${totalTransactions} transações...`);
    for (let i = 0; i < totalTransactions; i++) {
        await createTransaction();
    }
    console.log('Todas as transações foram enviadas com sucesso.');
}
