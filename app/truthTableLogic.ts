export type Token = {
  type: "variable" | "operator" | "paren";
  value: string;
  display: string;
};

export const operators = [
  { symbol: "¬", name: "NOT", display: "¬", description: "Negación" },
  { symbol: "∧", name: "AND", display: "∧", description: "Conjunción" },
  { symbol: "∨", name: "OR", display: "∨", description: "Disyunción" },
  { symbol: "→", name: "IMPLIES", display: "→", description: "Implicación" },
  {
    symbol: "↔",
    name: "BICONDITIONAL",
    display: "↔",
    description: "Bicondicional",
  }
];

export const variables = ["p", "q", "r", "s", "t"];

export const parentheses = [
  { symbol: "(", display: "(" },
  { symbol: ")", display: ")" },
];

export const generateCombinations = (vars: string[]): Record<string, boolean>[] => {
  if (vars.length === 0) return [{}];
  const count = Math.pow(2, vars.length);
  const combinations: Record<string, boolean>[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const combo: Record<string, boolean> = {};
    vars.forEach((v, index) => {
      combo[v] = Boolean((i >> (vars.length - 1 - index)) & 1);
    });
    combinations.push(combo);
  }
  return combinations;
};

export const evaluateExpression = (
  tokenList: Token[],
  values: Record<string, boolean>,
): boolean => {
  const output: (boolean | string)[] = [];
  const operatorStack: Token[] = [];

  const precedence: Record<string, number> = {
    "¬": 5,
    "∧": 4,
    "∨": 3,
    "⊕": 3,
    "→": 2,
    "↔": 1,
  };

  const isRightAssociative: Record<string, boolean> = {
    "¬": true,
    "∧": false,
    "∨": false,
    "⊕": false,
    "→": true,
    "↔": false,
  };

  for (const token of tokenList) {
    if (token.type === "variable") {
      output.push(values[token.value]);
    } else if (token.type === "operator") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === "operator"
      ) {
        const top = operatorStack[operatorStack.length - 1];
        if (
          (isRightAssociative[token.value] &&
            precedence[token.value] < precedence[top.value]) ||
          (!isRightAssociative[token.value] &&
            precedence[token.value] <= precedence[top.value])
        ) {
          output.push(operatorStack.pop()!.value);
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.value === "(") {
      operatorStack.push(token);
    } else if (token.value === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].value !== "("
      ) {
        output.push(operatorStack.pop()!.value);
      }
      operatorStack.pop();
    }
  }

  while (operatorStack.length > 0) {
    output.push(operatorStack.pop()!.value);
  }

  const evalStack: boolean[] = [];

  for (const item of output) {
    if (typeof item === "boolean") {
      evalStack.push(item);
    } else {
      switch (item) {
        case "¬": {
          const a = evalStack.pop()!;
          evalStack.push(!a);
          break;
        }
        case "∧": {
          const b = evalStack.pop()!;
          const a = evalStack.pop()!;
          evalStack.push(a && b);
          break;
        }
        case "∨": {
          const b = evalStack.pop()!;
          const a = evalStack.pop()!;
          evalStack.push(a || b);
          break;
        }
        case "→": {
          const b = evalStack.pop()!;
          const a = evalStack.pop()!;
          evalStack.push(!a || b);
          break;
        }
        case "↔": {
          const b = evalStack.pop()!;
          const a = evalStack.pop()!;
          evalStack.push(a === b);
          break;
        }
        case "⊕": {
          const b = evalStack.pop()!;
          const a = evalStack.pop()!;
          evalStack.push(a !== b);
          break;
        }
      }
    }
  }

  return evalStack[0] ?? false;
};

export const evaluateFormula = (
  tokens: Token[],
  values: Record<string, boolean>,
): boolean | null => {
  try {
    return evaluateExpression(tokens, values);
  } catch {
    return null;
  }
};
