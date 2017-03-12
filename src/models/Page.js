
export class Page {
    constructor(name) {
        this._name = name;
        this._title = '';
    }

    withTitle(title) {
        this._title = title;
    }

    getTitle() {
        return this._title;
    }

    getName() {
        return this._name;
    }
}

export const PAGES = {
    LOGIN: new Page('Login'),
    REGISTRATION: new Page('Registration'),
    DASHBOARD: new Page('Dashboard'),
    CREATE_GAME: new Page('CreateGame'),
    GAME: new Page('Game')
};
