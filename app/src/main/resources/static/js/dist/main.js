/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./static/js/App.js":
/*!**************************!*\
  !*** ./static/js/App.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_SignUp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/SignUp */ \"./static/js/components/SignUp.js\");\n/* harmony import */ var _components_Login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Login */ \"./static/js/components/Login.js\");\n/* harmony import */ var _components_Sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Sidebar */ \"./static/js/components/Sidebar.js\");\n/* harmony import */ var _components_Main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Main */ \"./static/js/components/Main.js\");\n/**\n * Entry point of the web application\n * Single page application\n * \n */\n// Imports\nconst React = window.React;\nconst ReactDOM = window.ReactDOM;\nconst Cookies = window.Cookies;\nconst $ = window.jQuery;\n\n\n\n\n$(document).ready(() => {\n  // date to set expiry for a cookie\n  var inFifteenMinutes = new Date(new Date().getTime() + 5 * 60 * 1000); // TODO test cookie remove before production\n\n  Cookies.set('token', 'test-cookie-remove-before-production', {\n    expires: 365\n  });\n});\n/**\n * React App Component\n */\n\nclass App extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      showLogin: false,\n      showSignUp: false,\n      token: null\n    };\n    this.handleLogout = this.handleLogout.bind(this);\n  }\n\n  handleLogin() {\n    this.setState({\n      showLogin: true,\n      showSignUp: false,\n      token: null\n    });\n  }\n\n  handleSignUp() {\n    history.pushState({\n      route: '/auth'\n    }, '', '/auth/register');\n    this.setState({\n      showSignUp: true\n    });\n  }\n\n  handleLogout() {\n    this.setState({\n      token: null\n    });\n  }\n\n  render() {\n    let tokenCookie = Cookies.get('token');\n\n    if (this.state.showLogin) {\n      console.log(\"render login\");\n      return /*#__PURE__*/React.createElement(_components_Login__WEBPACK_IMPORTED_MODULE_1__.default, null);\n    }\n\n    if (this.state.showSignUp) {\n      return /*#__PURE__*/React.createElement(_components_SignUp__WEBPACK_IMPORTED_MODULE_0__.default, null);\n    }\n\n    if (tokenCookie === undefined) {\n      return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"h1\", null, \"Project CS261\", \"\\n\", \"Group 45\"), /*#__PURE__*/React.createElement(\"button\", {\n        className: \"btn btn-primary\",\n        onClick: () => this.handleLogin()\n      }, \"Log in\"), /*#__PURE__*/React.createElement(\"button\", {\n        className: \"btn btn-primary\",\n        onClick: () => this.handleSignUp()\n      }, \"Sign up\"));\n    } else {\n      this.setState({\n        token: tokenCookie\n      });\n    }\n\n    return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(_components_Sidebar__WEBPACK_IMPORTED_MODULE_2__.default, {\n      token: this.state.token,\n      onLogout: this.handleLogout\n    }));\n  }\n\n}\n\nReactDOM.render( /*#__PURE__*/React.createElement(App, null), $('#app')[0]);\n/**\n * Set's the token as a cookie received from the server\n * @param {String} res response from the server \n */\n\nfunction handleToken(res) {\n  tokenLength = 32;\n  index = res.toString().indexOf(\"token=\");\n\n  if (index === -1) {\n    return null;\n  }\n\n  token = res.substring(index + 6, index + 6 + tokenLength);\n  Cookies.set('token', token);\n  return token;\n}\n\nfunction handleError(res) {\n  index = res.toString().indexOf(\"error=\");\n\n  if (index === -1) {\n    return null;\n  }\n\n  error = res.substring(index + 6);\n}\n\n//# sourceURL=webpack://project/./static/js/App.js?");

/***/ }),

