# Changelog

## [0.9.0](https://github.com/enricodeleo/cambusa/compare/0.8.0...0.9.0) (2024-09-22)


### Chores

* cli as separate package ([8bc2acc](https://github.com/enricodeleo/cambusa/commit/8bc2accdf320e79146f5147e657dddc6dda7b561))
* move functionalities to src ([0e838c9](https://github.com/enricodeleo/cambusa/commit/0e838c9875f07bbd8a6f7944b5ff5296e759e33c))
* publish more directories ([73f8f9a](https://github.com/enricodeleo/cambusa/commit/73f8f9a6bcb5be6ef0dcb7a175df3fcffd55d827))

## [0.8.0](https://github.com/enricodeleo/cambusa/compare/0.7.0...0.8.0) (2024-09-22)


### Features

* **EntitySubscriber, websocketHandler:** implement real-time updates via WebSocket ([9ff8bc6](https://github.com/enricodeleo/cambusa/commit/9ff8bc6a63f1251860e8da289c4d76e275396659))
* **README.md:** add import statement for elysia and update column types to string with email validation ([943dd97](https://github.com/enricodeleo/cambusa/commit/943dd977b6086de5da65c47a9569385df8e521d4))


### Code Refactoring

* **docs, websocketHandler:** streamline WebSocket message structure and handling ([5c8e5e9](https://github.com/enricodeleo/cambusa/commit/5c8e5e9b730beaa25115b3fa20a67ff66d56c4c4))

## [0.7.0](https://github.com/enricodeleo/cambusa/compare/0.6.0...0.7.0) (2024-09-22)


### Features

* **README.md, WEBSOCKET.md, cambusa.js, datastore, websocketHandler:** implement real-time entity updates via WebSocket ([1be7582](https://github.com/enricodeleo/cambusa/commit/1be758290e412c130345ae78fd71425789a55657))


### Documentation

* **WEBSOCKET.md:** update WebSocket message format and add validation ([d5876ba](https://github.com/enricodeleo/cambusa/commit/d5876ba4862761ae72a47232c38353955fa3cee2))


### Code Refactoring

* **datastore, router:** enhance logging and error handling for clarity and consistency ([8d766c5](https://github.com/enricodeleo/cambusa/commit/8d766c5440ed6bf1a4ce1d1457e2540da9e6c143))
* **datastore/EntitySubscriber:** streamline event logging and remove unused constructor ([41c6979](https://github.com/enricodeleo/cambusa/commit/41c6979746a60826edfc77b1ecbc58b3d8a76e70))
* standardize logging with cambusa.log across CLI and lib ([11fb7a5](https://github.com/enricodeleo/cambusa/commit/11fb7a5fc02e27e2a0d44efa15d204d918330564))

## [0.6.0](https://github.com/enricodeleo/cambusa/compare/0.5.2...0.6.0) (2024-09-21)


### Features

* add WebSocket support for real-time communication ([33f513c](https://github.com/enricodeleo/cambusa/commit/33f513cad5ba3c8185e8e752a274ca2dd1df80c3))
* **cambusa.js:** enhance controller generation with directory support, error handling, and template update ([8e5bfb3](https://github.com/enricodeleo/cambusa/commit/8e5bfb32caedb5fccdd5d7405e4e14ceaa69e67c))


### Documentation

* better commenting ([7e90e93](https://github.com/enricodeleo/cambusa/commit/7e90e938b7c9baee012a70e7b6cc2acf02e6e6cf))
* code of conduct ([d6bca25](https://github.com/enricodeleo/cambusa/commit/d6bca25936445de8617e82f8fe07f0b816fa78cc))
* contributing docs ([51b0bec](https://github.com/enricodeleo/cambusa/commit/51b0bec99b8cf4abb679a935bd4629d45236fe35))


### Styles

* reindent ([f6f20a7](https://github.com/enricodeleo/cambusa/commit/f6f20a7a55f00419dd6a33c7948470896933c0c2))

## [0.5.2](https://github.com/enricodeleo/cambusa/compare/0.5.1...0.5.2) (2024-09-20)


### Features

* **User model:** add email and age field validations using elysia ([e5b579f](https://github.com/enricodeleo/cambusa/commit/e5b579f43fb109022f7307c2e0635b2170bfb365))


### Documentation

* custom validations ([223337e](https://github.com/enricodeleo/cambusa/commit/223337efef4b7cd9680bb4b9e48162f6de3f211d))
* migrations and db:sync docs ([fb4136f](https://github.com/enricodeleo/cambusa/commit/fb4136f31549b72ffd3b1b38cf14d54248102a2d))

## [0.5.1](https://github.com/enricodeleo/cambusa/compare/0.5.0...0.5.1) (2024-09-20)


### Features

* **cambusa.js, datastore.js:** refactor loadSchemas to async and improve error handling ([dd40b82](https://github.com/enricodeleo/cambusa/commit/dd40b823038ed875fb811231ba9da9895cb5f7d2))


### Documentation

* **DATABASE.md:** streamline migration documentation, removing outdated section and adding best practices and detailed notes on migration commands ([c579b5a](https://github.com/enricodeleo/cambusa/commit/c579b5a5e5a25b38ee7c28706b447444e27ad458))

## [0.5.0](https://github.com/enricodeleo/cambusa/compare/0.4.1...0.5.0) (2024-09-20)


### Features

* add migration generation and creation commands to CLI ([1925401](https://github.com/enricodeleo/cambusa/commit/1925401fb4abd2ac5fe7e7e846e41e632694a423))
* **cambusa.js:** add migrations:run command to execute pending database migrations ([898d926](https://github.com/enricodeleo/cambusa/commit/898d9266207bbe09707b7cdd883920acf4f05113))
* **datastore:** add transformer support for column type conversions ([d620d99](https://github.com/enricodeleo/cambusa/commit/d620d99a3caa13754409307a70fe1217272bf108))


### Bug Fixes

* handle validation for relations when populated vs when they're not ([d241acf](https://github.com/enricodeleo/cambusa/commit/d241acf4c7d4e669c2fc278b2843a2f23ed7197b))


### Documentation

* update readme ([f5b8c26](https://github.com/enricodeleo/cambusa/commit/f5b8c26c43a542584462d46c5894da5c436152f4))


### Code Refactoring

* **models:** remove createdAt and updatedAt fields from Product and User models to rely on database defaults ([2cdd419](https://github.com/enricodeleo/cambusa/commit/2cdd41916ec056012de65e7d2e7bf13517e051e6))
* renaming fake data generator ([539b774](https://github.com/enricodeleo/cambusa/commit/539b7745daeab6354c36038aebdebf1325f4ef65))


### Chores

* remove populateData.js script and refactor Cambusa library for improved schema handling and database initialization ([386b225](https://github.com/enricodeleo/cambusa/commit/386b22596c82d680214a62d4477026931dacf545))

## [0.4.1](https://github.com/enricodeleo/cambusa/compare/0.4.0...0.4.1) (2024-09-20)


### Features

* add REPL command to Cambusa CLI for interactive sessions ([f67754b](https://github.com/enricodeleo/cambusa/commit/f67754b9d3de3d6ec671d4b099222862459fd828))
* add script execution and listing capabilities to CLI ([a29d99b](https://github.com/enricodeleo/cambusa/commit/a29d99ba2b090fed2efe15f430fc787c170d182c))


### Code Refactoring

* code style ([faf6f19](https://github.com/enricodeleo/cambusa/commit/faf6f19899dc6fac6dcc65d3343507d7bf98632e))
* code style ([64bbb96](https://github.com/enricodeleo/cambusa/commit/64bbb962f1828adfc5964dda95eb212d1c6e1796))

## [0.4.0](https://github.com/enricodeleo/cambusa/compare/0.3.0...0.4.0) (2024-09-20)

### Features

- **blueprints, generateValidationSchema:** enhance API validation and error handling ([5c3b42f](https://github.com/enricodeleo/cambusa/commit/5c3b42f8576009fe6c7240257c7b01b7ccca0f4f))
- **generateValidationSchema.js:** add option to exclude auto-generated fields from validation schemas for more flexible schema generation ([1896445](https://github.com/enricodeleo/cambusa/commit/1896445f5b180a83ad1446ab7f84fae4f5b40252))
- introduce Cambusa CLI with model and controller generators, route listing ([6bc3dd2](https://github.com/enricodeleo/cambusa/commit/6bc3dd2e03b7601263f3a72b4725518ddb243f95))

### Code Refactoring

- **blueprints.js, generateValidationSchema.js:** standardize single quotes for consistency ([25a779f](https://github.com/enricodeleo/cambusa/commit/25a779f6405ea65b25df523a09d10f72472283f8))
- **datastore/commonTypes:** normalize export and string quotes for consistency ([4188ba4](https://github.com/enricodeleo/cambusa/commit/4188ba4571e6fffba0c323385adc13911d82c723))
- **generateValidationSchema.js:** standardize quotes and improve schema generation logic ([3884f12](https://github.com/enricodeleo/cambusa/commit/3884f128bbf1f8e7554ec8a075a424f0dcc73fbb))

## [0.3.0](https://github.com/enricodeleo/cambusa/compare/0.2.0...0.3.0) (2024-09-19)

### Features

- **lib/router:** add generateValidationSchema.js for dynamic validation schema generation ([99dd68b](https://github.com/enricodeleo/cambusa/commit/99dd68b680f0fd9cc58900cc112c71b277d9a166))

### Documentation

- fix some typo ([a1bbb6b](https://github.com/enricodeleo/cambusa/commit/a1bbb6bbad5a106e64c4d6a23fc16076255f7f4b))

### Code Refactoring

- **datastore/commonTypes.js:** standardize quotes and align elysiaType values for consistency ([42676f9](https://github.com/enricodeleo/cambusa/commit/42676f90bee3463db85118e92b4ec2c8c7b4371e))
- new schema functions for blueprints ([1e9d6d7](https://github.com/enricodeleo/cambusa/commit/1e9d6d7c64c5f58407728e82c0345234801ed9c0))

## [0.2.0](https://github.com/enricodeleo/cambusa/compare/0.1.0...0.2.0) (2024-09-18)

### Features

- add hooks directory, Category, Order, Product, Review models, update User model, and enhance DATABASE.md with model definition types and relations ([2d9169b](https://github.com/enricodeleo/cambusa/commit/2d9169bc62f8fd361ded1521e26800fda8ad5331))
- **lib/datastore, lib/router:** add filtering support to blueprints and validate 'where' parameter ([4921ffe](https://github.com/enricodeleo/cambusa/commit/4921ffe83868d67e8c6d231edd58a75faf71baa6))
- **lib/datastore:** add extractRelations.js to handle relation extraction ([43f91bd](https://github.com/enricodeleo/cambusa/commit/43f91bda2dd5c16a6c5609e55980734ccfe04a85))

### Documentation

- **README.md:** add documentation for query parameters in blueprints ([90e910d](https://github.com/enricodeleo/cambusa/commit/90e910dce1c1f881708301d931a34ab05edb06c5))

### Code Refactoring

- **blueprints.js:** enhance blueprints with sorting, fix schema typo, remove validateWhere.js ([cea7a30](https://github.com/enricodeleo/cambusa/commit/cea7a305a758a143aa38787fea72aa83cbc3581b))
- **blueprints.js:** standardize error handling and pagination logic, improve code readability and consistency ([aa475b9](https://github.com/enricodeleo/cambusa/commit/aa475b901688667721c8795207a6e70421b2f4ac))
- **datastore, router:** streamline relation extraction and enhance API response ([5388e33](https://github.com/enricodeleo/cambusa/commit/5388e334d100475c8668b152a8bb228aae6bcec9))
- streamline mapTypes and enhance blueprints module documentation ([93fc59a](https://github.com/enricodeleo/cambusa/commit/93fc59a8b0528682b654566149f8dc0141c73192))

### Chores

- testing blueprints ([8618be6](https://github.com/enricodeleo/cambusa/commit/8618be69906a9877eaaad93cd8e15ab49c76152e))

## [0.1.0](https://github.com/enricodeleo/cambusa/compare/0.0.9...0.1.0) (2024-09-18)

### Features

- **README.md:** enhance documentation on routes, controllers, and introduce blueprints for automatic CRUD operations ([9ebf84a](https://github.com/enricodeleo/cambusa/commit/9ebf84af123c755dfb6b8846564af3d0a3df371d))

### Code Refactoring

- **lib:** streamline route and blueprint loading with clearer naming ([918be0a](https://github.com/enricodeleo/cambusa/commit/918be0a0b958a34d3e89a8b92398854ac88fc491))

## [0.0.9](https://github.com/enricodeleo/cambusa/compare/0.0.8...0.0.9) (2024-09-18)

### Chores

- keep controllers clean ([1f2b92a](https://github.com/enricodeleo/cambusa/commit/1f2b92a570db371cbfae2bbf91dcd078ade79357))

## [0.0.8](https://github.com/enricodeleo/cambusa/compare/0.0.7...0.0.8) (2024-09-18)

### Features

- **api/models:** add Comment model for handling comments data ([f329dae](https://github.com/enricodeleo/cambusa/commit/f329dae8b955533bee5df12ac23a686397984841))
- **docs, datastore:** enhance model documentation and automate timestamps ([32b3d32](https://github.com/enricodeleo/cambusa/commit/32b3d3278825d9b3a437a0e2a56f610bdaec2cfc))
- streamline user creation flow and enhance localization support ([a4eb16f](https://github.com/enricodeleo/cambusa/commit/a4eb16fd2fa668dec494127d705ba32b7ce7d3b2))

### Documentation

- update readme ([33adfa3](https://github.com/enricodeleo/cambusa/commit/33adfa3a32a29137b26f505d6291acc0ea40d460))

## [0.0.7](https://github.com/enricodeleo/cambusa/compare/0.0.6...0.0.7) (2024-09-18)

### Features

- enhance model definition and datastore integration ([384bf76](https://github.com/enricodeleo/cambusa/commit/384bf7670ce23dbcefe5a006718e53f49e5334e7))

### Code Refactoring

- **api/controllers/users/create.js:** implement transactional user creation with proper error handling and logging ([1c085b2](https://github.com/enricodeleo/cambusa/commit/1c085b2974b3281030aed4c74e7f5f38109fbfc2))
- **api/controllers/users/list.js, lib/cambusa.js:** streamline user model access using Proxy ([97ea5fb](https://github.com/enricodeleo/cambusa/commit/97ea5fbec0456f4c6a022fab25079347701d5af4))
- encapsulate initialization and loading logic in Cambusa class ([c68e618](https://github.com/enricodeleo/cambusa/commit/c68e618d8288b73a8651963e02d7746f25c2469a))

### Chores

- streamline project setup and configuration management ([9c3897d](https://github.com/enricodeleo/cambusa/commit/9c3897d0639ad604a0d8878596d902d11b1b5b8e))
- update .gitignore to exclude .data directory ([de178bf](https://github.com/enricodeleo/cambusa/commit/de178bf1d8b1a8810220311d8d66260978955078))
- vs code debug ([5522024](https://github.com/enricodeleo/cambusa/commit/5522024ffb7c21e27acffc7eb492481e216adad8))

## [0.0.6](https://github.com/enricodeleo/cambusa/compare/0.0.5...0.0.6) (2024-09-15)

### Features

- add ping helper, CORS, requestLogger, swagger middlewares, and User model ([8482994](https://github.com/enricodeleo/cambusa/commit/8482994c9ea4c28be5a1591eb6399947bd1e1602))

### Documentation

- update readme ([adbdc5a](https://github.com/enricodeleo/cambusa/commit/adbdc5a3925ae4ea89aeb4558ac9b9886e2a548d))

## [0.0.5](https://github.com/enricodeleo/cambusa/compare/0.0.4...0.0.5) (2024-09-15)

### Features

- **app.js:** enhance Elysia app with start/stop event logging and global error handling ([153a16f](https://github.com/enricodeleo/cambusa/commit/153a16f08a6f73d844380bf4f587aa50613e9158))
- introduce helper functions and their dynamic loader for scalability ([64d0a09](https://github.com/enricodeleo/cambusa/commit/64d0a0991ecc9cd3001b6f17607d02c785ef9dec))

### Chores

- ignore lock file ([f019172](https://github.com/enricodeleo/cambusa/commit/f01917231167a8fd3931762bc2c0d3c7df6df04d))

## [0.0.4](https://github.com/enricodeleo/cambusa/compare/0.0.3...0.0.4) (2024-09-14)

### Features

- add cors, requestLogger, and swagger middlewares for enhanced functionality ([fe15e01](https://github.com/enricodeleo/cambusa/commit/fe15e018b783040aa686d50b49714faa855cd907))
- add User model and createUser controller for user management ([728e084](https://github.com/enricodeleo/cambusa/commit/728e0844618f22d6d13481852ddf50e1c2c0646f))
- **api/controllers/users/list.js:** implement database integration for user listing functionality ([c01a26f](https://github.com/enricodeleo/cambusa/commit/c01a26fe051572fa4bd819247549694118dae580))

### Documentation

- **README.md:** expand database setup instructions to include support for multiple databases and add configuration examples for SQLite and PostgreSQL ([6587301](https://github.com/enricodeleo/cambusa/commit/6587301dcd58eba74e09ebeb7db07e173723d1a5))

### Code Refactoring

- **app.js, config, models, lib:** streamline app initialization and model loading ([ab01f4d](https://github.com/enricodeleo/cambusa/commit/ab01f4d3973a0a9beb1fe71ba95aefe0a5d07f06))

## [0.0.3](https://github.com/enricodeleo/cambusa/compare/0.0.2...0.0.3) (2024-09-14)

### Features

- implement dynamic middleware loading mechanism for scalability ([798be3b](https://github.com/enricodeleo/cambusa/commit/798be3ba79519d3a6270057d8186dfaf81326a61))

## 0.0.2 (2024-09-14)

### Features

- logging requests ([9649772](https://github.com/enricodeleo/cambusa/commit/9649772ea654db216a6885d9189331ff90dcfbf9))
- logging utilities ([0e16785](https://github.com/enricodeleo/cambusa/commit/0e16785cd9ad9cfe90b3a634fc8b492e38fea14b))
- supporting configurations ([e494248](https://github.com/enricodeleo/cambusa/commit/e49424858ed6a769f92cee652ac4e72db7335b8a))
- supporting environment variables with CAMBUSA\_\_ prefix ([af5835b](https://github.com/enricodeleo/cambusa/commit/af5835b6fc9027b8ca8868ca8f7ff10d09669a93))
- swagger documentation ([cffa2aa](https://github.com/enricodeleo/cambusa/commit/cffa2aae174acbacd5f0023401c260203d3c9fd7))

### Code Refactoring

- restructure UserController into modular files under users directory ([e87a6e6](https://github.com/enricodeleo/cambusa/commit/e87a6e6ab6f678b24628ff42125420e3e3ac8d0b))
- split controllers method in different files ([6ee8b8a](https://github.com/enricodeleo/cambusa/commit/6ee8b8af234fde357c5db71c4ceb229a1e760a64))

### Chores

- release versions ([bfd92e0](https://github.com/enricodeleo/cambusa/commit/bfd92e08146e84a0d57bd15d4f62a6689282a511))

## 0.0.1 (2024-09-14)

### Chores

- base structure ([c46270d](https://github.com/enricodeleo/cambusa/commit/c46270de0a087a16fb9654438febce5136cfd6d7))
