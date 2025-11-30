import AsyncStorage from "@react-native-async-storage/async-storage";

export async function logAllAsyncStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const entries = await AsyncStorage.multiGet(keys);

  console.log("ASYNC STORAGE CONTENTS:");
  for (const [key, value] of entries) {
    console.log(`KEY: ${key}`);
    console.log(`VALUE:`, value);
    console.log("------------");
  }
}

export async function clearAllAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared!");
  } catch (e) {
    console.error("Error clearing AsyncStorage:", e);
  }
}
