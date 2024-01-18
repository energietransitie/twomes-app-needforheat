import { NavigationProp, useNavigation } from "@react-navigation/native";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import * as Burnt from "burnt";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { URL, URLSearchParams } from "react-native-url-polyfill";

import { setAuthToken } from "@/constants";
import useActivateAccount from "@/hooks/account/useActivateAccount";
import useTranslation from "@/hooks/translation/useTranslation";
import useDynamicLinks from "@/hooks/useDynamicLinks";
import useUser from "@/hooks/user/useUser";
import { Maybe } from "@/types";
import { AccountResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import useGpsLocation from "@/hooks/useGpsLocation";

type UserContextProps = {
  user: Maybe<AccountResponse>;
  isAuthed: boolean;
  isLoading: boolean;
  authorizationToken: string | null; // Add authorizationToken to context
  setAuthToken: (token: string) => Promise<void>;
  refetch: <T>(
    options?: (RefetchOptions & RefetchQueryFilters<T>) | undefined
  ) => Promise<QueryObserverResult<Maybe<AccountResponse>>>;
};

export const UserContext = createContext<UserContextProps>({
  user: null,
  isAuthed: false,
  isLoading: true,
  authorizationToken: null, // Initialize with null
  setAuthToken: async (_token: string) => { },
  async refetch<T>(_options?: (RefetchOptions & RefetchQueryFilters<T>) | undefined) {
    return {} as QueryObserverResult<Maybe<AccountResponse>>;
  },
});

export default function UserProvider({ children }: PropsWithChildren<unknown>) {
  const { user, isAuthed, isLoading, refetch } = useUser();
  const { mutateAsync: activateAccount } = useActivateAccount();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { requestLocationPermissions } = useGpsLocation();
  const [authorizationToken, setAuthorizationToken] = useState<string | null>(null); // Initialize with null


  let latitude: number = 0;
  let longtitude: number = 0;
  let tz_name: string = "";

  useDynamicLinks(async link => {
    try {
      const url = new URL(link.url);
      const urlParams = new URLSearchParams(url.search);
      const accountToken = urlParams.get("prod_token") || urlParams.get("test_token");

      if (!accountToken) {
        throw new Error();
      }

      const locationResult = await requestLocationPermissions();

      if (locationResult && locationResult.gpsLocation && locationResult.timeZone) {
        const { gpsLocation, timeZone } = locationResult;
        latitude = gpsLocation.lat;
        longtitude = gpsLocation.lng;
        tz_name = timeZone;
      }

      Burnt.alert({
        title: t("providers.user_provider.activate.title"),
        message: t("providers.user_provider.activate.message"),
        preset: "spinner",
        duration: 10,
      });

      const { authorization_token } = await activateAccount({ accountToken, latitude, longtitude, tz_name });

      // Burnt.dismissAllAlerts();
      // Burnt.alert({
      //   title: t("providers.user_provider.activate_success.title"),
      //   message: t("providers.user_provider.activate_success.message"),
      //   preset: "done",
      // });

      setAuthorizationToken(authorization_token);

      navigation.navigate("ShareLocationScreen");

      // }
    } catch (err) {
      Burnt.dismissAllAlerts();

      const alertData = {
        title: t("providers.user_provider.activate_error.title"),
        message: `${t("providers.user_provider.activate_error.message")}${err ? `\n\n${err}` : ""}`,
      };

      if (Platform.OS === "android") {
        Alert.alert(alertData.title, alertData.message);
      } else {
        Burnt.alert({
          title: alertData.title,
          message: alertData.message,
          preset: "error",
          duration: 4,
        });
      }
    }
  });

  return <UserContext.Provider value={{ user, isAuthed, isLoading, refetch, setAuthToken, authorizationToken }}>{children}</UserContext.Provider>;
}
