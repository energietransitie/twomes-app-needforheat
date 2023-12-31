import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";

const CircleMenu = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { t } = useTranslation();

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  const MenuItem = ({ icon, iconText }: { icon: string; iconText: string }) => {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "grey", padding: 5, borderRadius: 2, marginRight: 5 }}>
          <Text style={{ color: "white", textAlign: "right" }}>{iconText}</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name={icon} size={30} color="white" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showSubMenu && (
        <View style={styles.subMenu}>
          <TouchableOpacity onPress={() => navigation.navigate("QrScannerScreen")}>
            <MenuItem icon="qr-code-outline" iconText={t('screens.device_overview.buttons.install_device')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddOnlineDataSourceScreen")}>
            <MenuItem icon="link-outline" iconText={t('screens.device_overview.buttons.add_enelogic')} />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={toggleSubMenu}
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#45B97C",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showSubMenu ? (
            <Icon name="close-outline" size={50} color="white" />
          ) : (
            <Icon name="add-outline" size={50} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  subMenu: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 10,
  },
  menuItem: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#97D4B5",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default CircleMenu;
