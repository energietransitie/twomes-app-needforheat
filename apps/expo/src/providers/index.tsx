import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { LayoutChangeEvent } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UserProvider from "./UserProvider";

import { theme } from "@/lib/theme";

type ProviderProps = {
  children: ReactNode;
  onLayout: (event: LayoutChangeEvent) => void;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    },
  },
});

export default function Providers(props: ProviderProps) {
  return (
    <SafeAreaProvider onLayout={props.onLayout}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <BottomSheetModalProvider>
                <UserProvider>{props.children}</UserProvider>
              </BottomSheetModalProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
