import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, makeStyles, Text } from "@rneui/themed";
import { Image, TextInput, View } from "react-native";
import Modal from 'react-native-modal';

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { useEffect, useState } from "react";
import { use } from "i18next";
import useGpsLocation from "@/hooks/useGpsLocation";


export default function UnauthenticatedHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const styles = useStyles();
  const { requestLocationPermissions, showInputs } = useGpsLocation();
  const [postcode, setPostcode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [additionHouseNumber, setadditionHouseNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  function onInvitedPress() {
    navigation.navigate("AlreadyInvitedScreen");
  }

  return (
    <Box padded style={styles.container}>
      <Box>
        <Box style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../../../assets/adaptive-icon.png")} />
          <Text style={styles.title}>{t("screens.home_stack.home.unauthenticated.title")}</Text>
        </Box>
        <Text style={styles.subtitle}>{t("screens.home_stack.home.unauthenticated.subtitle")}</Text>
        <Text style={styles.description}>{t("screens.home_stack.home.unauthenticated.description")}</Text>
      </Box>
      <Button fullWidth onPress={onInvitedPress}>
        {t("screens.home_stack.home.unauthenticated.already_invited")}
      </Button>
    </Box >
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontFamily: "RobotoBold",
    width: "100%",
    textAlign: "center",
    fontSize: 24,
    paddingVertical: theme.spacing.md,
  },
  subtitle: {
    fontSize: 18,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  description: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  modalTitle: {
    fontFamily: "RobotoBold",
    fontSize: 20,
    marginBottom: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row", marginTop: 16, width: "100%", justifyContent: 'center', alignItems: 'center'
  },
  cancelButton: {
    marginRight: 8,
    marginBottom: theme.spacing.md,
    fontSize: 18,
    flex: 1,
  },
  submitButton: {
    marginLeft: 8,
    marginBottom: theme.spacing.md,
    fontSize: 18,
    flex: 1,
  },
}));
