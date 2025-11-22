Capital Gains Calculator (CLI)

Este projeto implementa um programa de linha de comando para cálculo de imposto sobre ganho de capital em operações de compra e venda de ações, conforme as regras especificadas no desafio técnico do Nubank.

O programa lê operações em formato JSON a partir da entrada padrão (stdin) ou de um arquivo, processa cada operação em ordem e retorna uma lista contendo os valores de imposto de cada operação de venda. Cada linha de entrada representa uma simulação independente e o estado interno do portfólio é reiniciado entre simulações.

A aplicação também inclui um modo interativo opcional para facilitar testes manuais.

1. Decisões Técnicas e Arquiteturais

A solução foi construída utilizando NestJS como framework base, mas sem qualquer servidor HTTP, banco de dados ou estruturas externas desnecessárias. O objetivo principal foi criar um CLI simples, organizado, testável e extensível.

Arquitetura

A arquitetura segue os princípios de Domain-Driven Design (DDD) e Ports and Adapters (Arquitetura Hexagonal), estruturada da seguinte forma:

Domínio
Contém as regras de negócio puras (entidades, value objects, serviços de domínio).
Exemplos: Portfolio, Operation, TaxCalculationService.

Aplicação (Use Cases)
Orquestra regras do domínio e coordena fluxo entre portas.
Exemplos: ProcessOperationsUseCase, ProcessBuyOperationUseCase.

Infraestrutura
Implementações concretas das portas de entrada e saída.
Exemplos: leitura de arquivos, leitura de stdin, escrita no console, adaptadores CLI.

CLI
Onde são definidos os comandos process, file, test e interactive.

Estado em memória

O estado do portfólio é mantido totalmente em memória dentro do repositório InMemoryPortfolioRepository e é sempre reiniciado a cada simulação, como exige o enunciado.

Motivos para uso do NestJS

Organização modular clara

Injeção de dependências nativa

Separação explícita entre camadas

Melhor manutenibilidade a longo prazo

Facilita testes unitários e integração

Não adiciona complexidade desnecessária no modo CLI

Apesar de usar NestJS, a aplicação continua simples e focada.

2. Justificativa para Frameworks e Bibliotecas

NestJS
Usado unicamente para modularização e injeção de dependências.
Não há rotas HTTP, bancos, controllers, pipes ou middlewares.

Commander
Biblioteca leve, utilizada apenas para o registro dos comandos da CLI.

Inquirer
Opcional, usado apenas para o modo interativo.
Não afeta a execução principal do desafio.

Nenhuma biblioteca externa é utilizada no domínio ou nas regras de cálculo.

3. Como Compilar e Executar o Projeto

Instalar dependências:

npm install

Compilar:

npm run build

Executar o CLI compilado:

node dist/main.js

Executar via ts-node (sem compilar):

npm run cli

4. Uso dos Comandos da CLI
   4.1. Processar operações via stdin (modo principal do desafio)
   echo '[{"operation":"buy","unit-cost":10,"quantity":100}]' | npm run cli:process

4.2. Processar operações a partir de arquivo
npm run cli:file -- --file ./input.txt

4.3. Executar todos os casos de teste da aplicação
npm run cli:test

4.4. Iniciar o modo interativo (opcional)
npm run cli:interactive

5. Como Executar os Testes da Solução

Os testes implementam todos os 9 casos oficiais do enunciado, além de testes adicionais de consistência.

Para executar:

npm run cli:test

Ou na versão compilada:

npm run calc:test

Cada caso exibe PASSOU ou FALHOU no terminal.

6. Estrutura do Projeto (Resumo)
   src/
   ├── capital-gains/
   │ ├── application/
   │ │ ├── use-cases/
   │ │ └── services/
   │ ├── domain/
   │ │ ├── entities/
   │ │ ├── ports/
   │ │ ├── value-objects/
   │ │ └── services/
   │ └── infrastructure/
   │ └── dto/
   │
   ├── cli/
   │ ├── application/
   │ ├── domain/
   │ ├── infrastructure/
   │ │ └── adapters/
   │ ├── presentation/
   │ ├── cli.service.ts
   │ └── cli.module.ts
   │
   ├── app.module.ts
   └── main.ts

7. Notas Importantes

O estado do portfólio é reiniciado a cada linha de entrada, conforme exigido pelo desafio.

Todos os valores são arredondados para duas casas decimais.

A saída JSON retorna números no formato padrão (sem strings).

Nenhum banco de dados externo é utilizado.

O domínio é completamente independente da camada de infraestrutura.

O modo interativo é opcional e não interfere na solução principal.
