import { UserInfo } from '@/hooks/useUser';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileHeader = ({ profile }: { profile: UserInfo }) => {
    return (
        <View style={styles.profileContainer}>
            <Image
                source={
                    profile.avatar ? { uri: profile.avatar } : require('@assets/user.png')
                }
                style={styles.avatar}
            />
            <View>
                <Text style={styles.name}>{profile.firstname} {profile.lastname}</Text>
                <Text style={styles.email}>{profile.email}</Text>
            </View>
        </View>
    );
};

export default ProfileHeader;

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: '#888',
    }
});

