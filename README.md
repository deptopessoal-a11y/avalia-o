# avalia-o

Portal de avaliação de conhecimento dos colaboradores da ACE Soluções Contábeis.

## Hospedagem

Este projeto **não roda em GitHub Pages puro**: o `index.html` carrega o formulário
através de `/api/formulario?chave=...`, uma função serverless (`api/formulario.js`)
que busca o link do JotForm no Firestore e faz o proxy do conteúdo (para contornar
o bloqueio de embed via iframe do JotForm). Faça o deploy em uma plataforma com
suporte a funções serverless em Node.js a partir da pasta `api/` — ex. Vercel,
importando este repositório diretamente (zero-config: ele detecta `api/*.js`
automaticamente).

## Firebase

Coleções usadas no Firestore: `autorizados`, `bloqueados`, `config`.
