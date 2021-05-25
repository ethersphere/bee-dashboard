# Bee Dashboard

[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D10.0.0-orange.svg?style=flat-square)

> An app which helps users to setup their Bee node and do actions like cash out cheques.

**Warning: This project is in alpha state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

![Status page](/ui_samples/status.png)

| Node Setup | Browse & Upload Files | Accounting | Peers | Settings |
|-------|---------|-------|----------|------|
| ![Setup](/ui_samples/node_setup.png) | ![Files](/ui_samples/file_upload.png) | ![Accounting](/ui_samples/accounting.png) | ![Peers](/ui_samples/peers.png) | ![Settings](/ui_samples/settings.png) |


## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

```
$ npm install -g @ethersphere/bee-dashboard
$ bee-dashboard
```

## Development

```sh
git clone git@github.com:ethersphere/bee-dashboard.git

cd  bee-dashboard

npm ci
npm run build
npm run serve
```

You can now access Bee Dashboard on [http://localhost:8080/](http://localhost:8080/)

## Docker

To build Docker image and run it, execute the following from inside project directory:

```sh
docker build . -t bee-dashboard
docker run --rm -p 127.0.0.1:8080:8080 bee-dashboard
```

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/ethersphere/bee-dashboard/issues) and take on one of them
- Help our tests reach 100% coverage!
- Join us in our [Mattermost chat](https://beehive.ethswarm.org/swarm/channels/swarm-javascript) if you have questions or want to give feedback

## Maintainers

- [nugaon](https://github.com/nugaon)
- [vojtechsimetka](https://github.com/vojtechsimetka)

## License

[BSD-3-Clause](./LICENSE)
