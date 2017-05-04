/**
 * Represents a page within our navigation logic.
 */
export class Page {
  /**
   * Creates a new page that can be navigated to.
   *
   * @param {string} name Name of the page.
   */
  constructor(name) {
    this._name = name;
    this._title = '';
    this._backButton = null;
  }

  /**
   * Transforms the page to json, so that it can be managed by the store.
   * @return {{name: string, title: string, backButton: string}}}
   */
  toJson() {
    return {
      name: this._name,
      title: this._title,
      backButton: this._backButton,
    };
  }

  /**
   * Instantiates a new page from a json object.
   *
   * @param {string} name Unique name of the page.
   * @param {string} title Title of the page.
   * @param {string} backButton Title of the back button.
   * @return {Page}
   */
  static fromJson({name, title, backButton}) {
    return new Page(name).withTitle(title).withBackButton(backButton);
  }

  /**
   * Sets a title on the current page and returns it again.
   *
   * @param {string} title Set this title on the current page.
   * @return {Page}
   */
  withTitle(title) {
    this._title = title;
    return this;
  }

  /**
   * Sets a back button title on the current page and returns it again.
   *
   * @param {string} button Set this title on the current page's back button.
   * @return {Page}
   */
  withBackButton(button) {
    this._backButton = button;
    return this;
  }

  /**
   * @return {string} The page's title.
   */
  getTitle() {
    return this._title;
  }

  /**
   * @return {string} The page's back button's title.
   */
  getBackButton() {
    return this._backButton;
  }

  /**
   * @return {string} The page's name.
   */
  getName() {
    return this._name;
  }

  /**
   * Checks whether two pages are equal.
   *
   * @param {Page} page
   * @return {boolean}
   */
  equals(page) {
    return page && this._name === page.getName();
  }
}

export const PAGES = {
  LOGIN: new Page('login').withTitle('Welcome to Towers'),
  REGISTRATION: new Page('register').withBackButton('back'),
  DASHBOARD: new Page('dashboard').withBackButton('logout'),
  CREATE_GAME: new Page('createGame').withBackButton('back'),
  GAME: new Page('game').withBackButton('back'),
};
