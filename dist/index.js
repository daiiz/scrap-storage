'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrapStorage = function () {
  function ScrapStorage() {
    var _this = this;

    var projectName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ScrapStorage);

    this.projectName = projectName;
    this.scrapboxUrl = 'https://scrapbox.io';

    this.lines = {
      put: function put(args) {
        return _this.putLine(args);
      },
      get: function get(args) {
        return _this.getLines(args);
      },
      getMeta: function getMeta(args) {
        return _this.getLinesMeta(args);
      }
    };
  }

  _createClass(ScrapStorage, [{
    key: '_getProjectUrl',
    value: function _getProjectUrl() {
      if (!this.projectName) return null;
      return this.scrapboxUrl + '/' + this.projectName;
    }
  }, {
    key: '_getPageAPIEndpoint',
    value: function _getPageAPIEndpoint(pageName) {
      if (!this.projectName || !pageName) return null;
      return this.scrapboxUrl + '/api/pages/' + this.projectName + '/' + pageName;
    }
  }, {
    key: '_fetchRawLines',
    value: async function _fetchRawLines(pageTitle) {
      if (!pageTitle) return [];
      var apiEndpoint = this._getPageAPIEndpoint(pageTitle);
      if (!apiEndpoint) return [];
      var res = await _superagent2.default.get(apiEndpoint);
      if (!res.body || !res.body.lines || res.body.lines <= 0) return [];
      // title行を除外
      var lines = res.body.lines.slice(1);
      return lines;
    }
  }, {
    key: 'putLine',
    value: function putLine(_ref) {
      var key = _ref.key,
          lines = _ref.lines,
          metas = _ref.metas;

      var projectUrl = this._getProjectUrl();
      var pageTitle = key;
      if (!projectUrl) return [];
      var body = lines.join('\n');
      if (metas && metas.length > 0) body += '[hr.icon]\n' + metas.join('\n');
      body = window.encodeURIComponent(body);
      var scrapboxPageUrl = projectUrl + '/' + pageTitle + '?body=' + body;
      window.open(scrapboxPageUrl);
    }
  }, {
    key: 'getLines',
    value: async function getLines(_ref2) {
      var key = _ref2.key;

      var lines = await this._fetchRawLines(key);
      var lineTexts = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          var text = line.text;
          // [hr.icon] に達したら終了
          if (text.trim() === '[hr.icon]') break;
          if (text.length === 0) continue;
          lineTexts.push(text);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return lineTexts;
    }
  }, {
    key: 'getLinesMeta',
    value: async function getLinesMeta(_ref3) {
      var key = _ref3.key;

      var lines = await this._fetchRawLines(key);
      var metaTexts = [];
      var isMetaLine = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var line = _step2.value;

          var text = line.text;
          if (text.trim() === '[hr.icon]') {
            isMetaLine = true;
            continue;
          }
          if (text.length === 0) continue;
          if (!isMetaLine) continue;
          lineTexts.push(text);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return lineTexts;
    }
  }]);

  return ScrapStorage;
}();

exports.default = ScrapStorage;