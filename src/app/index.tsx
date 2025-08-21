import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Welcome to Chat Note</Text>
      <Text className="mt-2 text-gray-600">Your React Native app is ready!</Text>
    </View>
  );
}