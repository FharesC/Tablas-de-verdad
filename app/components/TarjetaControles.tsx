import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token, variables, operators, parentheses } from "../truthTableLogic";

interface TarjetaControlesProps {
  addToken: (type: Token["type"], value: string, display: string) => void;
}

export function TarjetaControles({ addToken }: TarjetaControlesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
       <Card> {/*tarjeta para variables */}
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

      <Card> {/*tarjeta para operadores */}
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

      <Card> {/*tarjeta para parentesis */}
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
  );
}
