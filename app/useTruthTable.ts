import { useState, useMemo } from "react";
import { Token, evaluateFormula, generateCombinations } from "./truthTableLogic";

export function useTruthTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string>("");

  const formula = tokens.map((t) => t.display).join(" ");

  const addToken = (type: Token["type"], value: string, display: string) => {
    setTokens((prev) => [...prev, { type, value, display }]);
    setError("");
  };

  const removeLastToken = () => {
    setTokens(tokens.slice(0, -1));
    setError("");
  };

  const clearAll = () => {
    setTokens([]);
    setError("");
  };

  const usedVariables = useMemo(() => {
    const vars = tokens
      .filter((t) => t.type === "variable")
      .map((t) => t.value);
    return [...new Set(vars)].sort();
  }, [tokens]);

  const truthTable = useMemo(() => {
    if (usedVariables.length === 0 || tokens.length === 0) return null;

    const combinations = generateCombinations(usedVariables);
    const results: {
      values: Record<string, boolean>;
      result: boolean | null;
    }[] = [];

    for (const combo of combinations) {
      try {
        const result = evaluateFormula(tokens, combo);
        results.push({ values: combo, result });
      } catch {
        results.push({ values: combo, result: null });
      }
    }

    return results;
  }, [tokens, usedVariables]);

  const isValidFormula = useMemo(() => {
    if (tokens.length === 0) return false;

    let parenCount = 0;
    let lastType: Token["type"] | null = null;

    for (const token of tokens) {
      if (token.value === "(") parenCount++;
      if (token.value === ")") parenCount--;
      if (parenCount < 0) return false;

      if (lastType === "variable" && token.type === "variable") return false;
      if (
        lastType === "operator" &&
        token.type === "operator" &&
        token.value !== "¬"
      )
        return false;

      lastType = token.type;
    }

    if (parenCount !== 0) return false;

    const lastToken = tokens[tokens.length - 1];
    if (lastToken.type === "operator") return false;
    if (lastToken.value === "(") return false;

    return true;
  }, [tokens]);

  const tableAnalysis = useMemo(() => {
    if (!truthTable || !isValidFormula) return null;

    const results = truthTable.map((r) => r.result);
    const allTrue = results.every((r) => r === true);
    const allFalse = results.every((r) => r === false);
    const hasNull = results.some((r) => r === null);

    if (hasNull) return { type: "error", message: "Error en la evaluación" };
    if (allTrue)
      return { type: "tautology", message: "Tautología (siempre verdadera)" };
    if (allFalse)
      return {
        type: "contradiction",
        message: "Contradicción (siempre falsa)",
      };
    return {
      type: "contingent",
      message: "Contingencia (depende de los valores)",
    };
  }, [truthTable, isValidFormula]);

  return {
    tokens,
    setTokens,
    error,
    formula,
    addToken,
    removeLastToken,
    clearAll,
    usedVariables,
    truthTable,
    isValidFormula,
    tableAnalysis,
  };
}
