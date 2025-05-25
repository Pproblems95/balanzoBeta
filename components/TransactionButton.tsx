import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

type Props = {
    text: string;
    onPress: () => void;
    className? : string;
};

const TransactionButton = ({text, onPress, className}: Props) => {
    return(
        <TouchableOpacity className={`bg-green-700 rounded-3xl ${className}`} onPress={onPress}>
            <View className='justify-center'>
                <Text className={`text-white text-2xl px-5 py-2 text-center `}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default TransactionButton;