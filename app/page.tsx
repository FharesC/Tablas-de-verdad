"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Undo2, Calculator } from "lucide-react"

type Token = {
  type: "variable" | "operator" | "paren"
  value: string
  display: string
}

const operators = [
  { symbol: "¬", name: "NOT", display: "¬", description: "Negación" },
  { symbol: "∧", name: "AND", display: "∧", description: "Conjunción" },
  { symbol: "∨", name: "OR", display: "∨", description: "Disyunción" },
  { symbol: "→", name: "IMPLIES", display: "→", description: "Implicación" },
  { symbol: "↔", name: "BICONDITIONAL", display: "↔", description: "Bicondicional" },
  { symbol: "⊕", name: "XOR", display: "⊕", description: "Disyunción exclusiva" },
]

const variables = ["p", "q", "r", "s", "t"]

const parentheses = [
  { symbol: "(", display: "(" },
  { symbol: ")", display: ")" },
]

export default function TruthTableGenerator() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [error, setError] = useState<string>("")

  const formula = tokens.map((t) => t.display).join(" ")

  const addToken = (type: Token["type"], value: string, display: string) => {
    console.log("[v0] addToken called:", { type, value, display })
    setTokens((prev) => [...prev, { type, value, display }])
    setError("")
  }

  const removeLastToken = () => {
    setTokens(tokens.slice(0, -1))
    setError("")
  }

  const clearAll = () => {
    setTokens([])
    setError("")
  }

  // Extraer variables únicas de la fórmula
  const usedVariables = useMemo(() => {
    const vars = tokens.filter((t) => t.type === "variable").map((t) => t.value)
    return [...new Set(vars)].sort()
  }, [tokens])

  // Generar todas las combinaciones de valores
  const generateCombinations = (vars: string[]): Record<string, boolean>[] => {
    if (vars.length === 0) return [{}]
    const count = Math.pow(2, vars.length)
    const combinations: Record<string, boolean>[] = []
    for (let i = 0; i < count; i++) {
      const combo: Record<string, boolean> = {}
      vars.forEach((v, index) => {
        combo[v] = Boolean((i >> (vars.length - 1 - index)) & 1)
      })
      combinations.push(combo)
    }
    return combinations
  }

  // Evaluar la fórmula con valores dados
  const evaluateFormula = (values: Record<string, boolean>): boolean | null => {
    try {
      // Convertir tokens a una expresión evaluable
      let expr = ""
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token.type === "variable") {
          expr += values[token.value] ? "true" : "false"
        } else if (token.type === "paren") {
          expr += token.value
        } else if (token.type === "operator") {
          switch (token.value) {
            case "¬":
              expr += "!"
              break
            case "∧":
              expr += "&&"
              break
            case "∨":
              expr += "||"
              break
            case "→":
              // a → b es equivalente a !a || b
              // Necesitamos buscar el operando anterior y siguiente
              expr = expr.slice(0, -("true".length > expr.length ? expr.length : findLastOperandStart(expr)))
              const prevOperand = findLastOperand(expr, tokens, i, values)
              expr = expr + `(!${prevOperand} || `
              // El siguiente operando se añadirá normalmente, pero necesitamos cerrar el paréntesis
              break
            case "↔":
              // a ↔ b es equivalente a (a && b) || (!a && !b)
              expr += "==="
              break
            case "⊕":
              // XOR: a ⊕ b es equivalente a (a || b) && !(a && b) o simplemente a !== b
              expr += "!=="
              break
          }
        }
      }

      // Simplificar evaluación usando una función más robusta
      return evaluateExpression(tokens, values)
    } catch {
      return null
    }
  }

  // Función para evaluar expresiones lógicas de forma recursiva
  const evaluateExpression = (
    tokenList: Token[],
    values: Record<string, boolean>
  ): boolean => {
    // Convertir a notación postfija y evaluar
    const output: (boolean | string)[] = []
    const operatorStack: Token[] = []

    const precedence: Record<string, number> = {
      "¬": 5,
      "∧": 4,
      "∨": 3,
      "⊕": 3,
      "→": 2,
      "↔": 1,
    }

    const isRightAssociative: Record<string, boolean> = {
      "¬": true,
      "∧": false,
      "∨": false,
      "⊕": false,
      "→": true,
      "↔": false,
    }

    for (const token of tokenList) {
      if (token.type === "variable") {
        output.push(values[token.value])
      } else if (token.type === "operator") {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === "operator"
        ) {
          const top = operatorStack[operatorStack.length - 1]
          if (
            (isRightAssociative[token.value] &&
              precedence[token.value] < precedence[top.value]) ||
            (!isRightAssociative[token.value] &&
              precedence[token.value] <= precedence[top.value])
          ) {
            output.push(operatorStack.pop()!.value)
          } else {
            break
          }
        }
        operatorStack.push(token)
      } else if (token.value === "(") {
        operatorStack.push(token)
      } else if (token.value === ")") {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].value !== "("
        ) {
          output.push(operatorStack.pop()!.value)
        }
        operatorStack.pop() // Remove the "("
      }
    }

    while (operatorStack.length > 0) {
      output.push(operatorStack.pop()!.value)
    }

    // Evaluar la expresión postfija
    const evalStack: boolean[] = []

    for (const item of output) {
      if (typeof item === "boolean") {
        evalStack.push(item)
      } else {
        switch (item) {
          case "¬": {
            const a = evalStack.pop()!
            evalStack.push(!a)
            break
          }
          case "∧": {
            const b = evalStack.pop()!
            const a = evalStack.pop()!
            evalStack.push(a && b)
            break
          }
          case "∨": {
            const b = evalStack.pop()!
            const a = evalStack.pop()!
            evalStack.push(a || b)
            break
          }
          case "→": {
            const b = evalStack.pop()!
            const a = evalStack.pop()!
            evalStack.push(!a || b)
            break
          }
          case "↔": {
            const b = evalStack.pop()!
            const a = evalStack.pop()!
            evalStack.push(a === b)
            break
          }
          case "⊕": {
            const b = evalStack.pop()!
            const a = evalStack.pop()!
            evalStack.push(a !== b)
            break
          }
        }
      }
    }

    return evalStack[0] ?? false
  }

  // Helper function (no se usa actualmente pero se mantiene por si acaso)
  const findLastOperand = (
    _expr: string,
    _tokens: Token[],
    _currentIndex: number,
    _values: Record<string, boolean>
  ): string => {
    return "true"
  }

  const findLastOperandStart = (_expr: string): number => {
    return 4
  }

  // Generar la tabla de verdad
  const truthTable = useMemo(() => {
    if (usedVariables.length === 0 || tokens.length === 0) return null

    const combinations = generateCombinations(usedVariables)
    const results: { values: Record<string, boolean>; result: boolean | null }[] = []

    for (const combo of combinations) {
      try {
        const result = evaluateFormula(combo)
        results.push({ values: combo, result })
      } catch {
        results.push({ values: combo, result: null })
      }
    }

    return results
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, usedVariables])

  // Verificar si la fórmula es válida
  const isValidFormula = useMemo(() => {
    if (tokens.length === 0) return false

    let parenCount = 0
    let lastType: Token["type"] | null = null

    for (const token of tokens) {
      if (token.value === "(") parenCount++
      if (token.value === ")") parenCount--
      if (parenCount < 0) return false

      // Verificar secuencia válida
      if (lastType === "variable" && token.type === "variable") return false
      if (
        lastType === "operator" &&
        token.type === "operator" &&
        token.value !== "¬"
      )
        return false

      lastType = token.type
    }

    if (parenCount !== 0) return false

    // Debe terminar en variable o paréntesis de cierre
    const lastToken = tokens[tokens.length - 1]
    if (lastToken.type === "operator") return false
    if (lastToken.value === "(") return false

    return true
  }, [tokens])

  // Analizar el resultado de la tabla
  const tableAnalysis = useMemo(() => {
    if (!truthTable || !isValidFormula) return null

    const results = truthTable.map((r) => r.result)
    const allTrue = results.every((r) => r === true)
    const allFalse = results.every((r) => r === false)
    const hasNull = results.some((r) => r === null)

    if (hasNull) return { type: "error", message: "Error en la evaluación" }
    if (allTrue) return { type: "tautology", message: "Tautología (siempre verdadera)" }
    if (allFalse) return { type: "contradiction", message: "Contradicción (siempre falsa)" }
    return { type: "contingent", message: "Contingencia (depende de los valores)" }
  }, [truthTable, isValidFormula])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8" />
            Generador de Tablas de Verdad
          </h1>
          <p className="text-muted-foreground">
            Construye fórmulas lógicas y genera su tabla de verdad automáticamente
          </p>
        </div>

        {/* Fórmula actual */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Fórmula</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[60px] rounded-lg border bg-muted/50 p-4 font-mono text-xl flex items-center">
              {formula || (
                <span className="text-muted-foreground">
                  Usa los botones para construir tu fórmula...
                </span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={removeLastToken}
                disabled={tokens.length === 0}
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Deshacer
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAll}
                disabled={tokens.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Botones de entrada */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Variables */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <Button
                    key={v}
                    type="button"
                    variant="secondary"
                    className="h-12 w-12 text-lg font-semibold"
                    onClick={() => addToken("variable", v, v)}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Operadores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Operadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {operators.map((op) => (
                  <Button
                    key={op.symbol}
                    type="button"
                    variant="default"
                    className="h-12 w-12 text-xl font-bold"
                    onClick={() => addToken("operator", op.symbol, op.display)}
                    title={`${op.name} - ${op.description}`}
                  >
                    {op.display}
                  </Button>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                {operators.map((op) => (
                  <div key={op.symbol}>
                    <span className="font-mono">{op.display}</span> = {op.description}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paréntesis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Paréntesis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {parentheses.map((p) => (
                  <Button
                    key={p.symbol}
                    type="button"
                    variant="outline"
                    className="h-12 w-12 text-xl font-bold"
                    onClick={() => addToken("paren", p.symbol, p.display)}
                  >
                    {p.display}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de verdad */}
        {tokens.length > 0 && usedVariables.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Tabla de Verdad</span>
                {tableAnalysis && (
                  <span
                    className={`text-sm font-normal px-3 py-1 rounded-full ${
                      tableAnalysis.type === "tautology"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : tableAnalysis.type === "contradiction"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : tableAnalysis.type === "contingent"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {tableAnalysis.message}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isValidFormula ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Completa la fórmula para ver la tabla de verdad</p>
                  <p className="text-sm mt-1">
                    Asegúrate de que los paréntesis estén balanceados y la fórmula sea válida
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {usedVariables.map((v) => (
                          <TableHead
                            key={v}
                            className="text-center font-bold text-base"
                          >
                            {v}
                          </TableHead>
                        ))}
                        <TableHead className="text-center font-bold text-base border-l-2">
                          {formula}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {truthTable?.map((row, index) => (
                        <TableRow key={index}>
                          {usedVariables.map((v) => (
                            <TableCell
                              key={v}
                              className="text-center font-mono text-base"
                            >
                              {row.values[v] ? "V" : "F"}
                            </TableCell>
                          ))}
                          <TableCell
                            className={`text-center font-mono text-base font-bold border-l-2 ${
                              row.result === true
                                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                : row.result === false
                                  ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                  : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {row.result === null ? "?" : row.result ? "V" : "F"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ejemplos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ejemplos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "∧", display: "∧" },
                    { type: "variable", value: "q", display: "q" },
                  ])
                }}
              >
                <span className="font-mono">p ∧ q</span>
                <span className="text-muted-foreground ml-2">— Conjunción</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "→", display: "→" },
                    { type: "variable", value: "q", display: "q" },
                  ])
                }}
              >
                <span className="font-mono">p → q</span>
                <span className="text-muted-foreground ml-2">— Implicación</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "operator", value: "¬", display: "¬" },
                    { type: "paren", value: "(", display: "(" },
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "∧", display: "∧" },
                    { type: "variable", value: "q", display: "q" },
                    { type: "paren", value: ")", display: ")" },
                  ])
                }}
              >
                <span className="font-mono">¬(p ∧ q)</span>
                <span className="text-muted-foreground ml-2">— Negación de conjunción</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "∨", display: "∨" },
                    { type: "operator", value: "¬", display: "¬" },
                    { type: "variable", value: "p", display: "p" },
                  ])
                }}
              >
                <span className="font-mono">p ∨ ¬p</span>
                <span className="text-muted-foreground ml-2">— Tautología (Ley del tercero excluido)</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "↔", display: "↔" },
                    { type: "variable", value: "q", display: "q" },
                  ])
                }}
              >
                <span className="font-mono">p ↔ q</span>
                <span className="text-muted-foreground ml-2">— Bicondicional</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left h-auto py-2"
                onClick={() => {
                  clearAll()
                  setTokens([
                    { type: "paren", value: "(", display: "(" },
                    { type: "variable", value: "p", display: "p" },
                    { type: "operator", value: "→", display: "→" },
                    { type: "variable", value: "q", display: "q" },
                    { type: "paren", value: ")", display: ")" },
                    { type: "operator", value: "∧", display: "∧" },
                    { type: "paren", value: "(", display: "(" },
                    { type: "variable", value: "q", display: "q" },
                    { type: "operator", value: "→", display: "→" },
                    { type: "variable", value: "r", display: "r" },
                    { type: "paren", value: ")", display: ")" },
                  ])
                }}
              >
                <span className="font-mono">(p → q) ∧ (q → r)</span>
                <span className="text-muted-foreground ml-2">— Silogismo hipotético</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
