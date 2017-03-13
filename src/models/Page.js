
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
}

export const PAGES = {
    LOGIN: new Page('login'),
    REGISTRATION: new Page('register'),
    DASHBOARD: new Page('dashboard'),
    CREATE_GAME: new Page('createGame'),
    GAME: new Page('game')
};
