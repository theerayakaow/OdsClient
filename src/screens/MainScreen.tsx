import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAuthContext } from '@/context/AuthContext';
import useUser, { Transaction, UserInfo } from '@/hooks/useUser';
import ProfileHeader from '@/components/ProfileHeader';
import { formatNumber } from '@/utils/helper';
import { useFocusEffect } from '@react-navigation/native';

const MainScreen = () => {
    const { logout } = useAuthContext();
    const { getProfile, getTrans } = useUser();
    const [profile, setProfile] = useState<UserInfo | null>(null);
    const [trans, setTrans] = useState<Transaction[]>([]);
    const [balanceAmount, setBalanceAmount] = useState<number>(0);

    const fetchProfile = async () => {
        const res = await getProfile();
        if (res.isSuccess) {
            if (res.data) {
                setProfile(res.data.user);
            }
        } else {
            await logout();
            Toast.show({
                type: 'error',
                text1: 'Invalid User',
                text2: res.error || 'Something went wrong, Please login again',
            });
        }
    };

    const fetchTrans = async () => {
        const res = await getTrans();
        if (res.isSuccess) {
            if (res.data) {
                setTrans(res.data.trans.transactions);
                setBalanceAmount(res.data.trans.available)
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: res.error || 'Something went wrong.',
            });
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
            fetchTrans();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            {profile && <ProfileHeader profile={profile} />}

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>฿{formatNumber(balanceAmount)}</Text>
            </View>

            <Text style={styles.historyTitle}>Transaction History</Text>
            {trans?.length > 0 ? (
                <ScrollView style={styles.historyList}>
                    {trans.map((tx, index) => (
                        <View key={index} style={styles.transactionItem}>
                            <View>
                                <Text style={styles.txType}>{tx.formattedDate}</Text>
                                <Text style={styles.txDate}>COMPLETED</Text>
                            </View>
                            <Text style={[
                                styles.txAmount,
                            ]}>
                                {`฿${formatNumber(tx.amount)}`}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No transactions yet.</Text>
                </View>
            )}


        </SafeAreaView>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    balanceContainer: {
        margin: 16,
        backgroundColor: '#223D80',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    balanceLabel: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 6,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    historyTitle: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    historyList: {
        marginTop: 8,
        paddingHorizontal: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    txType: {
        fontSize: 15,
        fontWeight: '500',
    },
    txDate: {
        fontSize: 12,
        color: '#999',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        marginTop: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
});
