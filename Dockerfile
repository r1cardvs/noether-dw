# Usa uma imagem oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os ficheiros de dependências
COPY package*.json ./

# Instala as dependências (em produção, use npm ci)
RUN npm ci --only=production

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que o Express está a escutar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]