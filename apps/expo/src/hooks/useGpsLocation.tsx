import React, { useEffect, useState } from 'react';
import { Text, Button, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import h3 from 'h3-js';
import moment from 'moment-timezone';

type Location = {
    lat: number;
    lng: number;
};

// Convert from callback syntax to Promise syntax
const getCurrentPosition = (options: Geolocation.GeoOptions) => new Promise(
    (resolve, reject) => Geolocation.getCurrentPosition(resolve, reject, options)
);

const useGpsLocation = () => {
    const [gpsLocation, setGpsLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showInputs, setShowInputs] = useState(false);
    const [timeZone, setTimeZone] = useState('' as string);
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    const getTimeZone = () => {
        return moment.tz.guess();
    };

    const getLocation = async () => {
        try {
            const position = await getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 20000
            }) as Geolocation.GeoPosition;

            const { latitude, longitude } = position.coords;
            const latLngToCell = h3.latLngToCell(latitude, longitude, 6);
            const [lat, lng] = h3.cellToLatLng(latLngToCell);
            const gpsLocation = { lat, lng };
            const timeZone = getTimeZone();

            setShowInputs(true);
            setTimeZone(timeZone);
            setGpsLocation(gpsLocation);

            return { gpsLocation, timeZone };
        } catch (error: any) {
            console.log("The location could not be loaded because ", error.message);
            return { gpsLocation: null, timeZone: '' };
        }
    };

    const requestLocationPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Allow Location',
                    message:
                        'Do you accept that you are sharing your location ' +
                        'We dont use your specific location',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return getLocation();
            } else {
                setError('Location permission denied');
                return { gpsLocation: null, timeZone: '' };
            }
        } catch (err) {
            console.warn(err);
            return { gpsLocation: null, timeZone: '' };
        }
    };
    return { gpsLocation, error, showInputs, requestLocationPermissions, getLocation, timeZone, permissionsGranted };
};

export default useGpsLocation;

