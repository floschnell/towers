import {AsyncStorage} from 'react-native';

/**
 * OS Independent storage implementation.
 *
 * @export
 * @class Storage
 */
export default class Storage {
  /**
   * Saves an item in the storage.
   *
   * @static
   * @param {any} key Key to access the item again.
   * @param {any} value Value that is stored behind the key.
   * @return {Promiselike<void>}
   *
   * @memberof Storage
   */
  static setItem(key, value) {
    return AsyncStorage.setItem(key, value);
  }

  /**
   * Retrieves an item from the store.
   *
   * @static
   * @param {any} key Key of the item that we want to access.
   * @return {Promiselike<any>}
   *
   * @memberof Storage
   */
  static getItem(key) {
    return AsyncStorage.getItem(key);
  }
}
