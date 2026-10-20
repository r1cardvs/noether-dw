const pkg = require("../package.json");

function systemInfo() {
  return {
    sistema: pkg.name,
    versao: pkg.version,
    autor: pkg.author,
    dataCriacao: pkg.createdAt,
    descricao: pkg.description,
  };
}

module.exports = { systemInfo };
