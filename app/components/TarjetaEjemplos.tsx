import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "../truthTableLogic";

interface TarjetaEjemplosProps {
  clearAll: () => void;
  setTokens: (tokens: Token[]) => void;
}

const EJEMPLOS = [
  {
    formula: "p ∧ q",
    nombre: "Conjunción",
    tokens: [
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "∧", display: "∧" },
      { type: "variable" as const, value: "q", display: "q" },
    ],
  },
  {
    formula: "p → q",
    nombre: "Implicación",
    tokens: [
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "→", display: "→" },
      { type: "variable" as const, value: "q", display: "q" },
    ],
  },
  {
    formula: "¬(p ∧ q)",
    nombre: "Negación de conjunción",
    tokens: [
      { type: "operator" as const, value: "¬", display: "¬" },
      { type: "paren" as const, value: "(", display: "(" },
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "∧", display: "∧" },
      { type: "variable" as const, value: "q", display: "q" },
      { type: "paren" as const, value: ")", display: ")" },
    ],
  },
  {
    formula: "p ∨ ¬p",
    nombre: "Tautología (Ley del tercero excluido)",
    tokens: [
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "∨", display: "∨" },
      { type: "operator" as const, value: "¬", display: "¬" },
      { type: "variable" as const, value: "p", display: "p" },
    ],
  },
  {
    formula: "p ↔ q",
    nombre: "Bicondicional",
    tokens: [
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "↔", display: "↔" },
      { type: "variable" as const, value: "q", display: "q" },
    ],
  },
  {
    formula: "(p → q) ∧ (q → r)",
    nombre: "Silogismo hipotético",
    tokens: [
      { type: "paren" as const, value: "(", display: "(" },
      { type: "variable" as const, value: "p", display: "p" },
      { type: "operator" as const, value: "→", display: "→" },
      { type: "variable" as const, value: "q", display: "q" },
      { type: "paren" as const, value: ")", display: ")" },
      { type: "operator" as const, value: "∧", display: "∧" },
      { type: "paren" as const, value: "(", display: "(" },
      { type: "variable" as const, value: "q", display: "q" },
      { type: "operator" as const, value: "→", display: "→" },
      { type: "variable" as const, value: "r", display: "r" },
      { type: "paren" as const, value: ")", display: ")" },
    ],
  },
];

export function TarjetaEjemplos({ clearAll, setTokens }: TarjetaEjemplosProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ejemplos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2">
          {EJEMPLOS.map((ej) => (
            <Button
              key={ej.formula}
              variant="ghost"
              className="justify-start text-left h-auto py-2"
              onClick={() => {
                clearAll();
                setTokens(ej.tokens);
              }}
            >
              <span className="font-mono">{ej.formula}</span>
              <span className="text-muted-foreground ml-2">— {ej.nombre}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
