// components/PieChartBalance.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
// Si quisieras controlar la fuente de forma avanzada, importarías esto:
// import { useFont, Text as SkiaText } from '@shopify/react-native-skia';

interface ChartData extends Record<string, unknown> {
  label: string;
  value: number;
  color: string;
}

interface PieChartBalanceProps {
  income: number;
  expense: number;
  title?: string;
}

export function PieChartBalance({ income, expense, title }: PieChartBalanceProps) {
  const displayIncome = income > 0 ? income : 0.0001;
  const displayExpense = expense > 0 ? expense : 0.0001;

  const chartData: ChartData[] = [
    { label: 'Ingresos', value: displayIncome, color: '#16a34a' },
    { label: 'Gastos', value: displayExpense, color: '#dc2626' },
  ];

  const hasActualData = income > 0 || expense > 0;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {!hasActualData ? (
        <Text style={styles.noDataText}>No hay datos para mostrar el gráfico este mes.</Text>
      ) : (
        <View style={styles.chartWrapper}>
         <PolarChart 
  data={chartData}
  labelKey="label"
  valueKey="value"
  colorKey="color" 
>
  <Pie.Chart >
        {({ slice }) => (
          <Pie.Slice
            key={slice.label}
          >
            <Pie.Label
              text={`${slice.label}\n$${slice.value.toFixed(2)}`}
              color="black"
              radiusOffset={20}
            />
          </Pie.Slice>
        )}
      </Pie.Chart>
    </PolarChart>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  chartWrapper: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'green'
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});