"use client";

import { Calculator } from "lucide-react";
import { useTruthTable } from "./useTruthTable";
import { FormulaCard } from "./components/FormulaCard";
import { ControlsCard } from "./components/ControlsCard";
import { ResultTable } from "./components/ResultTable";
import { ExamplesCard } from "./components/ExamplesCard";

export default function TruthTableGenerator() {
  const tableState = useTruthTable();

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

        <FormulaCard 
          formula={tableState.formula}
          tokens={tableState.tokens}
          error={tableState.error}
          removeLastToken={tableState.removeLastToken}
          clearAll={tableState.clearAll}
        />

        <ControlsCard addToken={tableState.addToken} />

        <ResultTable 
          tokens={tableState.tokens}
          usedVariables={tableState.usedVariables}
          formula={tableState.formula}
          truthTable={tableState.truthTable}
          isValidFormula={tableState.isValidFormula}
          tableAnalysis={tableState.tableAnalysis}
        />

        <ExamplesCard 
          clearAll={tableState.clearAll}
          setTokens={tableState.setTokens}
        />
      </div>
    </div>
  );
}
