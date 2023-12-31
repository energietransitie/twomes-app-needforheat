import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, ListItem, makeStyles, useTheme } from "@rneui/themed";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { enUS, nl } from 'date-fns/locale';
import { format } from 'date-fns';

import { MANUAL_URL } from "@/constants";
import useTranslation from "@/hooks/translation/useTranslation";
import { useOpenExternalLink } from "@/hooks/useOpenExternalLink";
import { BuildingDeviceResponse } from "@/types/api";
import { HomeStackParamList } from "@/types/navigation";
import { useEffect, useState } from "react";

type WifiNetworkListItemProps = {
  item: BuildingDeviceResponse;
  onSwipeBegin?: () => void;
  onSwipeEnd?: () => void;
};

export default function DeviceListItem(props: WifiNetworkListItemProps) {
  const { item, onSwipeBegin, onSwipeEnd } = props;
  const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
  const { openUrl } = useOpenExternalLink();
  const { theme } = useTheme();
  const style = useStyles();
  const { t, resolvedLanguage } = useTranslation();
  const [data, setData] = useState(null); // Initialize data state variable
  const CompleteURL = MANUAL_URL + item.device_type.name;
  const onReset = (close: () => void) => {
    navigate("QrScannerScreen", { expectedDeviceName: item.name });
    close();
  };

  // false so it won't open the pop-up but it will open the URL
  const openHelpUrl = () => openUrl(item.device_type.info_url, false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${CompleteURL}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const locales: Record<string, Locale> = {
    'en-US': enUS,
    'nl-NL': nl,
  };

  function formatDateAndTime(date?: Date) {
    const inputDate = date || new Date();
    const locale = locales[resolvedLanguage] || enUS;

    let formatString = 'cccccc, LLL d, yyy HH:mm';

    if (resolvedLanguage === 'nl-NL') {
      formatString = 'cccccc d LLL yyy HH:mm';
    }

    return format(inputDate, formatString, { locale });
  }

  function capitalizeFirstLetter(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  }

  return (
    <ListItem.Swipeable
      onSwipeBegin={onSwipeBegin}
      onSwipeEnd={onSwipeEnd}
      leftWidth={0}
      rightContent={close => (
        <Button
          title={t("screens.device_overview.device_list.reset_device")}
          onPress={() => onReset(close)}
          buttonStyle={{ minHeight: "100%", backgroundColor: theme.colors.primary }}
        />
      )}
      style={style.listItem}
      Component={TouchableHighlight}
    >
      <ListItem.Content>
        <ListItem.Title>
          {item.latest_upload ? (
            <Icon name="cloud-outline" color="green" size={16} />
          ) : (
            <Icon name="cloud-offline-outline" color="red" size={16} />
          )}
          {resolvedLanguage === "nl-NL"
            ? data?.["nl-NL"] ? capitalizeFirstLetter(data["nl-NL"]) : ""
            : data?.["en-US"] ? capitalizeFirstLetter(data["en-US"]) : ""}
        </ListItem.Title>
        <ListItem.Subtitle>
          {item.latest_upload
            ? t("screens.device_overview.device_list.device_info.last_seen", {
              date: formatDateAndTime(item.latest_upload),
            })
            : t("screens.device_overview.device_list.device_info.no_data")}
        </ListItem.Subtitle>
      </ListItem.Content>
      <TouchableOpacity onPress={openHelpUrl}>
        <Icon name="help-circle-outline" color="black" size={32} />
      </TouchableOpacity>
    </ListItem.Swipeable>
  );
}

const useStyles = makeStyles(theme => ({
  listItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
