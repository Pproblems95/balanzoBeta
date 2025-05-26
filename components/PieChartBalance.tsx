// components/PieChartBalance.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PolarChart, Pie } from 'victory-native';

interface SimplePieDataItem {
  x: string;
  y: number;
  color: string;
  [key: string]: unknown;
}

const PIE_TEST_DATA: SimplePieDataItem[] = [
  { x: "Manzanas", y: 30, color: "#ff6384" },
  { x: "Naranjas", y: 20, color: "#36a2eb" },
  { x: "Peras", y: 15, color: "#ffce56" },
  { x: "Uvas", y: 35, color: "#4bc0c0" },
];

interface PieChartBalanceProps {
  income: number;
  expense: number;
  title?: string;
}

export function PieChartBalance({ income, expense, title }: PieChartBalanceProps) {
    const chartData = PIE_TEST_DATA; // Usamos los datos de prueba que sabemos que funcionan

    console.log("PieChartBalance - Datos de PRUEBA (que funcionaron en home.tsx):", chartData);

    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        
        {/* Aquí usamos el estilo `chartWrapper` para el contenedor del gráfico */}
        <View style={styles.chartWrapper}>
          <PolarChart<SimplePieDataItem, "x", "y", "color">
            data={chartData}
            labelKey="x"
            valueKey="y"
            colorKey="color"
          >
            {/* El tamaño del Pie.Chart debe ser igual o menor que el contenedor */}
            <Pie.Chart innerRadius={0} size={300} />
          </PolarChart>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centra horizontalmente el contenido de este contenedor (incluyendo el título y chartWrapper)
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
    height: 300, // Altura fija para el contenedor
    width: 300,  // Ancho fijo para el contenedor
    justifyContent: 'center', // **Centra verticalmente** los elementos hijos (PolarChart)
    alignItems: 'center',     // **Centra horizontalmente** los elementos hijos (PolarChart)
    borderWidth: 1,
    borderColor: 'purple',
    // Si quieres el margen de 20px, puedes agregarlo aquí:
    // margin: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});