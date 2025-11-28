import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { gatesAPI } from '../api/endpoints';
import { Gate } from '../types';
import { useTheme } from '../theme/ThemeContext';

export default function GateDetailsScreen() {
  const route = useRoute();
  const { gateCode } = route.params as { gateCode: string };
  const [gate, setGate] = useState<Gate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const bgColor = theme === 'purple' ? 'bg-purple-space-bg' : 'bg-teal-space-bg';
  const primaryColor = theme === 'purple' ? 'text-purple-space-primary' : 'text-teal-space-primary';
  const cardColor = theme === 'purple' ? 'bg-purple-space-card' : 'bg-teal-space-card';
  const textColor = theme === 'purple' ? 'text-purple-space-text' : 'text-teal-space-text';

  useEffect(() => {
    fetchGateDetails();
  }, [gateCode]);

  const fetchGateDetails = async () => {
    try {
      setLoading(true);
      const data = await gatesAPI.getDetails(gateCode);
      setGate(data);
      setError(null);
    } catch (err) {
      setError('Failed to load gate details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator size="large" color={theme === 'purple' ? '#8b5cf6' : '#14b8a6'} />
      </View>
    );
  }

  if (error || !gate) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor} px-4`}>
        <Animated.Text entering={FadeInUp} className={`text-base ${textColor} mb-4`}>
          {error}
        </Animated.Text>
        <TouchableOpacity
          onPress={fetchGateDetails}
          className={`${theme === 'purple' ? 'bg-purple-space-primary' : 'bg-teal-space-primary'} px-6 py-3 rounded-lg`}
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className="p-4">
        <Animated.View
          entering={FadeInDown.springify()}
          className={`${cardColor} p-6 rounded-xl shadow-lg mb-4`}
        >
          <Text className={`text-3xl font-bold ${primaryColor} mb-2`}>{gate.gateCode}</Text>
          <Text className={`text-xl ${textColor} mb-1`}>{gate.name}</Text>
          <Text className="text-base text-gray-400">{gate.system}</Text>
        </Animated.View>

        {gate.coordinates && (
          <Animated.View
            entering={SlideInRight.delay(200).springify()}
            className={`${cardColor} p-6 rounded-xl shadow-lg`}
          >
            <Text className={`${textColor} text-lg font-bold mb-4`}>Spatial Coordinates</Text>
            <View>
              <View className="flex-row justify-between py-3 border-b border-gray-700">
                <Text className="text-gray-400 text-base">X Axis</Text>
                <Text className={`${textColor} font-mono text-base font-semibold`}>
                  {gate.coordinates.x.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 border-b border-gray-700">
                <Text className="text-gray-400 text-base">Y Axis</Text>
                <Text className={`${textColor} font-mono text-base font-semibold`}>
                  {gate.coordinates.y.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between py-3">
                <Text className="text-gray-400 text-base">Z Axis</Text>
                <Text className={`${textColor} font-mono text-base font-semibold`}>
                  {gate.coordinates.z.toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
