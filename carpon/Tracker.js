import { Tracker } from '@react-native-karte/core'

export const viewPage = (screen, title) => {
    Tracker.view(screen, title);
};

export const identifyUser = userData => {
    Tracker.identify(userData)
};

export const addTrackerEvent = (eventName, data) => {
    Tracker.track(eventName, data)
};