/***/ "./static/js/components/Login.js":
/*!***************************************!*\
  !*** ./static/js/components/Login.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Login)\n/* harmony export */ });\n/**\n * Login component\n */\nclass Login extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      email: '',\n      password: '',\n      stay: false,\n      error: false\n    };\n    this.handleChange = this.handleChange.bind(this);\n    this.handleCheck = this.handleCheck.bind(this);\n    this.handleSubmit = this.handleSubmit.bind(this);\n    this.handleInvalid = this.handleInvalid.bind(this);\n  }\n\n  handleChange(event) {\n    this.setState({\n      [event.target.name]: event.target.value\n    });\n  }\n\n  handleCheck(event) {\n    this.setState({\n      [event.target.name]: event.target.checked\n    });\n  }\n\n  handleInvalid(event) {\n    event.target.classList.add('invalid');\n  }\n\n  handleSubmit(event) {\n    $.ajax({\n      url: '/auth/login',\n      type: 'POST',\n      data: JSON.stringify(this.state),\n      success: res => {\n        // handle success\n        console.log('Token');\n        console.log(Cookies.get('token'));\n      },\n      error: res => {// handle error\n      }\n    });\n    event.preventDefault();\n  }\n\n  render() {\n    return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"h1\", null, \"Login\"), this.state.error !== false && /*#__PURE__*/React.createElement(\"div\", {\n      class: \"alert alert-danger\",\n      role: \"alert\"\n    }, this.state.error), /*#__PURE__*/React.createElement(\"form\", {\n      method: \"POST\",\n      onSubmit: this.handleSubmit\n    }, /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"email\",\n      name: \"email\",\n      value: this.state.email,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoFocus: true,\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"password\",\n      name: \"password\",\n      value: this.state.password,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"checkbox\",\n      name: \"stay\",\n      onChange: this.handleCheck,\n      className: \"form-check-input\",\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"button\", {\n      type: \"submit\",\n      className: \"btn btn-primary\"\n    }, \"Log in\"))));\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/Login.js?");

/***/ }),

/***/ "./static/js/components/Logo.js":
/*!**************************************!*\
  !*** ./static/js/components/Logo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Logo)\n/* harmony export */ });\nclass Logo extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement(\"h2\", null, \"Project CS261\", '\\n', \"Group45\");\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/Logo.js?");

/***/ }),

/***/ "./static/js/components/Main.js":
/*!**************************************!*\
  !*** ./static/js/components/Main.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Main)\n/* harmony export */ });\nclass Main extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement(\"div\", null, \"Main content\");\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/Main.js?");

/***/ }),

/***/ "./static/js/components/Nav.js":
/*!*************************************!*\
  !*** ./static/js/components/Nav.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Nav)\n/* harmony export */ });\n/**\n* Navigation component\n*/\nclass Nav extends React.Component {\n  constructor(props) {\n    super(props); // TODO lift up the nav states to the app so that the content can make us of the pages\n\n    this.state = {\n      navs: {\n        home: false,\n        user: false,\n        sessions: false,\n        series: false,\n        logout: false\n      }\n    };\n    this.handleClick = this.handleClick.bind(this);\n  }\n\n  handleClick(event) {\n    id = event.target.id.substring(4);\n\n    if (id == logout) {\n      Cookies.remove('token');\n      this.props.onLogout();\n    } // TODO active class handling\n\n  }\n\n  render() {\n    return /*#__PURE__*/React.createElement(\"nav\", {\n      className: \"nav\"\n    }, /*#__PURE__*/React.createElement(\"ul\", null, /*#__PURE__*/React.createElement(\"li\", {\n      className: \"nav-link nav-home\",\n      id: \"nav-home\",\n      onClick: this.handleClick\n    }, /*#__PURE__*/React.createElement(\"i\", {\n      className: \"bi bi-house-fill\"\n    }), /*#__PURE__*/React.createElement(\"span\", null, \"Home\")), /*#__PURE__*/React.createElement(\"li\", {\n      className: \"nav-link nav-user\",\n      id: \"nav-user\",\n      onClick: this.handleClick\n    }, /*#__PURE__*/React.createElement(\"i\", {\n      className: \"bi bi-person-circle\"\n    }), /*#__PURE__*/React.createElement(\"span\", null, \"User\")), /*#__PURE__*/React.createElement(\"li\", {\n      className: \"nav-link nav-sessions\",\n      id: \"nav-sessions\",\n      onClick: this.handleClick\n    }, /*#__PURE__*/React.createElement(\"i\", {\n      className: \"bi bi-calendar-event-fill\"\n    }), /*#__PURE__*/React.createElement(\"span\", null, \"Session\")), /*#__PURE__*/React.createElement(\"li\", {\n      className: \"nav-link nav-series\",\n      id: \"nav-series\",\n      onClick: this.handleClick\n    }, /*#__PURE__*/React.createElement(\"i\", {\n      className: \"bi bi-calendar-range-fill\"\n    }), /*#__PURE__*/React.createElement(\"span\", null, \"Series\")), /*#__PURE__*/React.createElement(\"li\", {\n      className: \"nav-link nav-logout\",\n      id: \"nav-logout\",\n      onClick: this.handleClick\n    }, /*#__PURE__*/React.createElement(\"i\", {\n      className: \"bi bi-box-arrow-left\"\n    }), /*#__PURE__*/React.createElement(\"span\", null, \"Logout\"))));\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/Nav.js?");

/***/ }),

