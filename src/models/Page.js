
export class Page {
    constructor(name) {
        this._name = name;
        this._title = '';
        this._backButton = null;
        this._backButtonAction = null;
    }

    withTitle(title) {
        this._title = title;
        return this;
    }

    withBackButton(button) {
        this._backButton = button;
        return this;
    }

    withBackButtonAction(action) {
        this._backButtonAction = action;
        return this;
    }

    getTitle() {
        return this._title;
    }

    getBackButton() {
        return this._backButton;
    }

    getBackButtonAction() {
        return this._backButtonAction;
    }

    getName() {
        return this._name;
    }

    /**
     * @param {Page} page 
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
    GAME: new Page('game').withBackButton('back')
};
