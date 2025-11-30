// src/lib/icons.ts
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

// Tell NativeWind: when I pass `className`, apply it to `style`
cssInterop(Ionicons, {
  className: "style",
});

// Re-export so you always use the interop’d version
export { Ionicons };
