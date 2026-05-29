import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Undo2 } from "lucide-react";
import { Token } from "../truthTableLogic";

interface TarjetaFormulaProps {
  formula: string;
  tokens: Token[];
  error: string;
  removeLastToken: () => void;
  clearAll: () => void;
}

export function TarjetaFormula({
  formula,
  tokens,
  error,
  removeLastToken,
  clearAll,
}: TarjetaFormulaProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Fórmula</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-15 rounded-lg border bg-muted/50 p-4 font-mono text-xl flex items-center">
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
  );
}
