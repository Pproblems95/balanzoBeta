import { View, Text } from 'react-native';
import { VictoryPie } from 'victory'; // Importa desde 'victory'
import Svg from 'react-native-svg'; // <-- ¡Importa Svg aquí!

interface Props {
    income: number;
    expense: number;
    title?: string;
}

export function PieChartBalance({ income, expense, title }: Props){
    const data = [
        {x: 'Ingresos', y: income},
        {x: 'Gastos', y: expense}
    ];

    const colors = ['#16a34a', '#dc2626'];

    return(
        <View className="items-center my-4">
            {title && <Text className="text-lg font-bold mb-2">{title}</Text>}
            {/* Envuelve VictoryPie con Svg aquí */}
            <Svg width={300} height={300}> {/* Define el tamaño del lienzo SVG */}
                <VictoryPie
                    data={data}
                    colorScale={colors}
                    innerRadius={50}
                    labelRadius={75}
                    labels={({ datum }) => `${datum.x}\n$${datum.y}`}
                    style={{
                        labels: { fill: 'black', fontSize: 14, fontWeight: 'bold' },
                    }}
                    // Opcional: puedes quitar width y height de VictoryPie, ya que el Svg define el espacio.
                    // width={300}
                    // height={300}
                />
            </Svg>
        </View>
    )
}