# Changelog

## [0.2.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.1.0...v0.2.0) (2021-05-20)

This release supports the [Bee's 0.6.0 release](https://github.com/ethersphere/bee/releases/tag/v0.6.0) and is fully
compatible with it. Due to the amount of breaking changes Bee Dashboard no longer supports the Bee version `0.5.3`.

### Features

* update to bee 0.6.0 and bee-js 0.9.0 ([#99](https://www.github.com/ethersphere/bee-dashboard/issues/99)) ([7f5fbd3](https://www.github.com/ethersphere/bee-dashboard/commit/7f5fbd3fb65fe35762cf25ddf7bbaa8b3bd623f9))


### Bug Fixes

* serve npm command path specification ([#101](https://www.github.com/ethersphere/bee-dashboard/issues/101)) ([edd4a2f](https://www.github.com/ethersphere/bee-dashboard/commit/edd4a2fc11219843860861343f0317a5f1268ff0)), closes [#98](https://www.github.com/ethersphere/bee-dashboard/issues/98)

## 0.1.0 (2021-04-29)


### Features

* added error boundary for each page so errors don't crash the whole app ([#84](https://www.github.com/ethersphere/bee-dashboard/issues/84)) ([fdc5f64](https://www.github.com/ethersphere/bee-dashboard/commit/fdc5f6488357fa7a07528f60af0972e5f16d0bef))
* cashing out for each peer and single page accounting ([#69](https://www.github.com/ethersphere/bee-dashboard/issues/69)) ([9d19b5e](https://www.github.com/ethersphere/bee-dashboard/commit/9d19b5e6062ddaabf104779ba1217bb19c458caf))
* initial Proof of Concept UI ([#1](https://www.github.com/ethersphere/bee-dashboard/issues/1)) ([34d2dfd](https://www.github.com/ethersphere/bee-dashboard/commit/34d2dfda5a89fc0b103d6aabbd2c1af5e06215a6))
* npm release support ([#88](https://www.github.com/ethersphere/bee-dashboard/issues/88)) ([0fb73f8](https://www.github.com/ethersphere/bee-dashboard/commit/0fb73f85b4ae816ba159302dce50c232f6fda209))
* reviewed and simplified the node status check ([#63](https://www.github.com/ethersphere/bee-dashboard/issues/63)) ([9e4e58f](https://www.github.com/ethersphere/bee-dashboard/commit/9e4e58f1600e2dcda4cc75f24b5c68bca9b5973e))
* simplified the steps to run the web app ([#79](https://www.github.com/ethersphere/bee-dashboard/issues/79)) ([bea9d55](https://www.github.com/ethersphere/bee-dashboard/commit/bea9d5557f7bdd2bc91c3741f96e023208922945))
* split api status checks ([#37](https://www.github.com/ethersphere/bee-dashboard/issues/37)) ([fc1a8cb](https://www.github.com/ethersphere/bee-dashboard/commit/fc1a8cb0a072855896c4c308c5fb0d2148294aa2))
* various UI improvements ([#36](https://www.github.com/ethersphere/bee-dashboard/issues/36)) ([0e4e9bc](https://www.github.com/ethersphere/bee-dashboard/commit/0e4e9bcf686bba1dc1b708bae3f7f16cfc0a65c6))


### Bug Fixes

* bee api hooks isLoading value now defaults to true ([#61](https://www.github.com/ethersphere/bee-dashboard/issues/61)) ([6f0655d](https://www.github.com/ethersphere/bee-dashboard/commit/6f0655ded094e15e8413cdb6cd535a24cc121850))
* changed chequebook troubleshooting to be more in line with recommended path ([#77](https://www.github.com/ethersphere/bee-dashboard/issues/77)) ([d77e184](https://www.github.com/ethersphere/bee-dashboard/commit/d77e184d6aee32aa1ecfbbdaeec39d8f7d70f4b5))
* file download redirects to bee node, upload limited to 1 file ([#62](https://www.github.com/ethersphere/bee-dashboard/issues/62)) ([5608b91](https://www.github.com/ethersphere/bee-dashboard/commit/5608b91966a1678f09ac577a935b124982a90b92))
* if any step has error, the first step could not be expanded ([#85](https://www.github.com/ethersphere/bee-dashboard/issues/85)) ([d3da895](https://www.github.com/ethersphere/bee-dashboard/commit/d3da895f036cf6b95dc8bb44ce21b561c0b2670e))
* Setting explicit Typography components to fix invalid DOM ([#25](https://www.github.com/ethersphere/bee-dashboard/issues/25)) ([325a590](https://www.github.com/ethersphere/bee-dashboard/commit/325a59098e2b41ef7e3c2bbd02e3424c67c14dc7))
* withdraw/deposit converts from BZZ (10^16 base units) ([#66](https://www.github.com/ethersphere/bee-dashboard/issues/66)) ([825772c](https://www.github.com/ethersphere/bee-dashboard/commit/825772cf735d88208205bde470ae21c3423c23aa))
