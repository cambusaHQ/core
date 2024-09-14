# Changelog

## [0.0.4](https://github.com/enricodeleo/cambusa/compare/0.0.3...0.0.4) (2024-09-14)


### Features

* add cors, requestLogger, and swagger middlewares for enhanced functionality ([fe15e01](https://github.com/enricodeleo/cambusa/commit/fe15e018b783040aa686d50b49714faa855cd907))
* add User model and createUser controller for user management ([728e084](https://github.com/enricodeleo/cambusa/commit/728e0844618f22d6d13481852ddf50e1c2c0646f))
* **api/controllers/users/list.js:** implement database integration for user listing functionality ([c01a26f](https://github.com/enricodeleo/cambusa/commit/c01a26fe051572fa4bd819247549694118dae580))


### Documentation

* **README.md:** expand database setup instructions to include support for multiple databases and add configuration examples for SQLite and PostgreSQL ([6587301](https://github.com/enricodeleo/cambusa/commit/6587301dcd58eba74e09ebeb7db07e173723d1a5))


### Code Refactoring

* **app.js, config, models, lib:** streamline app initialization and model loading ([ab01f4d](https://github.com/enricodeleo/cambusa/commit/ab01f4d3973a0a9beb1fe71ba95aefe0a5d07f06))

## [0.0.3](https://github.com/enricodeleo/cambusa/compare/0.0.2...0.0.3) (2024-09-14)


### Features

* implement dynamic middleware loading mechanism for scalability ([798be3b](https://github.com/enricodeleo/cambusa/commit/798be3ba79519d3a6270057d8186dfaf81326a61))

## 0.0.2 (2024-09-14)


### Features

* logging requests ([9649772](https://github.com/enricodeleo/cambusa/commit/9649772ea654db216a6885d9189331ff90dcfbf9))
* logging utilities ([0e16785](https://github.com/enricodeleo/cambusa/commit/0e16785cd9ad9cfe90b3a634fc8b492e38fea14b))
* supporting configurations ([e494248](https://github.com/enricodeleo/cambusa/commit/e49424858ed6a769f92cee652ac4e72db7335b8a))
* supporting environment variables with CAMBUSA__ prefix ([af5835b](https://github.com/enricodeleo/cambusa/commit/af5835b6fc9027b8ca8868ca8f7ff10d09669a93))
* swagger documentation ([cffa2aa](https://github.com/enricodeleo/cambusa/commit/cffa2aae174acbacd5f0023401c260203d3c9fd7))


### Code Refactoring

* restructure UserController into modular files under users directory ([e87a6e6](https://github.com/enricodeleo/cambusa/commit/e87a6e6ab6f678b24628ff42125420e3e3ac8d0b))
* split controllers method in different files ([6ee8b8a](https://github.com/enricodeleo/cambusa/commit/6ee8b8af234fde357c5db71c4ceb229a1e760a64))


### Chores

* release versions ([bfd92e0](https://github.com/enricodeleo/cambusa/commit/bfd92e08146e84a0d57bd15d4f62a6689282a511))


## 0.0.1 (2024-09-14)


### Chores

* base structure ([c46270d](https://github.com/enricodeleo/cambusa/commit/c46270de0a087a16fb9654438febce5136cfd6d7))
