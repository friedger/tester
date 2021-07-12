"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserData = getUserData;
exports.getPerson = getPerson;
exports.putStxAddress = putStxAddress;
exports.authenticate = exports.authOptions = exports.storage = exports.userSession = exports.STX_JSON_PATH = exports.appConfig = void 0;

var _profile = require("@stacks/profile");

var _transactions = require("@stacks/transactions");

var _encryption = require("@stacks/encryption");

var _storage = require("@stacks/storage");

var _account = require("lib/user/account");

var _react = require("react");

var _connectReact = require("@stacks/connect-react");

var _connect = require("@stacks/connect");

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var appConfig = new _connectReact.AppConfig(["store_write", "publish_data"]);
exports.appConfig = appConfig;
var STX_JSON_PATH = "stx.json";
exports.STX_JSON_PATH = STX_JSON_PATH;
var userSession = new _connectReact.UserSession({
  appConfig: appConfig
});
exports.userSession = userSession;
var storage = new _storage.Storage({
  userSession: userSession
});
exports.storage = storage;
var appDetails = {
  name: "Todos",
  icon: window.location.origin + "/logo.svg"
};
var authOptions = {
  authOrigin: _constants.authOrigin,
  userSession: userSession,
  redirectTo: "/",
  manifestPath: "/manifest.json",
  appDetails: appDetails
};
exports.authOptions = authOptions;

var authenticate = function authenticate(setIsNewSignIn, setIsSignedIn) {
  (0, _connect.showConnect)(_objectSpread({}, authOptions, {
    onFinish: function onFinish() {
      var userData;
      return regeneratorRuntime.async(function onFinish$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userData = userSession.loadUserData(); // console.log(getPublicKeyFromPrivate(userData.appPrivateKey))
              // const { address, publicKey } = getStacksAccount(userData.appPrivateKey);
              // console.log(publicKeyToString(publicKey));
              // console.log(publicKeyToAddress(26, publicKey));

              setIsNewSignIn(true);
              setIsSignedIn(true);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }));
};

exports.authenticate = authenticate;

function getUserData() {
  return userSession.loadUserData();
}

function getPerson() {
  return new _profile.Person(getUserData().profile);
}

function afterSTXAddressPublished() {
  console.log("STX address published");
  stxAddressSemaphore.putting = false;
}

var stxAddressSemaphore = {
  putting: false
};

function putStxAddress(userSession, address) {
  var storage = new _storage.Storage({
    userSession: userSession
  });

  if (!stxAddressSemaphore.putting) {
    stxAddressSemaphore.putting = true;
    storage.putFile(STX_JSON_PATH, JSON.stringify({
      address: address
    }), {
      encrypt: false
    }).then(function () {
      return afterSTXAddressPublished();
    })["catch"](function (r) {
      storage.getFile(STX_JSON_PATH, {
        decrypt: false
      }).then(function (s) {
        console.log({
          s: s
        });
        storage.putFile(STX_JSON_PATH, JSON.stringify({
          address: address
        }), {
          encrypt: false
        }).then(function () {
          return afterSTXAddressPublished();
        })["catch"](function (r) {
          console.log("STX address NOT published");
          console.log(r);
          stxAddressSemaphore.putting = false;
        });
      });
    });
  }
}