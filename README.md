# Bee Dashboard

[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D10.0.0-orange.svg?style=flat-square)

> An app which helps users to setup their Bee node and do actions like cash out cheques, upload and download files or manage your postage stamps.

**Warning: This project is in alpha state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

This project is intended to be used with **Bee version 1.1.0**. Using it with older or newer Bee versions is not recommended and may not work. Stay up to date by joining the [official Discord](https://discord.gg/GU22h2utj6) and by keeping an eye on the [releases tab](https://github.com/ethersphere/bee-dashboard/releases).

![Status page](/ui_samples/status.png)

| Node Setup | Browse & Upload Files | Accounting | Peers | Settings |
|-------|---------|-------|----------|------|
| ![Setup](/ui_samples/node_setup.png) | ![Files](/ui_samples/file_upload.png) | ![Accounting](/ui_samples/accounting.png) | ![Peers](/ui_samples/peers.png) | ![Settings](/ui_samples/settings.png) |


## Table of Contents

- [Install](#install)
- [Usage](#usage)
    - [Terminal](#terminal)
    - [Docker](#docker)
- [Contribute](#contribute)
- [Development](#development)
- [Maintainers](#maintainers)
- [License](#license)

## Install

Install globally with npm. We require Node.js's version of at least 12.x and npm v6.x (or yarn v2.x).

```sh
npm install -g @ethersphere/bee-dashboard
```

## Usage

:warning: To successfully connect to the Bee node, you will need to enable the Debug API and CORS. You can do so by setting `cors-allowed-origins: ['*']` and `debug-api-enable: true` in the Bee config file and then restart the Bee node. To see where the config file is, consult the [official Bee documentation](https://docs.ethswarm.org/docs/working-with-bee/configuration#configuring-bee-installed-using-a-package-manager)

### Terminal

To start use:
```sh
bee-dashboard
```

This should open the webpage on [`http://localhost:8080`](http://localhost:8080)

### Docker

To build Docker image and run it, execute the following from inside project directory:

```sh
docker build . -t bee-dashboard
docker run --rm -p 127.0.0.1:8080:8080 bee-dashboard
```

Bee dashboard is now available on [`http://localhost:8080`](http://localhost:8080)

### Development

```sh
git clone git@github.com:ethersphere/bee-dashboard.git

cd  bee-dashboard

npm i

npm start
```

The Bee Dashboard runs in development mode on [http://localhost:3031/](http://localhost:3031/)

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/ethersphere/bee-dashboard/issues) and take on one of them
- Help our tests reach 100% coverage!
- Join us in our [Discord chat](https://discord.gg/wdghaQsGq5) in the #develop-on-swarm channel if you have questions or want to give feedback

## Maintainers

- [vojtechsimetka](https://github.com/vojtechsimetka)
- [Cafe137](https://github.com/Cafe137)

See what "Maintainer" means [here](https://github.com/ethersphere/repo-maintainer).

## License

[BSD-3-Clause](./LICENSE)
