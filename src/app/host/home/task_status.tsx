import { AcceptedInvitationScreen } from '@/components/host/task_status/AcceptedInvitationScreen';
import { AlertScreen } from '@/components/host/task_status/AlertScreen';
import { ChecklistScreen } from '@/components/host/task_status/ChecklistScreen';
import { CleanerDenyScreen } from '@/components/host/task_status/CleanerDenyScreen';
import SectionTitle from '@/components/shared/SectionTitle';
import { Colors } from '@/constants/theme';
import { TODO_TASKS, TaskStatus } from '@/data/hostFakeData';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../../utils/responsiveDevice';

const TITLE_MAP: Record<TaskStatus, string> = {
    refused:        'Cleaner Deny',
    completed:      'Checklist Header',
    report_problem: 'Alert',
    pending_accept: 'Accepted invitation',
    scheduled:      'Scheduled',
};

export default function TaskStatusScreen() {
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const task = TODO_TASKS.find((t) => t.id === taskId);
    const status = task?.status ?? 'scheduled';
    const title = TITLE_MAP[status];

    const renderContent = () => {
        switch (status) {
            case 'refused':        return <CleanerDenyScreen />;
            case 'completed':      return <ChecklistScreen />;
            case 'report_problem': return <AlertScreen />;
            case 'pending_accept': return <AcceptedInvitationScreen />;
            default:               return null;
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={title} />
            <View style={styles.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    content: { flex: 1 },
});