# Websocket Remote Control
> Static http server and base task packages.

> Implement remote control backend using `RobotJS` library and websocket.

## Installation
1. Clone/download repo
2. `npm install`
3. Choose `develop` branch
4. Change name file `.env.copy` to `.env`

**Note**: It's working only for main display. Don't try to use it for your another display.

## Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:8080` with nodemon

**Production**

`npm run start`

* App served @ `http://localhost:8080` without nodemon

---

**All commands**

Command | Description
--- | ---
`npm run dev` | App served @ `http://localhost:8080` with nodemon
`npm run start` | App served @ `http://localhost:8080` without nodemon
`npm run lint` | Identify errors found in the code, and generate reports about them.
`npm run lintfix` | It detects errors found in the code and tries to fix them.

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

## Used technologies:
- TypeScript
- ws
- robotjs
- jimp
- nodemon
- dotenv
- cross-env
- ts-node
- eslint
- node.js version: 16 LTS

## Authors:
 *[Denis Karazan](https://github.com/Wolf-Den1994)*