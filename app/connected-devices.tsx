import React from 'react';
import { useRouter } from 'expo-router';
import ConnectedDevicesScreen from '@/components/ConnectedDevicesScreen';

export default function ConnectedDevicesPage() {
  const router = useRouter();
  return <ConnectedDevicesScreen onBack={() => router.back()} />;
}
