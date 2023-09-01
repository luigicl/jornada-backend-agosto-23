const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
//const cors = require("cors");

// const url = "mongodb://localhost:27017";
// const url = "mongodb://127.0.0.1:27017";
// const url = "mongodb://127.0.0.1:27017";
const url = "mongodb+srv://luigicl:Jis1aoAnWiguwKS8@cluster0.nb3lxpv.mongodb.net";
const dbName = "jornada-backend-agosto-23";
const client = new MongoClient(url);

async function main() {
  console.info("Conectando ao banco de dados...");
  await client.connect();
  console.info("Banco de dados conectado com sucesso!");

  const db = client.db(dbName);
  const collection = db.collection("herois");

  const app = express();

  // Habilitamos o processamento de JSON
  app.use(express.json());

  // Endpoint Principal
  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  // Endpoint /oi
  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  // Endpoints de Herois
  const lista = ["Mulher Maravilha", "Capitã Marvel", "Homem de Ferro"];
  //             0                    1                2

  // Read All -> [GET] /herois
  app.get("/herois", async function (req, res) {
    const itens = await collection.find().toArray();
    res.send(itens);
  });

 
  // Create -> [POST] /herois Post de um item por vez
  app.post("/herois", async function (req, res) {
    // console.log(req.body, typeof req.body);

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

    // Inserir o item na collection
    await collection.insertOne(item);

    // Enviamos uma resposta de sucesso
    res.status(201).send(item);
  });


/*
// Create -> [POST] /herois Post de vários itens ao mesmo tempo vez
app.post("/herois", async function (req, res) {
  // console.log(req.body, typeof req.body);

  const itens = req.body;

  if (!itens.length || !Array.isArray(itens)) {
    return res.status(400).send("Envie uma lista!")
  }

  // Inserir o item na collection
  await collection.insertMany(itens);

  // Enviamos uma resposta de sucesso
  res.status(201).send(itens);
});
*/


  // Read By Id -> [GET] /herois/:id
  app.get("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Pegamos a informação da collection
    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    // Exibimos o item na resposta do endpoint
    res.send(item);
  });

  // Update -> [PUT] /herois/:id
  app.put("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

    // Atualizamos a informação na collection
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });

    res.send(item);
  });

  // Delete -> [DELETE] /herois/:id
  app.delete("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Excluir o item da collection
    await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(204).send();
  });

  app.listen(process.env.PORT || 3000);
}

main();
