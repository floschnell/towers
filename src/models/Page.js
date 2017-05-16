import {popPage, pushPage} from '../actions/navigation';
import {launchTutorial, logout} from '../actions/app';

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
      backButtonAction: this._backButtonAction,
      forwardButton: this._forwardButton,
      forwardButtonAction: this._forwardButtonAction,
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
  static fromJson({
    name,
    title,
    backButton,
    backButtonAction,
    forwardButton,
    forwardButtonAction,
  }) {
    return new Page(name)
      .withTitle(title)
      .withBackButton(backButton, backButtonAction)
      .withForwardButton(forwardButton, forwardButtonAction);
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
   * @param {function} action Action to execute when the back button is clicked.
   * @return {Page}
   */
  withBackButton(button, action) {
    this._backButton = button;
    this._backButtonAction = action;
    return this;
  }

  /**
   * Sets a forward button title on the current page and returns it again.
   *
   * @param {string} button Set this title on the current page's back button.
   * @param {function} action Action to execute when the back button is clicked.
   * @return {Page}
   */
  withForwardButton(button, action) {
    this._forwardButton = button;
    this._forwardButtonAction = action;
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
   * @return {function} The page's back button's action.
   */
  getBackButtonAction() {
    return this._backButtonAction;
  }

  /**
   * @return {string} The page's forward button's title.
   */
  getForwardButton() {
    return this._forwardButton;
  }

  /**
   * @return {function} The page's forward button's action.
   */
  getForwardButtonAction() {
    return this._forwardButtonAction;
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
  REGISTRATION: new Page('register')
    .withTitle('Create Account')
    .withBackButton('back', goBackOnePage),
  DASHBOARD: new Page('dashboard')
    .withBackButton('logout', goBackOnePage)
    .withForwardButton('tutorial', startTutorial),
  CREATE_GAME: new Page('createGame')
    .withTitle('Create New Game')
    .withBackButton('back', goBackOnePage),
  GAME: new Page('game').withBackButton('back', goBackOnePage),
};

function startTutorial(dispatch) {
  dispatch(pushPage(PAGES.GAME.withTitle('Tutorial')));
  dispatch(launchTutorial());
}

function goBackOnePage(dispatch) {
  dispatch(popPage());
}

function logOut(dispatch) {
  dispatch(logout());
}
