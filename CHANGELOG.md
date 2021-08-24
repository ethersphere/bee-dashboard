# Changelog

## [0.6.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.5.0...v0.6.0) (2021-08-24)


### Features

* add retry to accounting ([#166](https://www.github.com/ethersphere/bee-dashboard/issues/166)) ([a62243f](https://www.github.com/ethersphere/bee-dashboard/commit/a62243fe5c45b7dd9be6e92f82ebdf0b64bd8f0d))
* add tooltips and health indicator to peers ([#169](https://www.github.com/ethersphere/bee-dashboard/issues/169)) ([480f6dc](https://www.github.com/ethersphere/bee-dashboard/commit/480f6dc7f9c58a4aae87e0dea7082a4bd3dc900b))
* bee provider caching the state of the app and refreshing periodically ([#172](https://www.github.com/ethersphere/bee-dashboard/issues/172)) ([2624cf0](https://www.github.com/ethersphere/bee-dashboard/commit/2624cf04c939e87f025c1f4ff417808073742dab))
* changing API urls does not need the app refresh ([#173](https://www.github.com/ethersphere/bee-dashboard/issues/173)) ([d6d03bf](https://www.github.com/ethersphere/bee-dashboard/commit/d6d03bf7c6d2705de22f43825b85b32c2f0181fb))
* remove the last update component ([#179](https://www.github.com/ethersphere/bee-dashboard/issues/179)) ([56df3a2](https://www.github.com/ethersphere/bee-dashboard/commit/56df3a2561c3c00237b5d107eb054403af3012f8))
* synchronized platform tabs ([#165](https://www.github.com/ethersphere/bee-dashboard/issues/165)) ([ec42eaf](https://www.github.com/ethersphere/bee-dashboard/commit/ec42eafc2b768ba06649f628c733e8d3440fdcaf))


### Bug Fixes

* enum index for supported platforms ([#170](https://www.github.com/ethersphere/bee-dashboard/issues/170)) ([dcec6e0](https://www.github.com/ethersphere/bee-dashboard/commit/dcec6e01887465c74a68feede52b476791bbefa7))
* remove nested ternary operator and simplify ping peer functionality ([#181](https://www.github.com/ethersphere/bee-dashboard/issues/181)) ([2b120e4](https://www.github.com/ethersphere/bee-dashboard/commit/2b120e44ca5e01451cc43e362195c04587836a03))

## [0.5.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.4.0...v0.5.0) (2021-08-09)


### Features

* updated troubleshooting instructions and links for mainnet ([#161](https://www.github.com/ethersphere/bee-dashboard/issues/161)) ([960ffb8](https://www.github.com/ethersphere/bee-dashboard/commit/960ffb8fdd6cbfe4928b758da6cac9ba94050c00))


### Bug Fixes

* amend readme ([#155](https://www.github.com/ethersphere/bee-dashboard/issues/155)) ([be8b885](https://www.github.com/ethersphere/bee-dashboard/commit/be8b88516b00d79a623798588d3d4dac3340e8b2))

## [0.4.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.3.1...v0.4.0) (2021-06-29)


### Features

* display postage batch usage percentage ([#149](https://www.github.com/ethersphere/bee-dashboard/issues/149)) ([6f645dc](https://www.github.com/ethersphere/bee-dashboard/commit/6f645dc6c357cb9d86cec15e454b361bc871bec6))


### Bug Fixes

* clear dropzone state after upload ([#150](https://www.github.com/ethersphere/bee-dashboard/issues/150)) ([b190cac](https://www.github.com/ethersphere/bee-dashboard/commit/b190cac7064ad3dffb770c5a83d3db4a14d39607))

### [0.3.1](https://www.github.com/ethersphere/bee-dashboard/compare/v0.3.0...v0.3.1) (2021-06-03)


### Bug Fixes

* don't display version alert when unable to retrieve version from bee node ([#138](https://www.github.com/ethersphere/bee-dashboard/issues/138)) ([5ace762](https://www.github.com/ethersphere/bee-dashboard/commit/5ace7629f2479499fe975dec8be4187ece6221ed))
* typeerror in the postage stamps form ([#137](https://www.github.com/ethersphere/bee-dashboard/issues/137)) ([465df17](https://www.github.com/ethersphere/bee-dashboard/commit/465df177413afba5376682bd23a712066bd0385c))

## [0.3.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.2.0...v0.3.0) (2021-06-02)


### Features

* added Dockerfile ([#75](https://www.github.com/ethersphere/bee-dashboard/issues/75)) ([aab0462](https://www.github.com/ethersphere/bee-dashboard/commit/aab0462047a3fcd87ba258b5486aede922865b1e))
* added tolerance to version check and warning if not exact to what we tested ([#133](https://www.github.com/ethersphere/bee-dashboard/issues/133)) ([353db10](https://www.github.com/ethersphere/bee-dashboard/commit/353db10080b85b0e12e13991665297ec262d2806))
* postage stamps support ([#115](https://www.github.com/ethersphere/bee-dashboard/issues/115)) ([4074a9d](https://www.github.com/ethersphere/bee-dashboard/commit/4074a9de5dae4aaa1654f7dfdd3e3343eaf2bf9b))
* unified notification with notistack ([#127](https://www.github.com/ethersphere/bee-dashboard/issues/127)) ([bec8405](https://www.github.com/ethersphere/bee-dashboard/commit/bec84051a9582bf62a23f2080a6587a9f458b969))
* upload files with postage stamps ([#126](https://www.github.com/ethersphere/bee-dashboard/issues/126)) ([92c727e](https://www.github.com/ethersphere/bee-dashboard/commit/92c727e5f5772f612fe04b750ef5373780ccba5c))


### Bug Fixes

* add git attributes ([#123](https://www.github.com/ethersphere/bee-dashboard/issues/123)) ([07f987e](https://www.github.com/ethersphere/bee-dashboard/commit/07f987e069cda2f28bc5ebf8958b9b0aa9d875dc))
* add prod env variables ([#121](https://www.github.com/ethersphere/bee-dashboard/issues/121)) ([a603a86](https://www.github.com/ethersphere/bee-dashboard/commit/a603a86c1adcfb0dcc9995c95c4ee4411c41c25a))
* replace http-serve with serve-handler ([#122](https://www.github.com/ethersphere/bee-dashboard/issues/122)) ([ba9b498](https://www.github.com/ethersphere/bee-dashboard/commit/ba9b498488dca989bbbda6110d0d22753b33ae8c))
* troubleshooting on a mac and clearer CORS setup guide ([#131](https://www.github.com/ethersphere/bee-dashboard/issues/131)) ([9fee1aa](https://www.github.com/ethersphere/bee-dashboard/commit/9fee1aa68ac6dbc53615332bc0142a06f3e5f03f))

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
