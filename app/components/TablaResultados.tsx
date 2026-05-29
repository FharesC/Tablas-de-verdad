import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Token } from "../truthTableLogic";

interface TablaResultadosProps {
  tokens: Token[];
  usedVariables: string[];
  formula: string;
  truthTable: { values: Record<string, boolean>; result: boolean | null }[] | null;
  isValidFormula: boolean;
  tableAnalysis: { type: string; message: string } | null;
}

const BADGE_COLORS: Record<string, string> = {
  tautology: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  contradiction: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  contingent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const RESULT_COLORS: Record<string, string> = {
  true: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  false: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  null: "text-yellow-600 dark:text-yellow-400",
};

export function TablaResultados({
  tokens,
  usedVariables,
  formula,
  truthTable,
  isValidFormula,
  tableAnalysis,
}: TablaResultadosProps) {
  if (tokens.length === 0 || usedVariables.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Tabla de Verdad</span>
          {tableAnalysis && (
            <span
              className={`text-sm font-normal px-3 py-1 rounded-full ${
                BADGE_COLORS[tableAnalysis.type] ||
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
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
                {truthTable?.map((row, index) => {
                  const key =
                    row.result === null ? "null" : row.result ? "true" : "false";
                  return (
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
                        className={`text-center font-mono text-base font-bold border-l-2 ${RESULT_COLORS[key]}`}
                      >
                        {row.result === null ? "?" : row.result ? "V" : "F"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
