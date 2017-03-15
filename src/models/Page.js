
export class Page {
    constructor(name) {
        this._name = name;
        this._title = '';
    }

    withTitle(title) {
        this._title = title;
        return this;
    }

    getTitle() {
        return this._title;
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
    LOGIN: new Page('login'),
    REGISTRATION: new Page('register'),
    DASHBOARD: new Page('dashboard'),
    CREATE_GAME: new Page('createGame'),
    GAME: new Page('game')
};
