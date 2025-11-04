## Sobre

Esse APP lista Consultores e Clientes anexados aos consultores em uma tabela com filtros.

Algumas funcionalidades estão com bugs ou ainda não funcionam, são elas:

- Cadastro de novo Consultor (user) é efetuado com sucesso, porém ao tentar anexar o ID de user a um cliente ele retorna 200 mas não faz o update.
- Delete de usuários não funciona ainda.

## Instalação

Primeiro gere o DB com o prisma, utilize o comando abaixo para evitar erros

```bash
npx prisma migrate reset --force
```

Depois é só rodar localmente

```bash
npm run dev
```

