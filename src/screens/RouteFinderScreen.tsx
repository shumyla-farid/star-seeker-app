import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInDown, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { gatesAPI } from '../api/endpoints';
import { Gate, Route } from '../types';
import { useTheme } from '../theme/ThemeContext';

export default function RouteFinderScreen() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [fromGate, setFromGate] = useState('');
  const [toGate, setToGate] = useState('');
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const bgColor = theme === 'purple' ? 'bg-purple-space-bg' : 'bg-teal-space-bg';
  const primaryColor = theme === 'purple' ? 'bg-purple-space-primary' : 'bg-teal-space-primary';
  const cardColor = theme === 'purple' ? 'bg-purple-space-card' : 'bg-teal-space-card';
  const textColor = theme === 'purple' ? 'text-purple-space-text' : 'text-teal-space-text';
  const accentColor = theme === 'purple' ? 'text-purple-space-accent' : 'text-teal-space-accent';

  useEffect(() => {
    fetchGates();
  }, []);

  const fetchGates = async () => {
    try {
      const data = await gatesAPI.getAll();
      setGates(data);
    } catch (err) {
      console.error('Failed to fetch gates', err);
    }
  };

  const findRoute = async () => {
    if (!fromGate || !toGate) {
      setError('Please select both gates');
      return;
    }

    if (fromGate === toGate) {
      setError('Start and destination must be different');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const routeData = await gatesAPI.getRoute(fromGate, toGate);
      setRoute(routeData);
    } catch (err) {
      setError('Failed to find route');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className="p-4">
        <Animated.Text
          entering={FadeInDown.springify()}
          className={`text-2xl font-bold ${textColor} mb-6`}
        >
          Find Cheapest Route
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>From Gate</Text>
          <View className="border border-gray-600 rounded-lg overflow-hidden">
            <Picker
              selectedValue={fromGate}
              onValueChange={setFromGate}
              style={{ color: theme === 'purple' ? '#e9d5ff' : '#ccfbf1' }}
              dropdownIconColor={theme === 'purple' ? '#8b5cf6' : '#14b8a6'}
            >
              <Picker.Item label="Select start gate" value="" />
              {gates.map(gate => (
                <Picker.Item
                  key={gate.gateCode}
                  label={`${gate.gateCode} - ${gate.name}`}
                  value={gate.gateCode}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-6`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>To Gate</Text>
          <View className="border border-gray-600 rounded-lg overflow-hidden">
            <Picker
              selectedValue={toGate}
              onValueChange={setToGate}
              style={{ color: theme === 'purple' ? '#e9d5ff' : '#ccfbf1' }}
              dropdownIconColor={theme === 'purple' ? '#8b5cf6' : '#14b8a6'}
            >
              <Picker.Item label="Select destination gate" value="" />
              {gates.map(gate => (
                <Picker.Item
                  key={gate.gateCode}
                  label={`${gate.gateCode} - ${gate.name}`}
                  value={gate.gateCode}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        {error && (
          <Animated.View
            entering={ZoomIn}
            className="bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4"
          >
            <Text className="text-red-300 text-center">{error}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          className={`${primaryColor} py-4 rounded-lg mb-6`}
          onPress={findRoute}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">Find Route</Text>
          )}
        </TouchableOpacity>

        {route && (
          <Animated.View
            entering={ZoomIn.springify()}
            className={`${cardColor} p-6 rounded-xl shadow-2xl`}
          >
            <Text className={`${textColor} text-xl font-bold mb-4`}>Route Details</Text>
            
            <View className="mb-6">
              <Text className={`${accentColor} text-4xl font-bold`}>
                ${route.totalCost.toFixed(2)}
              </Text>
              <Text className="text-gray-400 text-sm mt-2">
                Total Distance: {route.totalDistance.toFixed(2)} AUs
              </Text>
            </View>

            <Text className={`${textColor} text-lg font-semibold mb-3`}>Route Segments</Text>
            {route.segments.map((segment, index) => (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(index * 100).springify()}
                className="border-l-4 pl-4 mb-4"
                style={{
                  borderLeftColor: theme === 'purple' ? '#6366f1' : '#0d9488',
                }}
              >
                <Text className={`${textColor} font-mono text-base font-semibold`}>
                  {segment.from} → {segment.to}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {segment.distance.toFixed(2)} AUs • ${segment.cost.toFixed(2)}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
