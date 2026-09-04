# avalia-o

Portal de avaliação de conhecimento dos colaboradores da ACE Soluções Contábeis.

## Hospedagem

Site 100% estático — funciona em qualquer host simples (GitHub Pages, Vercel,
Netlify etc.), sem precisar de função serverless. A avaliação (perguntas de
múltipla escolha, gabarito) é renderizada direto na página a partir dos dados
do Firestore; não depende mais de JotForm nem de nenhum serviço externo.

## Firebase

Coleções usadas no Firestore:
- `autorizados` — colaboradores liberados e a prova (`provaId`) atribuída a cada um
- `bloqueados` — controle de tentativa única / detecção de saída da prova
- `provas` — perguntas e gabarito de cada avaliação (gerenciadas pelo Painel Admin)
- `resultados` — respostas e nota de cada envio
