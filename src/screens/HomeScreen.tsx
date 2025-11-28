import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { gatesAPI } from '../api/endpoints';
import { Gate } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const bgColor = theme === 'purple' ? 'bg-purple-space-bg' : 'bg-teal-space-bg';
  const primaryColor = theme === 'purple' ? 'text-purple-space-primary' : 'text-teal-space-primary';
  const cardColor = theme === 'purple' ? 'bg-purple-space-card' : 'bg-teal-space-card';
  const textColor = theme === 'purple' ? 'text-purple-space-text' : 'text-teal-space-text';

  useEffect(() => {
    fetchGates();
  }, []);

  const fetchGates = async () => {
    try {
      setLoading(true);
      const data = await gatesAPI.getAll();
      setGates(data);
      setError(null);
    } catch (err) {
      setError('Failed to load gates. Pull to retry.');
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

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor} px-4`}>
        <Animated.Text entering={FadeInUp} className={`text-base ${textColor} mb-4 text-center`}>
          {error}
        </Animated.Text>
        <AnimatedTouchable
          entering={FadeInDown}
          onPress={fetchGates}
          className={`${theme === 'purple' ? 'bg-purple-space-primary' : 'bg-teal-space-primary'} px-6 py-3 rounded-lg`}
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </AnimatedTouchable>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${bgColor}`}>
      <View className="pt-4 px-4 pb-2">
        <ThemeToggle />
      </View>
      <FlatList
        data={gates}
        keyExtractor={(item) => item.gateCode}
        onRefresh={fetchGates}
        refreshing={loading}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => (
          <AnimatedTouchable
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
            onPress={() => navigation.navigate('GateDetails', { gateCode: item.gateCode })}
            className={`${cardColor} mx-4 my-2 p-4 rounded-lg shadow-lg`}
          >
            <Text className={`text-lg font-bold ${primaryColor}`}>{item.gateCode}</Text>
            <Text className={`text-base mt-1 ${textColor}`}>{item.name}</Text>
            <Text className="text-sm mt-0.5 text-gray-400">{item.system}</Text>
          </AnimatedTouchable>
        )}
      />
    </View>
  );
}
