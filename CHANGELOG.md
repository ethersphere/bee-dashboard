# Changelog

## [0.15.0](https://github.com/ethersphere/bee-dashboard/compare/v0.14.0...v0.15.0) (2022-05-16)


### Features

* add aditional information to the stamps overview ([#349](https://github.com/ethersphere/bee-dashboard/issues/349)) ([23dea07](https://github.com/ethersphere/bee-dashboard/commit/23dea07f6e53da91f87078749f07bd95c9e65983))
* add bee desktop toolkit ([#311](https://github.com/ethersphere/bee-dashboard/issues/311)) ([ecaf205](https://github.com/ethersphere/bee-dashboard/commit/ecaf2054fc5aaa5fa4f1d0b3fb2753af9d9b233e))
* add bee-desktop settings capabilities ([#323](https://github.com/ethersphere/bee-dashboard/issues/323)) ([87b0b71](https://github.com/ethersphere/bee-dashboard/commit/87b0b71cc63098a5d886ff47d52715c250d1b659))
* support for bzz.link cids when downloading files ([#350](https://github.com/ethersphere/bee-dashboard/issues/350)) ([3784b29](https://github.com/ethersphere/bee-dashboard/commit/3784b29f148b706d5bc40b69b5ae898efa2c1990))
* wait for postage stamp to be usable when bying it ([#352](https://github.com/ethersphere/bee-dashboard/issues/352)) ([1e2face](https://github.com/ethersphere/bee-dashboard/commit/1e2face10e93818f281526d8245f84834e5ecb86))


### Bug Fixes

* app crash caused by inputing non-number characters ([#347](https://github.com/ethersphere/bee-dashboard/issues/347)) ([a67be7a](https://github.com/ethersphere/bee-dashboard/commit/a67be7a31ec88e9ce9c7764ec4523496c157d08a))
* connection health indicator values to reflect the current network conditions ([#353](https://github.com/ethersphere/bee-dashboard/issues/353)) ([07561aa](https://github.com/ethersphere/bee-dashboard/commit/07561aaed2ce7f7ffd7ecfd8ae8b5190cc9893bc))
* nested directory upload preserves the directory structure ([#365](https://github.com/ethersphere/bee-dashboard/issues/365)) ([86978b7](https://github.com/ethersphere/bee-dashboard/commit/86978b7e999584173b082eef86074af698523752))
* remove restrictions on postage stamp label ([#354](https://github.com/ethersphere/bee-dashboard/issues/354)) ([b6b9914](https://github.com/ethersphere/bee-dashboard/commit/b6b9914548a0ac00ed293ea35490ce38e9d6adaa))
* show current postage stamp price per block ([#348](https://github.com/ethersphere/bee-dashboard/issues/348)) ([906a457](https://github.com/ethersphere/bee-dashboard/commit/906a457ae5a8683f82d218759fd66dc1b7c9a220))

## [0.14.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.13.0...v0.14.0) (2022-04-14)


### Features

* add hook that detects if the bee-dashboard is run within bee-desktop ([#334](https://www.github.com/ethersphere/bee-dashboard/issues/334)) ([eb9e309](https://www.github.com/ethersphere/bee-dashboard/commit/eb9e309c8bc0327d137f190d6873618cb215fece))
* detect bee mode and enable/disable status checks accordingly ([#318](https://www.github.com/ethersphere/bee-dashboard/issues/318)) ([8baecb7](https://www.github.com/ethersphere/bee-dashboard/commit/8baecb783f1574af1cd1f17738efae4b0ac9f0c8))
* optional status checks (e.g. connected peers > 0 or funded chequebook) ([#331](https://www.github.com/ethersphere/bee-dashboard/issues/331)) ([5d0fbf7](https://www.github.com/ethersphere/bee-dashboard/commit/5d0fbf705dfed6738980c751a9654199d60a3787))


### Bug Fixes

* postage stamp price and TTL calculation ([#305](https://www.github.com/ethersphere/bee-dashboard/issues/305)) ([d0b3f1a](https://www.github.com/ethersphere/bee-dashboard/commit/d0b3f1abee7ea017bdd05954d5fadafb67365efd))

## [0.13.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.12.0...v0.13.0) (2022-01-28)


### Features

* add hash based routing ([#287](https://www.github.com/ethersphere/bee-dashboard/issues/287)) ([9ee1c91](https://www.github.com/ethersphere/bee-dashboard/commit/9ee1c9107bb08d1838044f39e4d0dd5817c8f283))
* add metadata and preview ([#292](https://www.github.com/ethersphere/bee-dashboard/issues/292)) ([f401314](https://www.github.com/ethersphere/bee-dashboard/commit/f4013142afdb407e699eff9587921e23c971f1db))


### Bug Fixes

* clean up spinner and disabled state on download page ([#294](https://www.github.com/ethersphere/bee-dashboard/issues/294)) ([a406e0f](https://www.github.com/ethersphere/bee-dashboard/commit/a406e0fc014991fcbaca230f27f41cd071d8a863))
* correct folder name when uploading multiple files or mix of files & directories ([#291](https://www.github.com/ethersphere/bee-dashboard/issues/291)) ([d878747](https://www.github.com/ethersphere/bee-dashboard/commit/d8787476acf068be6609a77b1fadb2f61d0fd502))
* disable feeds page when disconnected ([#293](https://www.github.com/ethersphere/bee-dashboard/issues/293)) ([1310deb](https://www.github.com/ethersphere/bee-dashboard/commit/1310deb17aec91f368f99974aaa245abb0a3e201))
* do not print size and name when meta is unknown ([#297](https://www.github.com/ethersphere/bee-dashboard/issues/297)) ([7880c80](https://www.github.com/ethersphere/bee-dashboard/commit/7880c802aea6b0830ca52b47b88540b8df5888cc))
* get current price from chain state ([#286](https://www.github.com/ethersphere/bee-dashboard/issues/286)) ([bc82e67](https://www.github.com/ethersphere/bee-dashboard/commit/bc82e6756154b33d01796a6e66e51dcfa1495338))

## [0.12.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.11.2...v0.12.0) (2021-12-21)


### Features

* add identity and feed management ([#272](https://www.github.com/ethersphere/bee-dashboard/issues/272)) ([25b65c3](https://www.github.com/ethersphere/bee-dashboard/commit/25b65c3fb770b09c685fe66596e372dfbb616625))

### [0.11.2](https://www.github.com/ethersphere/bee-dashboard/compare/v0.11.1...v0.11.2) (2021-12-15)


### Bug Fixes

* **ci:** add lib folder to the package.json files prop ([#270](https://www.github.com/ethersphere/bee-dashboard/issues/270)) ([5ac0f01](https://www.github.com/ethersphere/bee-dashboard/commit/5ac0f01bf50ee23b474ab9c8d61c6af418544083))

### [0.11.1](https://www.github.com/ethersphere/bee-dashboard/compare/v0.11.0...v0.11.1) (2021-12-14)


### Bug Fixes

* typo in publish script ([#268](https://www.github.com/ethersphere/bee-dashboard/issues/268)) ([c1e77bf](https://www.github.com/ethersphere/bee-dashboard/commit/c1e77bfc0d3ac442d6bacec7402f576a6422927e))

## [0.11.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.10.0...v0.11.0) (2021-12-14)


### Features

* modularisation ([#244](https://www.github.com/ethersphere/bee-dashboard/issues/244)) ([2a13da1](https://www.github.com/ethersphere/bee-dashboard/commit/2a13da1a6c5925946d22666a84f975cec87df115))


### Bug Fixes

* **build:** bee-dashboard component building ([#267](https://www.github.com/ethersphere/bee-dashboard/issues/267)) ([153b007](https://www.github.com/ethersphere/bee-dashboard/commit/153b007387618e34e1d5dc7fd82d49722783e757))

## [0.10.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.9.0...v0.10.0) (2021-12-07)


### Features

* add website and folder upload and download ([#260](https://www.github.com/ethersphere/bee-dashboard/issues/260)) ([3ef1ad9](https://www.github.com/ethersphere/bee-dashboard/commit/3ef1ad9574c9193f83d8a1447fddb79266c1a4f4))

## [0.9.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.8.0...v0.9.0) (2021-11-25)


### Features

* add dev mode flag ([#246](https://www.github.com/ethersphere/bee-dashboard/issues/246)) ([49350b0](https://www.github.com/ethersphere/bee-dashboard/commit/49350b05709053ecfbc4fc98f8b1df1aa0345e95))
* enable setting devMode from queryParams ([#254](https://www.github.com/ethersphere/bee-dashboard/issues/254)) ([844383b](https://www.github.com/ethersphere/bee-dashboard/commit/844383bea7b2118232a74ac23c9e9a38fc47d3fd))
* improve upload flow ([#240](https://www.github.com/ethersphere/bee-dashboard/issues/240)) ([635621b](https://www.github.com/ethersphere/bee-dashboard/commit/635621b04aea7124a99d00f9e31a86983063f5ce))
* move postage stamp operations to bee debug api ([#256](https://www.github.com/ethersphere/bee-dashboard/issues/256)) ([3bb0077](https://www.github.com/ethersphere/bee-dashboard/commit/3bb00771d684ad93fd7acd921b648574013aec5c))

## [0.8.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.7.0...v0.8.0) (2021-10-20)

In this version we are adding support for the bee release 1.2.0. The app also went through a graphical redesign. More to come soon!


### Features
* support for bee 1.2.0
* update files page design ([#218](https://www.github.com/ethersphere/bee-dashboard/issues/218)) ([93af7f3](https://www.github.com/ethersphere/bee-dashboard/commit/93af7f35a371d54864c068be6e1d8a70092afe28))
* update info page design ([#207](https://www.github.com/ethersphere/bee-dashboard/issues/207)) ([57f5a73](https://www.github.com/ethersphere/bee-dashboard/commit/57f5a73f3a8d957bf967c51612dc09c802bb68dc))
* update status page design ([#214](https://www.github.com/ethersphere/bee-dashboard/issues/214)) ([b666cd2](https://www.github.com/ethersphere/bee-dashboard/commit/b666cd2657cf1003651c44b6b4fa5bdcf11e895f))
* update troubleshooting component design ([#204](https://www.github.com/ethersphere/bee-dashboard/issues/204)) ([c4c1573](https://www.github.com/ethersphere/bee-dashboard/commit/c4c1573263868b6dc8a863124e4aee824dceadbb))
* update accounting page design ([#209](https://www.github.com/ethersphere/bee-dashboard/issues/209)) ([ecbc116](https://www.github.com/ethersphere/bee-dashboard/commit/ecbc1164756de912d14ce44aa9b2c155dded6dac))
* update postage stamps page design ([#217](https://www.github.com/ethersphere/bee-dashboard/issues/217)) ([f241b2f](https://www.github.com/ethersphere/bee-dashboard/commit/f241b2fc5f6ec0741e275498ebef5a18ce710b81))
* update settings page design ([#215](https://www.github.com/ethersphere/bee-dashboard/issues/215)) ([32e5ea9](https://www.github.com/ethersphere/bee-dashboard/commit/32e5ea9e56fdf957b758ec714bb6a4fe1903082a))


### Bug Fixes

* hover state style of ListItems which are clickable to be in line with other buttons ([#223](https://www.github.com/ethersphere/bee-dashboard/issues/223)) ([6c3f6c1](https://www.github.com/ethersphere/bee-dashboard/commit/6c3f6c1019801267aa5e51002f6e21f769edc210))
* size of the troubleshoot component button ([#226](https://www.github.com/ethersphere/bee-dashboard/issues/226)) ([b4c9d9e](https://www.github.com/ethersphere/bee-dashboard/commit/b4c9d9e0182c4bee5ebb2d4e43e0aaad2aeb616b))
* style of the update bee version button ([#222](https://www.github.com/ethersphere/bee-dashboard/issues/222)) ([83c6d13](https://www.github.com/ethersphere/bee-dashboard/commit/83c6d1341790d664c7986dd2a816fe6a3b069e5c))
* typo in population text ([#228](https://www.github.com/ethersphere/bee-dashboard/issues/228)) ([cc5e778](https://www.github.com/ethersphere/bee-dashboard/commit/cc5e778f892b73b0b7ff5e0fa00c4816f3298ac7))
* unknown routes should point to info page ([#227](https://www.github.com/ethersphere/bee-dashboard/issues/227)) ([f11bbd5](https://www.github.com/ethersphere/bee-dashboard/commit/f11bbd5008a78ef7d5c73fc2758ee4e2dafae01e))
* used label in postage stamp list ([#220](https://www.github.com/ethersphere/bee-dashboard/issues/220)) ([0326568](https://www.github.com/ethersphere/bee-dashboard/commit/03265687ad630b0100da3134518b680327af1636))
* wording in chequebook setup ([#211](https://www.github.com/ethersphere/bee-dashboard/issues/211)) ([e7188f4](https://www.github.com/ethersphere/bee-dashboard/commit/e7188f4a35c85204eef6a01ae6f1e679d076180c))


## [0.7.0](https://www.github.com/ethersphere/bee-dashboard/compare/v0.6.0...v0.7.0) (2021-08-31)


### Features

* removed dark theme and theme switching ([#190](https://www.github.com/ethersphere/bee-dashboard/issues/190)) ([d1720e2](https://www.github.com/ethersphere/bee-dashboard/commit/d1720e243c4415d75763a229250fa20e3664290e))
* separate info and status page ([#183](https://www.github.com/ethersphere/bee-dashboard/issues/183)) ([02a7bff](https://www.github.com/ethersphere/bee-dashboard/commit/02a7bff733b7fac70c6a36f94e6ba1425854a0af))
* styling of the sidebar ([#194](https://github.com/ethersphere/bee-dashboard/pull/194))


### Bug Fixes
* bee 1.1.0 version reporting workaround ([#197](https://github.com/ethersphere/bee-dashboard/issues/197))

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
