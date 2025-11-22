# Capital Gains Calculator (CLI)

CLI para cálculo de imposto sobre ganho de capital em operações com ações, baseado no desafio técnico do Nubank.

A aplicação:

- Lê operações em formato JSON pela **entrada padrão (stdin)** ou por **arquivo**.
- Calcula o imposto devido em cada operação de venda.
- Mantém o estado do portfólio **em memória** durante cada simulação.
- Garante que **cada linha de entrada** é uma simulação independente.
- Expõe também um **modo interativo** opcional para explorar as regras de forma visual.

---

## 🧮 Regras de negócio implementadas

As regras seguem o enunciado do desafio:

- Cada operação possui:
  - `operation`: `"buy"` ou `"sell"`
  - `unit-cost`: preço unitário (número com duas casas decimais)
  - `quantity`: quantidade de ações

- **Compras (`buy`)**:
  - Nunca geram imposto.
  - Atualizam o **preço médio ponderado** de compra:
    \[
    \text{nova média} = \frac{q*{\text{atual}} \cdot \text{média atual} + q*{\text{comprada}} \cdot \text{preço compra}}{q*{\text{atual}} + q*{\text{comprada}}}
    \]
  - Exemplo do enunciado: compra 10 ações a 20,00 e 5 ações a 10,00 → média = 16,67.

- **Vendas (`sell`)**:
  - Calculam lucro ou prejuízo com base no **preço médio ponderado**.
  - **Prejuízo**:
    - Quando o preço de venda é menor que o preço médio.
    - Não gera imposto.
    - O valor absoluto do prejuízo é acumulado em um saldo de prejuízo para abater lucros futuros.
  - **Lucro**:
    - Se o **valor total da operação** (`unit-cost * quantity`) for **≤ 20.000,00**:
      - A operação é **isenta de imposto**, mesmo com lucro.
      - Não é feita dedução de prejuízo acumulado.
    - Se o valor total for **> 20.000,00**:
      - Deduzimos o **prejuízo acumulado** do lucro.
      - Aplicamos **20%** sobre o lucro tributável resultante.
      - Se o lucro for totalmente consumido pelo prejuízo acumulado, o imposto é zero.

- **Acúmulo e uso de prejuízo**:
  - Prejuízos são sempre acumulados, inclusive em operações com valor total ≤ 20.000,00.
  - Prejuízo acumulado é usado para deduzir **múltiplos lucros futuros**, até zerar.

- **Garantias**:
  - Nunca é vendida uma quantidade maior do que o total de ações disponíveis (validação feita no modo interativo).
  - O estado do portfólio é representado por:
    - `totalShares`
    - `weightedAveragePrice`
    - `accumulatedLoss`

---

## 🧾 Entrada e saída

### Formato de entrada

Cada linha representa **uma simulação independente** e contém uma lista JSON de operações:

```json
[
  { "operation": "buy", "unit-cost": 10.0, "quantity": 100 },
  { "operation": "sell", "unit-cost": 15.0, "quantity": 50 },
  { "operation": "sell", "unit-cost": 15.0, "quantity": 50 }
]
```
