import React, { Component } from "react";
import { Platform } from 'react-native';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";
import Logger from '../../logger';

export default class PushController extends Component {
    constructor() {
        super();
        this.notificationListner = null;
        this.refreshTokenListener = null;
    }

    componentDidMount() {
        FCM.requestPermissions();

        FCM.getFCMToken().then(token => {
            Logger.debug("TOKEN (getFCMToken)", token);
            this.props.onChangeToken(token);
        });

        FCM.getInitialNotification().then(notif => {
            if (notif.game) {
                // dunno
            }
        });

        this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
            Logger.debug("Notification", notif);
            if (notif.local_notification) {
                if (notif.opened_from_tray && notif.game) {
                    Logger.debug("has game");
                    this.props.goToGame(notif.game);
                }
                return;
            }

            if (notif.opened_from_tray) {
                Logger.debug("opened from tray");
                if (notif.game) {
                    Logger.debug("has game");
                    this.props.goToGame(notif.game);
                }
                return;
            }

            if (!notif.game || notif.game !== this.props.game) {
                Logger.debug('display local notif:', notif);
                this.showLocalNotification(notif);
            }
        });

        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
            Logger.debug("TOKEN (refreshUnsubscribe)", token);
            this.props.onChangeToken(token);
        });
    }

    showLocalNotification(notif) {
        FCM.presentLocalNotification({
            title: notif.fcm.title,
            body: notif.fcm.body,
            priority: "high",
            click_action: notif.fcm.click_action,
            show_in_foreground: true,
            lights: true,
            game: notif.game
        });
    }

    componentWillUnmount() {
        this.notificationListner.remove();
        this.refreshTokenListener.remove();
    }

    render() {
        return null;
    }
}