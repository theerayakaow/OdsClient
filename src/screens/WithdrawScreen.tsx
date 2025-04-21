import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Toast from 'react-native-toast-message';
import useUser from '@/hooks/useUser';
import { formatNumber, formatWithComma, MAX_WITHDRAW } from '@/utils/helper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Decimal from 'decimal.js';
import { navigate } from '@/navigation/navigationService';
import { useFocusEffect } from '@react-navigation/native';


const WithdrawScreen = () => {
    const { withdraw, getTrans } = useUser();
    const [available, setAvailable] = useState<number>(0);
    const [amount, setAmount] = useState('');
    const [formattedAmount, setFormattedAmount] = useState('');

    useFocusEffect(
        useCallback(() => {
            const loadAvailable = async () => {
                const res = await getTrans();
                if (res.isSuccess && res.data) {
                    setAvailable(res.data.trans.available);
                }
            };

            loadAvailable();
        }, [])
    );

    const handleWithdraw = async () => {
        const amt = parseFloat(amount);

        if (isNaN(amt) || amt <= 0) {
            Toast.show({ type: 'error', text1: 'Invalid amount' });
            return;
        }

        const res = await withdraw(amt);
        if (res.isSuccess) {
            Toast.show({ type: 'success', text1: res.data?.message });
            setAmount('');
            setFormattedAmount('');

            navigate('MainAppTabs', {
                screen: 'MainScreen'
            });

        } else {
            Toast.show({ type: 'error', text1: 'Withdrawal failed', text2: res.error });
        }
    };

    const handleChange = (text: string) => {

        let input = text.replace(/,/g, '').replace(/[^0-9.]/g, '');

        if (input === '') {
            setAmount('');
            setFormattedAmount('');
            return;
        }

        if (input === '.' || input === '0.' || /^0\.\d{0,2}$/.test(input)) {
            setAmount(input);
            setFormattedAmount(input);
            return;
        }

        if ((input.match(/\./g) || []).length > 1) return;

        const parts = input.split('.');
        if (parts[1]?.length > 2) return;

        if (parts[0].length > 1 && parts[0].startsWith('0')) {
            parts[0] = parts[0].replace(/^0+/, '') || '0';
            input = parts.join('.');
        }

        try {
            const value = new Decimal(input);

            if (value.gt(MAX_WITHDRAW)) {
                input = MAX_WITHDRAW.toFixed(2);
                setAmount(input);
                setFormattedAmount(formatWithComma(input));
            } else {

                setAmount(input);
                setFormattedAmount(formatWithComma(input, parts[1]?.length ?? 0));
            }
        } catch {

            setAmount(input);
            setFormattedAmount(input);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.title}>Withdraw Money</Text>
                <Text style={styles.available}>Available: ฿{formatNumber(available)}</Text>
                <Text style={styles.sub}>You can withdraw up to ฿{formatNumber(available / 2)}</Text>

                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                    value={formattedAmount}
                    onChangeText={handleChange}
                    textAlign="right"
                />

                <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
                    <Text style={styles.buttonText}>Withdraw</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    available: {
        fontSize: 18,
        fontWeight: '500',
    },
    sub: {
        fontSize: 14,
        color: '#888',
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        fontSize: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


