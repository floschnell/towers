
export class Page {
    constructor(name) {
        this._name = name;
        this._title = '';
        this._backButton = null;
    }

    toJson() {
        return {
            name: this._name,
            title: this._title,
            backButton: this._backButton
        };
    }

    static fromJson({name, title, backButton}) {
        return new Page(name).withTitle(title).withBackButton(backButton);
    }

    withTitle(title) {
        this._title = title;
        return this;
    }

    withBackButton(button) {
        this._backButton = button;
        return this;
    }

    getTitle() {
        return this._title;
    }

    getBackButton() {
        return this._backButton;
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
