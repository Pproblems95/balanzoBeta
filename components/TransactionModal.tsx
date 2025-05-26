// components/TransactionModal.tsx
import { Modal, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, amount: number) => void;
  type: 'income' | 'expense';
}

export function TransactionModal({ visible, onClose, onSubmit, type }: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!title || !amount || isNaN(parseFloat(amount))) {
        alert('Por favor ingresa un título y un monto válido');
        return;
}
    onSubmit(title, parseFloat(amount));
    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 p-6 rounded-xl">
          <Text className="text-xl font-bold mb-4">
            Nuevo {type === 'income' ? 'Ingreso' : 'Gasto'}
          </Text>
          <TextInput
            className="border mb-3 p-2 rounded"
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            className="border mb-3 p-2 rounded"
            placeholder="Monto"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
         <TouchableOpacity
            className="bg-green-700 py-3 px-5 rounded-lg mb-2"
            onPress={handleSave}
            >
                <Text className="text-white text-center text-base font-semibold">Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
            className="bg-gray-500 py-3 px-5 rounded-lg"
            onPress={onClose}
            >
                <Text className="text-white text-center text-base font-semibold">Cancelar</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
