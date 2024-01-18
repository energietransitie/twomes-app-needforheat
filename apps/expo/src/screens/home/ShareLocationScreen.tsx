import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, makeStyles, Text } from "@rneui/themed";
import { Image, TextInput, View } from "react-native";
import Modal from 'react-native-modal';

import Box from "@/components/elements/Box";
import useTranslation from "@/hooks/translation/useTranslation";
import { HomeStackParamList } from "@/types/navigation";
import { useContext, useEffect, useState } from "react";
import { use } from "i18next";
import useGpsLocation from "@/hooks/useGpsLocation";
import { UserContext } from "@/providers/UserProvider";
import React from "react";

export default function ShareLocationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const styles = useStyles();
  const [postcode, setPostcode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [additionHouseNumber, setadditionHouseNumber] = useState('');
  const { setAuthToken, refetch, authorizationToken } = useContext(UserContext);

  const onSubmit = async () => {
    if (authorizationToken) {
      await setAuthToken(authorizationToken);
      await refetch();
      navigation.navigate("HomeScreen");
    }
  };

  return (
    <Box style={styles.container}>
      <Text style={styles.modalSubtitle}>
        For our research, we need your postal code and address number to get details like build year and energy label from the Dutch Kadaster.
        Additionally, please be informed that your approximate location will be stored for the purpose of our research.
      </Text>
      <Box style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter Postcode"
            value={postcode}
            onChangeText={(text) => setPostcode(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter House Number"
            value={houseNumber}
            onChangeText={(text) => setHouseNumber(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter Addition House Number (optional)"
            value={additionHouseNumber}
            onChangeText={(text) => setadditionHouseNumber(text)}
            style={styles.input}
          />
        </View>
      </Box>
      <Button fullWidth style={styles.submitButton} onPress={onSubmit}>
        Submit
      </Button>
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
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
    fontSize: 18,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    width: "100%", // Adjust the width as needed
    textAlign: 'left',
    paddingLeft: 0,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignSelf: "center",
  },
  inputWrapper: {
    width: "90%", // Adjust the width as needed
    alignSelf: "center",
    borderBottomWidth: 0.5,
    marginBottom: theme.spacing.lg, // Add some space between input wrappers
  },
}));
