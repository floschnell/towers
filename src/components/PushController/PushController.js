import React from 'react';
import FCM, {FCMEvent} from 'react-native-fcm';
import Logger from '../../logger';
import PropTypes from 'prop-types';

/**
 * Handles retrieval of push notifications.
 */
export default class PushController extends React.Component {
  /**
   * Creates a new push notification handler.
   */
  constructor() {
    super();
    this.notificationListner = null;
    this.refreshTokenListener = null;
  }

  /**
   * @override
   */
  componentWillUnmount() {
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
  }

  /**
   * @override
   */
  componentDidMount() {
    FCM.requestPermissions();

    FCM.getFCMToken().then((token) => {
      Logger.debug('TOKEN (getFCMToken)', token);
      this.props.onChangeToken(token);
    });

    FCM.getInitialNotification().then((notif) => {
      Logger.debug('initial notification.');
      if (notif.game) {
        Logger.debug('has game');
        this.props.goToGame(notif.game);
      }
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, (notif) => {
      Logger.debug('incoming notification.', notif);
      if (notif.local_notification) {
        if (notif.opened_from_tray && notif.game) {
          Logger.debug('has game');
          this.props.goToGame(notif.game);
        }
        return;
      }

      if (notif.opened_from_tray) {
        Logger.debug('opened from tray.');
        if (notif.game) {
          Logger.debug('has game');
          this.props.goToGame(notif.game);
        }
        return;
      }

      if (!notif.game || notif.game !== this.props.game) {
        Logger.debug('display local notif:', notif);
        this.showLocalNotification(notif);
      }
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      Logger.debug('TOKEN (refreshUnsubscribe)', token);
      this.props.onChangeToken(token);
    });
  }

  /**
   * @override
   */
  render() {
    return null;
  }

  /**
   * Display an incoming notification.
   *
   * @param {FCM.Notification} notif Notification that should be displayed.
   */
  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: notif.fcm.title,
      body: notif.fcm.body,
      priority: 'high',
      click_action: notif.fcm.click_action,
      show_in_foreground: true,
      lights: true,
      game: notif.game,
    });
  }
}

PushController.propTypes = {
  onChangeToken: PropTypes.func,
  goToGame: PropTypes.func,
  game: PropTypes.string,
};
