import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Activity, Footprints, Flame, Moon, Watch } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useHealthTracker } from '@/contexts/HealthTrackerContext';
import { Card } from './Card';
import { Button } from './Button';
import { router } from 'expo-router';

export const HealthTrackerWidget: React.FC = () => {
  const { colors } = useTheme();
  const { healthData } = useHealthTracker();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    viewAll: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    emptyCard: {
      alignItems: 'center',
      padding: 24,
      gap: 16,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        lineHeight: 20
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    metricCard: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        gap: 12
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text
    },
    metricLabel: {
        fontSize: 12,
        color: colors.textSecondary
    }
  });

  if (!healthData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Health Tracker</Text>
        </View>
        <Card style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
                <Activity size={32} color={colors.textSecondary} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Connect Health Device</Text>
            <Text style={styles.emptyText}>
                Connect Google Fit or Apple Health to track your stats.
            </Text>
            <Button 
                label="Connect Device" 
                onPress={() => router.push('/connected-devices')}
                size="sm"
            />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.header}>
            <Text style={styles.title}>Health Tracker</Text>
            <TouchableOpacity onPress={() => router.push('/connected-devices')}>
                <Text style={styles.viewAll}>View Details</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.grid}>
            {/* Heart Rate */}
            <Card style={[styles.metricCard, { backgroundColor: '#FEF2F2' }]}>
                <View style={styles.metricHeader}>
                    <Heart size={20} color="#EF4444" fill="#EF4444" />
                    <Text style={[styles.metricLabel, { color: '#EF4444' }]}>Heart Rate</Text>
                </View>
                <Text style={[styles.metricValue, { color: '#111827' }]}>
                    {healthData.heartRate || '--'} <Text style={{ fontSize: 14, fontWeight: '400' }}>bpm</Text>
                </Text>
            </Card>

            {/* Steps */}
            <Card style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}>
                <View style={styles.metricHeader}>
                    <Footprints size={20} color="#3B82F6" />
                    <Text style={[styles.metricLabel, { color: '#3B82F6' }]}>Steps</Text>
                </View>
                <Text style={[styles.metricValue, { color: '#111827' }]}>
                    {healthData.steps || '--'}
                </Text>
            </Card>
            
            {/* Calories */}
            <Card style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
                <View style={styles.metricHeader}>
                    <Flame size={20} color="#F97316" />
                    <Text style={[styles.metricLabel, { color: '#F97316' }]}>Calories</Text>
                </View>
                 <Text style={[styles.metricValue, { color: '#111827' }]}>
                    {healthData.calories || '--'} <Text style={{ fontSize: 14, fontWeight: '400' }}>kcal</Text>
                </Text>
            </Card>

             {/* Sleep */}
             <Card style={[styles.metricCard, { backgroundColor: '#F5F3FF' }]}>
                <View style={styles.metricHeader}>
                    <Moon size={20} color="#8B5CF6" />
                    <Text style={[styles.metricLabel, { color: '#8B5CF6' }]}>Sleep</Text>
                </View>
                 <Text style={[styles.metricValue, { color: '#111827' }]}>
                    {healthData.sleep || '--'} <Text style={{ fontSize: 14, fontWeight: '400' }}>hrs</Text>
                </Text>
            </Card>
        </View>
    </View>
  );
};
