import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "../truthTableLogic";

interface ExamplesCardProps {
  clearAll: () => void;
  setTokens: (tokens: Token[]) => void;
}

export function ExamplesCard({ clearAll, setTokens }: ExamplesCardProps) {
  return (
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
              clearAll();
              setTokens([
                { type: "variable", value: "p", display: "p" },
                { type: "operator", value: "∧", display: "∧" },
                { type: "variable", value: "q", display: "q" },
              ]);
            }}
          >
            <span className="font-mono">p ∧ q</span>
            <span className="text-muted-foreground ml-2">— Conjunción</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-auto py-2"
            onClick={() => {
              clearAll();
              setTokens([
                { type: "variable", value: "p", display: "p" },
                { type: "operator", value: "→", display: "→" },
                { type: "variable", value: "q", display: "q" },
              ]);
            }}
          >
            <span className="font-mono">p → q</span>
            <span className="text-muted-foreground ml-2">
              — Implicación
            </span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-auto py-2"
            onClick={() => {
              clearAll();
              setTokens([
                { type: "operator", value: "¬", display: "¬" },
                { type: "paren", value: "(", display: "(" },
                { type: "variable", value: "p", display: "p" },
                { type: "operator", value: "∧", display: "∧" },
                { type: "variable", value: "q", display: "q" },
                { type: "paren", value: ")", display: ")" },
              ]);
            }}
          >
            <span className="font-mono">¬(p ∧ q)</span>
            <span className="text-muted-foreground ml-2">
              — Negación de conjunción
            </span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-auto py-2"
            onClick={() => {
              clearAll();
              setTokens([
                { type: "variable", value: "p", display: "p" },
                { type: "operator", value: "∨", display: "∨" },
                { type: "operator", value: "¬", display: "¬" },
                { type: "variable", value: "p", display: "p" },
              ]);
            }}
          >
            <span className="font-mono">p ∨ ¬p</span>
            <span className="text-muted-foreground ml-2">
              — Tautología (Ley del tercero excluido)
            </span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-auto py-2"
            onClick={() => {
              clearAll();
              setTokens([
                { type: "variable", value: "p", display: "p" },
                { type: "operator", value: "↔", display: "↔" },
                { type: "variable", value: "q", display: "q" },
              ]);
            }}
          >
            <span className="font-mono">p ↔ q</span>
            <span className="text-muted-foreground ml-2">
              — Bicondicional
            </span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left h-auto py-2"
            onClick={() => {
              clearAll();
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
              ]);
            }}
          >
            <span className="font-mono">(p → q) ∧ (q → r)</span>
            <span className="text-muted-foreground ml-2">
              — Silogismo hipotético
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
