# Use uma imagem leve do Node.js
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código fonte
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copia o output da build do estágio anterior
COPY --from=builder /app/.output ./.output

# Define variáveis de ambiente para o servidor Nuxt
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", ".output/server/index.mjs"]
