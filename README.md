Arquitetura da Aplicação

Para este desafio foi utilizada uma arquitetura baseada em princípios do Domain-Driven Design (DDD) e no padrão Ports and Adapters (Hexagonal Architecture).
A aplicação foi construída com NestJS, mas sem depender de módulos externos complexos. O framework foi escolhido apenas para organizar o código em módulos, injetar dependências e permitir uma aplicação bem estruturada e escalável, mesmo sendo um CLI.

Motivos da escolha do NestJS:

Modularização clara (cada contexto isolado)

Inversão de dependência através de providers

Fácil manutenção e organização

Permite separar domínio, aplicação e infraestrutura

Facilita testes unitários e integração

O framework não adiciona peso à execução no formato CLI

Apesar de ser NestJS, não existe servidor HTTP, banco de dados ou qualquer camada adicional desnecessária.
A aplicação funciona estritamente como um programa de linha de comando.

Estrutura do Projeto

Resumo da estrutura de diretórios relevantes:

src/
capital-gains/
application/
use-cases/
services/
domain/
entities/
value-objects/
services/
ports/
enums/
infrastructure/
dto/
capital-gains.module.ts

cli/
application/
use-cases/
utils/
services/
domain/
errors/
ports/
value-objects/
infrastructure/
adapters/
input/
output/
file-system/
cli-framework/
interactive-ui/
presenters/
presentation/
interactive-console.presenter.ts
cli.service.ts
cli.module.ts

app.module.ts
main.ts

Principais responsabilidades:

Domínio (domain)
Contém entidades (Portfolio, Operation), regras de cálculo, value-objects e serviços de domínio independentes de qualquer tecnologia externa.

Application (use cases)
Orquestram regras e chamam o domínio.
Exemplo: ProcessOperationsUseCase, ProcessSellOperationUseCase.

Infrastructure (adapters)
Implementações concretas das portas:

leitores de STDIN e arquivos

escritores para console e arquivo

adaptador do Commander (CLI)

adaptador do Inquirer (modo interativo)

CLI
Define comandos do usuário: process, file, interactive, test.
Toda interação com o usuário ocorre nesta camada.

Portfolio em memória
Estado totalmente isolado dentro do repositório InMemoryPortfolioRepository.
Resetado a cada simulação conforme exigido no enunciado.

Comandos Disponíveis na CLI

O programa oferece quatro comandos principais.

process
Lê operações via stdin.
Uso:
echo '[{"operation":"buy","unit-cost":10,"quantity":100}]' | npm run cli:process

file
Lê operações a partir de um arquivo contendo múltiplos cenários.
Uso:
npm run cli:file -- --file ./input.txt

test
Executa todos os casos de teste programados na aplicação.
Uso:
npm run cli:test

interactive
Inicia o modo interativo visual com menus.
Uso:
npm run cli:interactive

Exemplos de Execução

Entrada via stdin

echo '[{"operation":"buy","unit-cost":10,"quantity":100}]' | npm run cli:process

Saída esperada:
[{"tax":0}]

Entrada via arquivo

Conteúdo do arquivo input.txt:
[{"operation":"buy","unit-cost":10,"quantity":100},
{"operation":"sell","unit-cost":15,"quantity":50},
{"operation":"sell","unit-cost":15,"quantity":50}]

Execução:
npm run cli:file -- --file input.txt

Saída:
[{"tax":0},{"tax":0},{"tax":0}]

Modo interativo
Permite registrar compras, vendas, visualizar portfólio e histórico.
Exemplo:
npm run cli:interactive

Exibe menus passo a passo:
Registrar compra, registrar venda, ver estado atual, ver histórico, sair.

Fluxo da Aplicação

O CLI recebe uma lista JSON de operações.

O validador verifica cada item (operation, unit-cost, quantity).

Cada simulação dispara um reset no repositório de portfólio.

Operações são convertidas em objetos de domínio.

Os use cases processam compra ou venda:

atualizam preço médio

acumulam prejuízo

consomem prejuízo futuro

calculam imposto quando aplicável

O resultado, para cada operação, é um TaxResult contendo o valor do imposto.

A saída é impressa em formato JSON.
