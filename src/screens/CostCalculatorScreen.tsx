import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { transportAPI } from '../api/endpoints';
import { TransportOption } from '../types';
import { useTheme } from '../theme/ThemeContext';

export default function CostCalculatorScreen() {
  const [distance, setDistance] = useState('');
  const [passengers, setPassengers] = useState('');
  const [parking, setParking] = useState('0');
  const [result, setResult] = useState<TransportOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const bgColor = theme === 'purple' ? 'bg-purple-space-bg' : 'bg-teal-space-bg';
  const primaryColor = theme === 'purple' ? 'bg-purple-space-primary' : 'bg-teal-space-primary';
  const cardColor = theme === 'purple' ? 'bg-purple-space-card' : 'bg-teal-space-card';
  const textColor = theme === 'purple' ? 'text-purple-space-text' : 'text-teal-space-text';
  const accentColor = theme === 'purple' ? 'text-purple-space-accent' : 'text-teal-space-accent';

  const calculateCost = async () => {
    if (!distance || !passengers) {
      setError('Please fill in distance and passengers');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const options = await transportAPI.getCost(
        parseFloat(distance),
        parseInt(passengers),
        parseInt(parking) || 0
      );
      
      const cheapest = options.reduce((min, opt) => 
        opt.cost < min.cost ? opt : min
      );
      
      setResult(cheapest);
    } catch (err) {
      setError('Failed to calculate cost. Please try again.');
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
          Journey Cost Calculator
        </Animated.Text>
        
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>Distance (AUs)</Text>
          <TextInput
            className={`border border-gray-600 rounded-lg px-4 py-3 text-base ${textColor}`}
            placeholder="Enter distance"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={distance}
            onChangeText={setDistance}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>Number of Passengers</Text>
          <TextInput
            className={`border border-gray-600 rounded-lg px-4 py-3 text-base ${textColor}`}
            placeholder="Enter passengers (max 5)"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={passengers}
            onChangeText={setPassengers}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-6`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>Parking Days</Text>
          <TextInput
            className={`border border-gray-600 rounded-lg px-4 py-3 text-base ${textColor}`}
            placeholder="Enter parking days"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={parking}
            onChangeText={setParking}
          />
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
          className={`${primaryColor} py-4 rounded-lg`}
          onPress={calculateCost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">Calculate Cost</Text>
          )}
        </TouchableOpacity>

        {result && (
          <Animated.View
            entering={ZoomIn.springify()}
            className={`mt-6 ${cardColor} p-6 rounded-xl shadow-2xl`}
          >
            <Text className={`${textColor} text-xl font-bold mb-4`}>Cheapest Option</Text>
            <View className="border-t border-gray-700 pt-4">
              <Text className="text-gray-400 text-sm mb-2">Vehicle Type</Text>
              <Text className={`${textColor} text-lg font-semibold mb-4`}>{result.vehicleType}</Text>
              
              <Text className="text-gray-400 text-sm mb-2">Total Cost</Text>
              <Text className={`${accentColor} text-4xl font-bold mb-4`}>
                ${result.cost.toFixed(2)}
              </Text>
              
              <Text className="text-gray-400 text-sm">Capacity: {result.capacity} passengers</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
