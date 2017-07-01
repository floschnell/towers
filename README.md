[![Build Status](https://travis-ci.org/floschnell/towers.svg?branch=master)] (https://travis-ci.org/floschnell/towers)
[![Coverage Status](https://coveralls.io/repos/github/floschnell/towers/badge.svg?branch=master)](https://coveralls.io/github/floschnell/towers?branch=master)

# Towers
Towers is an OS independent board game. Currently there is a multiplayer mode that enables player to compete online and a simple single player variant, where one can play against an AI. The game runs on almost any operating system. There is a web version and also a native Android and iOS version available. So far only web and Android have been tested regularly though. Towers is an open source implementation of the original game [Kamisado](https://en.wikipedia.org/wiki/Kamisado). The game is chess-flavored, but with simplified rules and an intelligent twist.

Rules taken from Wikipedia:
> The players’ towers start the game on the row nearest to them. The players take turns moving one tower any number of spaces in a straight line, either directly forwards or diagonally forwards, but not into or through a square already containing another dragon tower.
>
>The player with the black dragons moves first and may choose any tower. From this point onwards, each player must move the dragon tower that matches the colour of the square that the opponent’s last move finished on. The object of the game is to reach your opponent’s Home Row with one of your dragon towers. The first player to achieve this goal is the winner of the round.
>
>Games may be played as single rounds, or as more advanced ‘Match’ formats. Matches are played up to 3 points (Standard Match), 7 points (Long Match) or 15 points (Marathon Match). During a match, each time a round is won, a special ‘Sumo Ring’ is added to the dragon tower that has fought its way through to the opponent’s Home Row. The sumo rings provide the scoring system for the game, and also endow special powers to the dragon towers that carry them. These towers are known as Sumo towers and have the ability to push opponent’s towers back one space, by using a move known as a ‘Sumo Push’.

## Development
Written completely in Javascript on top of React and React Native it is compatible with a wide range of operating systems. Furthermore the whole application state is managed via Redux and thus makes use of the advantages of the [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview.html#content). To overcome the challenges of the synchronous nature of Flux, the [thunk middleware](https://github.com/gaearon/redux-thunk) is used to execute asynchronous code. Callbacks are either handled via Promises or - if they need to be cancelable for instance - by [RxJS](http://reactivex.io/rxjs). Game data is stored within a [Firebase database](https://firebase.google.com/docs/database/). Therefor clients will be automatically synchronized and this application does not need any own backend code.

### Architecture
Currently the application is still taking form. There are a few general concepts though.

#### Components
The React components of which the application consists of, will go into separate folders (src/components/[name]). In this folder there might be a Container component. Those containers offer a certain view on the application state by explicitly passing (modified) state fields to the actualy React component. Furthermore they also expose actions to the component, to enable store interaction/modification. This folder might also contain a web and/or a native folder. This is to separate the React from the ReactNative components. When there is a native component, there also needs to be a web component. This is because when the native component is being imported via ```import './native/NameComponent'``` the import statement gets rewritten to ```import './web/NameComponent'``` by webpack, as soon as you are building for web. The web components may import [Stylus](http://stylus-lang.com/) files. Those will be parsed to css and included into the web javascript bundle.

#### Logging
The logging component (./src/logger.js) is to be used to do any kind of console output. It will ensure that the application does not do extensive logging in production. Using it is as easy as:
```javascript
import Logger from './logger';

const x = 42;

try {
    Logger.debug('Variable x is', x);
    Logger.info('This is a normal info message');
    Logger.warn('Not so good!');
} catch (e) {
    Logger.error('This is bad!', e);
}
```

### Android
If you want to develop for an Android device, you will need to setup some tools first. [Facebook's React Native "Getting Started Guide"](https://facebook.github.io/react-native/docs/getting-started.html) will help you with that. To make use of the **npm scripts** you will have to name your virtual device "ReactNative" (or modify the package.json and replace it with your choosing).

#### Build for Development
If you want to run the application for development, it is as simple as executing ```npm run android:dev```. This will then startup the android virtual device, install the application on it and run the React Native dev-server.

#### Build for Production
If you want to build a distributable application bundle, you will have to create a keystore first. Then modify the gradle properties (./android/gradle.properties) that start with **MYAPP_RELEASE_** to match your environment.

Building is done by running ```npm run android:build```.

### Web
Execute ```npm install``` installs all the necessary dependencies.

#### Build for Development
Run ```npm run web:dev``` to start a webpack dev server. You can access the latest built version in your browser under [http://localhost:8080/dev/](http://localhost:8080/dev/). Once you change a source file the bundle will be rebuild and the website reloads to reflect your code changes.

#### Build for Production
To generate a production bundle of the web code, simply run ```npm run web:build```. An optimized bundle will the drop into the ./public/dist folder. You can serve this file by running ```npm start```. It is then available in your browser: [http://localhost:3000](http://localhost:3000).

The way it is currently build, you can easily push it to [heroku](http://www.heroku.com) without making any adjustments to the code.