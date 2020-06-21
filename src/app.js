const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');
const { response } = require('express');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  const { title } = request.query;

  const results = title
        ? repositories.filter(project => repositories.title.includes(title))
        : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  //  A rota deve receber title, url e techs dentro do corpo da requisição, 
  // sendo a URL o link para o github desse repositório.
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  // PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs 
  // do repositório que possua o id igual ao id presente nos parâmetros da rota;
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);


  if (repositoryIndex < 0){
    return response.status(400).json({error:'Repository not found.'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repository[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error:'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através 
  // do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error:'Repository not found.'})
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