/***/ "./static/js/components/Sidebar.js":
/*!*****************************************!*\
  !*** ./static/js/components/Sidebar.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Sidebar)\n/* harmony export */ });\n/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Nav */ \"./static/js/components/Nav.js\");\n/* harmony import */ var _Logo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logo */ \"./static/js/components/Logo.js\");\n\n\nclass Sidebar extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(_Logo__WEBPACK_IMPORTED_MODULE_1__.default, null), /*#__PURE__*/React.createElement(_Nav__WEBPACK_IMPORTED_MODULE_0__.default, {\n      token: this.props.token,\n      onLogout: this.props.onLogout\n    }));\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/Sidebar.js?");

/***/ }),

/***/ "./static/js/components/SignUp.js":
/*!****************************************!*\
  !*** ./static/js/components/SignUp.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SignUp)\n/* harmony export */ });\n/**\n * SignUp component \n */\nclass SignUp extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      fname: '',\n      lname: '',\n      email: '',\n      password: '',\n      rpassword: '',\n      terms: false,\n      error: false\n    };\n    this.handleChange = this.handleChange.bind(this);\n    this.handleSubmit = this.handleSubmit.bind(this);\n    this.handleCheck = this.handleCheck.bind(this);\n    this.handleInvalid = this.handleInvalid.bind(this);\n  }\n\n  handleChange(event) {\n    this.setState({\n      [event.target.name]: event.target.value\n    });\n  }\n\n  handleCheck(event) {\n    this.setState({\n      [event.target.name]: event.target.checked\n    });\n  }\n\n  handleInvalid(event) {\n    event.target.classList.add('invalid');\n  }\n\n  handleSubmit(event) {\n    let params = new URLSearchParams(this.state).toString();\n    console.log(params);\n    Cookies.set(\"this\", \"that\");\n    console.log(Cookies.get(\"this\"));\n    $.ajax({\n      url: '/auth/register',\n      type: 'POST',\n      data: params,\n      success: (data, status, jqXHR) => {\n        let token = handleToken(data);\n\n        if (token === null) {\n          this.setState({\n            error: 'Something went wrong please try again'\n          });\n        }\n\n        console.log('Token');\n        console.log(Cookies.get(\"token\"));\n      },\n      error: (jqXHR, status, error) => {\n        this.setState({\n          error: 'Something went wrong'\n        });\n      }\n    });\n    event.preventDefault();\n  }\n\n  render() {\n    return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"h1\", null, \"Register\"), this.state.error !== false && /*#__PURE__*/React.createElement(\"div\", {\n      class: \"alert alert-danger\",\n      role: \"alert\"\n    }, this.state.error), /*#__PURE__*/React.createElement(\"form\", {\n      onSubmit: this.handleSubmit\n    }, /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"text\",\n      name: \"fname\",\n      value: this.state.value,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoFocus: true,\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"text\",\n      name: \"lname\",\n      value: this.state.value,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"email\",\n      name: \"email\",\n      value: this.state.value,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"password\",\n      name: \"password\",\n      value: this.state.value,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"password\",\n      name: \"rpassword\",\n      value: this.state.value,\n      onChange: this.handleChange,\n      onInvalid: this.handleInvalid,\n      className: \"form-control\",\n      autoComplete: true,\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"checkbox\",\n      name: \"terms\",\n      value: this.state.value,\n      onChange: this.handleCheck,\n      className: \"form-check-input\",\n      required: true\n    })), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"mb-3\"\n    }, /*#__PURE__*/React.createElement(\"button\", {\n      type: \"submit\",\n      className: \"btn btn-primary\"\n    }, \"Register\"))));\n  }\n\n}\n\n//# sourceURL=webpack://project/./static/js/components/SignUp.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./static/js/App.js");
/******/ 	
/******/ })()
;