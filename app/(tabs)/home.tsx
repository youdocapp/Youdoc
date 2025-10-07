import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import DashboardScreen from '../../components/DashboardScreen';
import BottomNav from '../../components/ui/BottomNav';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DashboardScreen
        onSymptomChecker={() => router.push('/symptom-checker')}
        onMyMedication={() => router.push('/my-medication')}
        onSeeDoctor={() => router.push('/see-doctor')}
        onHealthArticles={() => router.push('/health-articles')}
        onSettings={() => router.push('/settings')}
        onMedicalGrocery={() => router.push('/medical-grocery')}
      />
      <BottomNav
        activeTab="home"
        onHome={() => router.push('/(tabs)/home')}
        onNotifications={() => router.push('/notifications')}
        onProfile={() => router.push('/profile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
