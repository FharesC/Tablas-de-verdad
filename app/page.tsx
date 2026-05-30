"use client";

import { Calculator } from "lucide-react";
import { useTablaVerdad } from "./useTablaVerdad";
import { TarjetaFormula } from "./components/TarjetaFormula";
import { TarjetaControles } from "./components/TarjetaControles";
import { TablaResultados } from "./components/TablaResultados";
import { TarjetaEjemplos } from "./components/TarjetaEjemplos";

export default function TruthTableGenerator() {
  const tableState = useTablaVerdad();

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

        <TarjetaFormula 
          formula={tableState.formula}
          tokens={tableState.tokens}
          error={tableState.error}
          removeLastToken={tableState.removeLastToken}
          clearAll={tableState.clearAll}
        />

        <TarjetaControles addToken={tableState.addToken} />

        <TablaResultados 
          tokens={tableState.tokens}
          usedVariables={tableState.usedVariables}
          formula={tableState.formula}
          truthTable={tableState.truthTable}
          isValidFormula={tableState.isValidFormula}
          tableAnalysis={tableState.tableAnalysis}
        />

        <TarjetaEjemplos 
          clearAll={tableState.clearAll}
          setTokens={tableState.setTokens}
        />
      </div>
    </div>
  );
}
