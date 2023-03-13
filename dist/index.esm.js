import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import React, { useReducer, useState, useEffect, createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import DOMPurify from 'dompurify';
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import axios from 'axios';
import Select from 'react-select';
import _typeof from '@babel/runtime/helpers/typeof';
import { Editor } from '@tinymce/tinymce-react';
import { RotatingTriangles } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * If the formInfo is null, remove the form from localStorage,
 * otherwise return the form with the formInfo.
 * @param form - the current state of the form
 * @param formInfo - This is the object that contains the form data.
 * @returns The reducer is returning a new object that is a combination of the
 * form object and the formInfo object.
 */
var reducer = function reducer(form, formInfo) {
  if (formInfo === null) {
    localStorage.removeItem('formData');
    return {};
  }
  return _objectSpread$7(_objectSpread$7({}, form), formInfo);
};

/* It's getting the form from localStorage. */
var localState = JSON.parse(localStorage.getItem('formData'));
var GlobalContext = /*#__PURE__*/createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setform.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global(_ref) {
  var children = _ref.children;
  var _useReducer = useReducer(reducer, localState || {}),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    formData = _useReducer2[0],
    setFormData = _useReducer2[1];
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    subData = _useState2[0],
    setSubData = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    locale = _useState4[0],
    setlocale = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    dmpId = _useState6[0],
    setdmpId = _useState6[1];
  useEffect(function () {
    /* It's setting the form in localStorage. */
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);
  return /*#__PURE__*/React.createElement(GlobalContext.Provider, {
    value: {
      formData: formData,
      setFormData: setFormData,
      subData: subData,
      setSubData: setSubData,
      locale: locale,
      setlocale: setlocale,
      dmpId: dmpId,
      setdmpId: setdmpId
    }
  }, children);
}

/**
 * It takes a JSON object and a list of keys, and returns a string that is the concatenation of the values of the keys in the JSON object
 * @param data - the data object
 * @param keys - ["$..name", "$..age", "$..address.street"]
 * @returns The value of the key in the object.
 */
function parsePattern(data, keys) {
  //https://www.measurethat.net/Benchmarks/Show/2335/1/slice-vs-substr-vs-substring-with-no-end-index
  var isArrayMatch = /^(.*)\[[0-9]+\]$/gi;
  return keys.map(function (value) {
    if (value.startsWith("$.")) {
      var path = value.substr(2).trim().split(".");
      return path.reduce(function (acc, cur) {
        if (isArrayMatch.test(cur)) {
          var arrayMatch = isArrayMatch.exec(cur);
          return acc === null || acc === void 0 ? void 0 : acc[arrayMatch === null || arrayMatch === void 0 ? void 0 : arrayMatch[1]][arrayMatch === null || arrayMatch === void 0 ? void 0 : arrayMatch[2]];
        }
        return acc === null || acc === void 0 ? void 0 : acc[cur];
      }, data);
    }
    return value;
  }).join("");
}

/**
 * It takes a string of HTML, sanitizes it, and returns an object with a property called __html that contains the sanitized HTML.
 * @param html - The HTML string to sanitize.
 * @returns A function that returns an object.
 */
function createMarkup(html) {
  return {
    __html: DOMPurify.sanitize(html)
  };
}

/**
 * It returns a new array with the item at the specified index removed.
 * @param list - the array you want to remove an item from
 * @param idx - the index of the item to be removed
 * @returns A new array with the item removed.
 */
function deleteByIndex(list, idx) {
  var newList = _toConsumableArray(list);
  if (idx > -1) {
    newList.splice(idx, 1); // 2nd parameter means remove one item only
  }

  return newList;
}

// This function takes two parameters, type and value.
//It checks the type parameter to determine which regular
//expression should be used to test the value parameter.
//If type is "email", it tests the value against a regular expression for
// email addresses. If type is "uri", it tests the value against
// a regular expression for uri's. If neither of these are true, it returns true.
function getCheckPatern(type, value) {
  var regExEmail = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  var regExUri = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  if (type === "email") {
    return regExEmail.test(value);
  } else if (type === "uri") {
    return regExUri.test(value);
  } else {
    return true;
  }
}

/**
 * It takes a standardTemplate object and a form object, and returns the first key of the form object that is required and empty
 * @param standardTemplate - {
 * @param form - {
 * @returns The first key of the object that has a value of "" or "<p></p>\n"
 */
function checkRequiredForm(standardTemplate, form) {
  if (!form) {
    return undefined;
  }
  var listRequired = standardTemplate === null || standardTemplate === void 0 ? void 0 : standardTemplate.required;
  //add not existe value to new object
  var newForm = listRequired.reduce(function (result, key) {
    result[key] = form[key] || "";
    return result;
  }, {});
  //check the empty object
  var filteredEntries = Object.entries(newForm).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return listRequired.includes(key) && (value === "" || value === "<p></p>" || value === "<p></p>\n");
  });
  var result = Object.fromEntries(filteredEntries);
  return Object.keys(result)[0];
}

/**
 * It takes a value and an object as parameters and returns the value of the key that matches the value parameter.
 * @param value - the key of the object
 * @param object - the object that contains the properties
 * @param locale - locale of the form
 * @returns The value of the key "form_label@fr_FR" if it exists, otherwise the value of the key "label@fr_FR"
 */
function getLabelName(value, object, locale) {
  var keyObject = object.properties;
  if (keyObject[value].hasOwnProperty("form_label@".concat(locale))) {
    return keyObject[value]["form_label@".concat(locale)];
  }
  return keyObject[value]["label@".concat(locale)];
}

/**
 * Reformats registry values into a readable object list
 * @param {*} registryValues 
 * @param {*} locale 
 * @returns a formatted tab with select options
 */
function createOptions(registryValues, locale) {
  return registryValues.map(function (option) {
    return {
      value: option.label ? option.label[locale] : option[locale],
      label: option.label ? option.label[locale] : option[locale],
      object: option
    };
  });
}

/**
 * It's a function that takes in a bunch of props and returns
 * a div with a label, an input, and a small tag.
 * @returns A React Component
 */
function InputText(_ref) {
  var label = _ref.label,
    type = _ref.type,
    placeholder = _ref.placeholder,
    name = _ref.name,
    changeValue = _ref.changeValue,
    tooltip = _ref.tooltip,
    hidden = _ref.hidden,
    isConst = _ref.isConst;
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    temp = _useContext.temp;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    text = _useState2[0],
    settext = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isRequired = _useState4[0],
    setisRequired = _useState4[1];

  /* It's setting the state of the form to the value of the isConst variable. */
  useEffect(function () {
    if (isConst !== false) {
      setFormData(_defineProperty({}, name, isConst));
    }
  }, []);
  useEffect(function () {
    settext(formData[name]);
  }, [formData[name]]);

  /**
   * It takes a number, formats it to a string, and then sets the
   * state of the text variable to that string.
   * @param e - The event object
   */
  var handleChangeInput = function handleChangeInput(e) {
    changeValue(e);
    // const formatedNumber = formatNumberWithSpaces(e.target.value);
    var isPattern = getCheckPatern(type, e.target.value);
    if (isPattern) {
      setisRequired(false);
    } else {
      setisRequired(true);
    }
    settext(e.target.value);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label"
  }, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: isConst === false ? temp ? temp[name] : text == null ? '' : text : isConst,
    className: isRequired ? 'form-control outline-red' : 'form-control',
    hidden: hidden,
    placeholder: placeholder,
    onChange: handleChangeInput,
    name: name,
    disabled: isConst !== false
  }));
}

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* A React component that renders a form with a text input and a button.
When the button is clicked, a new text input is added to the form. When the text
input is changed, the form is updated. */
function InputTextDynamicaly(_ref) {
  var label = _ref.label,
    name = _ref.name,
    tooltip = _ref.tooltip;
  var _useState = useState(['']),
    _useState2 = _slicedToArray(_useState, 2),
    formFields = _useState2[0],
    setFormFields = _useState2[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData;

  /**
   * When the form changes, update the form fields and set the form to the new data.
   */
  var handleFormChange = function handleFormChange(event, index) {
    var data = _toConsumableArray(formFields);
    data[index] = event.target.value;
    setFormFields(data);
    setFormData(_objectSpread$6(_objectSpread$6({}, formData), {}, _defineProperty({}, name, data)));
  };

  /**
   * When the addFields function is called, the setFormFields
   * function is called with the current formFields array and a new empty string.
   */
  var addFields = function addFields() {
    setFormFields([].concat(_toConsumableArray(formFields), ['']));
  };

  /**
   * If the formFields array has more than one element,
   * then remove the element at the index specified by the index parameter.
   */
  var removeFields = function removeFields(index) {
    if (formFields.length > 1) {
      var data = _toConsumableArray(formFields);
      data.splice(index, 1);
      setFormFields(data);
      setFormData(_objectSpread$6(_objectSpread$6({}, formData), {}, _defineProperty({}, name, data)));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement("label", null, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), formFields.map(function (form, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-9 mt-2"
    }, /*#__PURE__*/React.createElement("input", {
      className: "form-control",
      name: name,
      onChange: function onChange(event) {
        return handleFormChange(event, index);
      },
      value: form.name
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-3"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary px-3 m-2",
      onClick: addFields
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus",
      "aria-hidden": "true"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger px-3 m-2",
      onClick: function onClick() {
        return removeFields(index);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash",
      "aria-hidden": "true"
    })))));
  }));
}

function createHeaders() {
  var csrf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (csrf) {
    return {
      headers: {
        'X-CSRF-Token': csrf,
        'Content-Type': 'application/json'
      }
    };
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
}
function getFragment(_x) {
  return _getFragment.apply(this, arguments);
}
function _getFragment() {
  _getFragment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(id) {
    var response;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return axios.get("/madmp_fragments/".concat(id), createHeaders());
        case 3:
          response = _context.sent;
          _context.next = 10;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", _context.t0);
        case 10:
          return _context.abrupt("return", response);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _getFragment.apply(this, arguments);
}
function getSchema(_x2) {
  return _getSchema.apply(this, arguments);
}
function _getSchema() {
  _getSchema = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(id) {
    var response;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return axios.get("/madmp_schemas/".concat(id), createHeaders());
        case 3:
          response = _context2.sent;
          _context2.next = 10;
          break;
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", _context2.t0);
        case 10:
          return _context2.abrupt("return", response);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return _getSchema.apply(this, arguments);
}
function getRegistry(_x3) {
  return _getRegistry.apply(this, arguments);
}
function _getRegistry() {
  _getRegistry = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(id) {
    var response;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return axios.get("/registries/".concat(id), createHeaders());
        case 3:
          response = _context3.sent;
          _context3.next = 10;
          break;
        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", _context3.t0);
        case 10:
          return _context3.abrupt("return", response);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 6]]);
  }));
  return _getRegistry.apply(this, arguments);
}
function getContributors(_x4, _x5) {
  return _getContributors.apply(this, arguments);
}

/**
 * It sends a POST request to the server with the jsonObject as the body of the request.
 * </code>
 * @param jsonObject - the data you want to send to the server
 * @returns The response object from the server.
 */
function _getContributors() {
  _getContributors = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(dmpId, templateId) {
    var response;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return axios.get("/madmp_fragments/load_fragments?dmp_id=".concat(dmpId, "&schema_id=").concat(templateId), createHeaders());
        case 3:
          response = _context4.sent;
          _context4.next = 10;
          break;
        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", _context4.t0);
        case 10:
          return _context4.abrupt("return", response);
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return _getContributors.apply(this, arguments);
}
function saveForm(_x6, _x7) {
  return _saveForm.apply(this, arguments);
}
function _saveForm() {
  _saveForm = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(id, jsonObject) {
    var response, csrf;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          csrf = document.querySelector('meta[name="csrf-token"]').content;
          _context5.prev = 1;
          _context5.next = 4;
          return axios.post("/madmp_fragments/update_json/".concat(id), jsonObject, createHeaders(csrf));
        case 4:
          response = _context5.sent;
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          if (_context5.t0.response) {
            toast.error(_context5.t0.response.message);
          } else if (_context5.t0.request) {
            toast.error(_context5.t0.request);
          } else {
            toast.error(_context5.t0.message);
          }
        case 10:
          return _context5.abrupt("return", response);
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return _saveForm.apply(this, arguments);
}

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate(_ref) {
  var _subData$funder, _subData$funder2, _subData$funder3, _subData$funder4, _subData$funder4$data, _subData$funder5, _subData$funder5$data, _subData$funder6, _subData$funder6$data;
  var value = _ref.value,
    templateId = _ref.templateId,
    keyValue = _ref.keyValue,
    level = _ref.level,
    tooltip = _ref.tooltip,
    header = _ref.header;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    subData = _useContext.subData,
    setSubData = _useContext.setSubData,
    locale = _useContext.locale;
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    index = _useState4[0],
    setindex = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    template = _useState6[0],
    setTemplate = _useState6[1];
  useEffect(function () {
    getSchema(templateId).then(function (res) {
      setTemplate(res.data);
    });
  }, [templateId]);
  /**
   * The function sets the show state to false
   */
  var handleClose = function handleClose() {
    setShow(false);
    setSubData(null);
    setindex(null);
  };

  /**
   * If the subData variable is not empty, check if the form is valid, if it is,
   * add the subData variable to the form, if it's not, show an error message.
   */
  var handleAddToList = function handleAddToList() {
    if (!subData) return handleClose();
    var checkForm = checkRequiredForm(template, subData);
    if (checkForm) return toast.error("Veuiller remplir le champs ".concat(getLabelName(checkForm, template)));
    if (index !== null) {
      var deleteIndex = deleteByIndex(formData[keyValue], index);
      setFormData(_objectSpread$5(_objectSpread$5({}, formData), {}, _defineProperty({}, keyValue, [].concat(_toConsumableArray(deleteIndex), [subData]))));
      setSubData(null);
    } else {
      handleSave();
      toast.success("Enregistrement a été effectué avec succès !");
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the subData is set to null, and the modal is closed.
   */
  var handleSave = function handleSave() {
    var newObject = formData[keyValue] || [];
    newObject = [].concat(_toConsumableArray(newObject), [subData]);
    setFormData(_objectSpread$5(_objectSpread$5({}, formData), {}, _defineProperty({}, keyValue, newObject)));
    setSubData(null);
    handleClose();
  };

  /**
   * The function takes a boolean value as an argument and sets the state
   * of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  var handleShow = function handleShow(isOpen) {
    setShow(isOpen);
  };

  /**
   * When the user clicks the edit button, the form is populated with
   * the data from the row that was clicked.
   * @param idx - the index of the item in the array
   */
  var handleEdit = function handleEdit(idx) {
    console.log(formData[keyValue][idx]);
    setSubData(formData[keyValue][idx]);
    setShow(true);
    setindex(idx);
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  var handleDeleteListe = function handleDeleteListe(idx) {
    swal({
      title: "Ëtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cet élément ?",
      icon: "info",
      buttons: true,
      dangerMode: true
    }).then(function (willDelete) {
      if (willDelete) {
        var deleteIndex = deleteByIndex(formData[keyValue], idx);
        setFormData(_objectSpread$5(_objectSpread$5({}, formData), {}, _defineProperty({}, keyValue, deleteIndex)));
        // toast.success("Congé accepté");
        swal("Opération effectuée avec succès!", {
          icon: "success"
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("fieldset", {
    className: "sub-fragment border p-2 mb-2"
  }, /*#__PURE__*/React.createElement("legend", {
    className: "sub-fragment",
    "data-toggle": "tooltip",
    "data-original-title": tooltip
  }, value["form_label@".concat(locale)]), formData[keyValue] && template && /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: "20px"
    },
    className: "table table-bordered linked-fragments-list"
  }, /*#__PURE__*/React.createElement("thead", null, formData[keyValue].length > 0 && template && header && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, header), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, formData[keyValue].map(function (el, idx) {
    return /*#__PURE__*/React.createElement("tr", {
      key: idx
    }, /*#__PURE__*/React.createElement("td", {
      scope: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "preview",
      dangerouslySetInnerHTML: createMarkup(parsePattern(el, template.to_string))
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        width: "10%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, level === 1 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-primary",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleEdit(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-danger",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleDeleteListe(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times"
    }))))));
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary button-margin",
    onClick: function onClick() {
      return handleShow(true);
    }
  }, "Cr\xE9\xE9")), /*#__PURE__*/React.createElement(Modal, {
    show: show,
    onHide: handleClose
  }, /*#__PURE__*/React.createElement(Modal.Body, null, keyValue === "funding" && index !== null && subData && /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 funder"
  }, /*#__PURE__*/React.createElement("fieldset", {
    className: "sub-fragment registry"
  }, /*#__PURE__*/React.createElement("legend", {
    className: "sub-fragment registry legend"
  }, "Financeurs", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "registry-info fas fa-info-circle"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 fragment-display"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Nom du financeur : "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder = subData.funder) === null || _subData$funder === void 0 ? void 0 : _subData$funder.name)), /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Identifiant : "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder2 = subData.funder) === null || _subData$funder2 === void 0 ? void 0 : _subData$funder2.funderId)), /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Type d'identifiant :", " "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder3 = subData.funder) === null || _subData$funder3 === void 0 ? void 0 : _subData$funder3.idType)), /*#__PURE__*/React.createElement("fieldset", {
    className: "fragment-display sub-fragment"
  }, /*#__PURE__*/React.createElement("legend", {
    className: "legend"
  }, "Politique de donn\xE9es"), /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Titre : "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder4 = subData.funder) === null || _subData$funder4 === void 0 ? void 0 : (_subData$funder4$data = _subData$funder4.dataPolicy) === null || _subData$funder4$data === void 0 ? void 0 : _subData$funder4$data.title)), /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Identifiant : "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder5 = subData.funder) === null || _subData$funder5 === void 0 ? void 0 : (_subData$funder5$data = _subData$funder5.dataPolicy) === null || _subData$funder5$data === void 0 ? void 0 : _subData$funder5$data.docIdentifier)), /*#__PURE__*/React.createElement("div", {
    className: "fragment-property"
  }, /*#__PURE__*/React.createElement("span", {
    className: "property-label"
  }, "Type d'identifiant :", " "), /*#__PURE__*/React.createElement("span", {
    className: "property-value"
  }, subData === null || subData === void 0 ? void 0 : (_subData$funder6 = subData.funder) === null || _subData$funder6 === void 0 ? void 0 : (_subData$funder6$data = _subData$funder6.dataPolicy) === null || _subData$funder6$data === void 0 ? void 0 : _subData$funder6$data.idType)))))), /*#__PURE__*/React.createElement(BuilderForm, {
    shemaObject: template,
    level: level + 1
  })), /*#__PURE__*/React.createElement(Modal.Footer, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: handleClose
  }, "Fermer"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleAddToList
  }, "Enregistrer"))));
}

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function SelectContributor(_ref) {
  var label = _ref.label,
    name = _ref.name,
    changeValue = _ref.changeValue,
    templateId = _ref.templateId,
    keyValue = _ref.keyValue,
    level = _ref.level,
    tooltip = _ref.tooltip,
    header = _ref.header;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    list = _useState2[0],
    setlist = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    show = _useState4[0],
    setShow = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    options = _useState6[0],
    setoptions = _useState6[1];
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    selectObject = _useState8[0],
    setselectObject = _useState8[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    subData = _useContext.subData,
    setSubData = _useContext.setSubData,
    locale = _useContext.locale,
    dmpId = _useContext.dmpId;
  var _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    index = _useState10[0],
    setindex = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    template = _useState12[0],
    settemplate = _useState12[1];
  var _useState13 = useState(null),
    _useState14 = _slicedToArray(_useState13, 2),
    role = _useState14[0],
    setrole = _useState14[1];

  /* A hook that is called when the component is mounted. */
  useEffect(function () {
    getContributors(dmpId, templateId).then(function (res) {
      var builtOptions = res.data.results.map(function (option) {
        return {
          value: option.id,
          label: option.text,
          object: option
        };
      });
      setoptions(builtOptions);
    });
  }, []);

  /* A hook that is called when the component is mounted. */
  useEffect(function () {
    getSchema(templateId).then(function (res) {
      setrole(res.properties.role["const@".concat(locale)]);
      settemplate(res.properties.person.schema_id);
      var personTemplateId = res.properties.person.schema_id;
      getSchema(personTemplateId).then(function (resSchema) {
        settemplate(resSchema.data);
      });
      if (!formData[keyValue]) {
        return;
      }
      var pattern = res.to_string;
      if (!pattern.length) {
        return;
      }
      setlist(formData[keyValue].map(function (el) {
        return parsePattern(el, pattern);
      }));
    });
  }, [formData[keyValue], templateId]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  var handleClose = function handleClose() {
    setShow(false);
    setSubData(null);
    setindex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets the state of
   * the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  var handleShow = function handleShow(isOpen) {
    setShow(isOpen);
  };

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  var handleChangeList = function handleChangeList(e) {
    var pattern = template.to_string;
    var object = e.object,
      value = e.value;
    if (pattern.length > 0) {
      setselectObject([].concat(_toConsumableArray(selectObject), [object]));
      var parsedPatern = parsePattern(object, template.to_string);
      setlist([].concat(_toConsumableArray(list), [parsedPatern]));
      changeValue({
        target: {
          name: name,
          value: [].concat(_toConsumableArray(selectObject), [object])
        }
      });
      var newObject = {
        person: object,
        role: role
      };
      var arr3 = formData[keyValue] ? [].concat(_toConsumableArray(formData[keyValue]), [newObject]) : [newObject];
      setFormData(_objectSpread$4(_objectSpread$4({}, formData), {}, _defineProperty({}, keyValue, arr3)));
    } else {
      changeValue({
        target: {
          name: name,
          value: value
        }
      });
      setlist([].concat(_toConsumableArray(list), [value]));
    }
  };

  /**
   * I want to delete an item from a list and then update the state of the list.
   */
  var handleDeleteListe = function handleDeleteListe(idx) {
    swal({
      title: 'Ëtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cet élément ?',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then(function (willDelete) {
      if (willDelete) {
        var newList = _toConsumableArray(list);
        setlist(deleteByIndex(newList, idx));
        var deleteIndex = deleteByIndex(formData[keyValue], idx);
        setFormData(_objectSpread$4(_objectSpread$4({}, formData), {}, _defineProperty({}, keyValue, deleteIndex)));
        swal('Opération effectuée avec succès!', {
          icon: 'success'
        });
      }
    });
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  var handleAddToList = function handleAddToList() {
    if (index !== null) {
      var objectPerson = {
        person: subData,
        role: role
      };
      setFormData(_objectSpread$4(_objectSpread$4({}, formData), {}, _defineProperty({}, keyValue, [].concat(_toConsumableArray(deleteByIndex(formData[keyValue], index)), [objectPerson]))));
      var parsedPatern = parsePattern(subData, template.to_string);
      setlist([].concat(_toConsumableArray(deleteByIndex(_toConsumableArray(list), index)), [parsedPatern]));
    } else {
      handleSave();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setSubData(null);
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close the
   * modal and set the temporary person object to null.
   */
  var handleSave = function handleSave() {
    var objectPerson = {
      person: subData,
      role: role
    };
    setFormData(_objectSpread$4(_objectSpread$4({}, formData), {}, _defineProperty({}, keyValue, [].concat(_toConsumableArray(formData[keyValue] || []), [objectPerson]))));
    var parsedPatern = parsePattern(subData, template.to_string);
    setlist([].concat(_toConsumableArray(list), [parsedPatern]));
    handleClose();
    setSubData(null);
  };

  /**
   * It sets the state of the subData variable to the value of the form[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  var handleEdit = function handleEdit(idx) {
    setSubData(formData[keyValue][idx].person);
    setShow(true);
    setindex(idx);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-10"
  }, /*#__PURE__*/React.createElement(Select, {
    onChange: handleChangeList,
    options: options,
    name: name,
    defaultValue: {
      label: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.',
      value: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2",
    style: {
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
    className: "text-primary",
    href: "#",
    "aria-hidden": "true",
    onClick: handleShow
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus-square"
  }))))), formData[keyValue] && list && /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: '20px'
    },
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, formData[keyValue].length > 0 && header && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, header), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }))), /*#__PURE__*/React.createElement("tbody", null, formData[keyValue].map(function (el, idx) {
    return /*#__PURE__*/React.createElement("tr", {
      key: idx
    }, /*#__PURE__*/React.createElement("td", {
      scope: "row"
    }, /*#__PURE__*/React.createElement("p", {
      className: "border m-2"
    }, " ", list[idx], " ")), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '10%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, level === 1 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-primary",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleEdit(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-danger",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleDeleteListe(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times"
    }))))));
  })))), /*#__PURE__*/React.createElement(React.Fragment, null, template && /*#__PURE__*/React.createElement(Modal, {
    show: show,
    onHide: handleClose
  }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(BuilderForm, {
    shemaObject: template,
    level: level + 1
  })), /*#__PURE__*/React.createElement(Modal.Footer, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: handleClose
  }, "Fermer"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleAddToList
  }, "Enregistrer")))));
}

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function SelectMultipleList(_ref) {
  var label = _ref.label,
    registryId = _ref.registryId,
    name = _ref.name,
    changeValue = _ref.changeValue,
    tooltip = _ref.tooltip,
    header = _ref.header;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    list = _useState2[0],
    setlist = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    options = _useState4[0],
    setoptions = _useState4[1];
  var _useContext = useContext(GlobalContext),
    subData = _useContext.subData,
    setSubData = _useContext.setSubData,
    locale = _useContext.locale;

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(function () {
    var isMounted = true;
    var setOptions = function setOptions(data) {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistry(registryId).then(function (res) {
      setOptions(createOptions(res.data, locale));
    })["catch"](function (error) {
      // handle errors
    });
    return function () {
      isMounted = false;
    };
  }, [registryId, locale]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  var handleChangeList = function handleChangeList(e) {
    var copieList = [].concat(_toConsumableArray(list || []), [e.value]);
    changeValue({
      target: {
        name: name,
        value: _toConsumableArray(copieList)
      }
    });
    setlist(copieList);
  };

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(function () {
    if (subData) {
      setlist(subData[name]);
    }
  }, [subData]);

  /**
   * It creates a new array, then removes the item at the index specified by the parameter,
   * then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  var handleDeleteListe = function handleDeleteListe(idx) {
    swal({
      title: 'Ëtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cet élément ?',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then(function (willDelete) {
      if (willDelete) {
        var newList = _toConsumableArray(list);
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }

        setlist(newList);
        setSubData(_objectSpread$3(_objectSpread$3({}, subData), {}, _defineProperty({}, name, newList)));
        swal('Opération effectuée avec succès!', {
          icon: 'success'
        });
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-10"
  }, /*#__PURE__*/React.createElement(Select, {
    onChange: handleChangeList,
    options: options,
    name: name,
    defaultValue: {
      label: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.',
      value: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '20px 30px 20px 20px'
    }
  }, header && /*#__PURE__*/React.createElement("p", null, header), list && list.map(function (el, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "row border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-11"
    }, /*#__PURE__*/React.createElement("p", {
      className: "border m-2"
    }, " ", list[idx], " ")), /*#__PURE__*/React.createElement("div", {
      className: "col-md-1",
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-danger",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleDeleteListe(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times"
    })))));
  }))));
}

function SelectSingleList(_ref) {
  var label = _ref.label,
    propName = _ref.propName,
    changeValue = _ref.changeValue,
    tooltip = _ref.tooltip,
    registryId = _ref.registryId;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setoptions = _useState2[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    subData = _useContext.subData,
    locale = _useContext.locale;
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2);
    _useState4[0];
    var setError = _useState4[1];
  var value;
  if (subData && _typeof(subData[propName]) !== 'object') {
    value = subData[propName];
  } else if (formData && _typeof(formData[propName]) !== 'object') {
    value = formData[propName];
  } else {
    value = '';
  }
  /*
  A hook that is called when the component is mounted.
  It is used to set the options of the select list.
  */
  useEffect(function () {
    var isMounted = true;
    var setOptions = function setOptions(data) {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistry(registryId).then(function (res) {
      setOptions(createOptions(res.data, locale));
    })["catch"](function (err) {
      setError(err);
    });
    return function () {
      isMounted = false;
    };
  }, [registryId, locale]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  var handleChangeList = function handleChangeList(e) {
    if (propName === 'funder') {
      changeValue({
        target: {
          name: propName,
          value: e.object
        }
      });
    } else {
      changeValue({
        target: {
          name: propName,
          value: e.value
        }
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-10"
  }, /*#__PURE__*/React.createElement(Select, {
    onChange: handleChangeList,
    options: options,
    name: propName,
    inputValue: value
  })))));
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function SelectWithCreate(_ref) {
  var label = _ref.label,
    registryId = _ref.registryId,
    name = _ref.name,
    changeValue = _ref.changeValue,
    templateId = _ref.templateId,
    keyValue = _ref.keyValue,
    level = _ref.level,
    tooltip = _ref.tooltip,
    header = _ref.header;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    list = _useState2[0],
    setlist = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    show = _useState4[0],
    setShow = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    options = _useState6[0],
    setoptions = _useState6[1];
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    selectObject = _useState8[0],
    setselectObject = _useState8[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    subData = _useContext.subData,
    setSubData = _useContext.setSubData,
    locale = _useContext.locale;
  var _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    index = _useState10[0],
    setindex = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    template = _useState12[0],
    setTemplate = _useState12[1];

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(function () {
    getSchema(templateId).then(function (res) {
      setTemplate(res.data);
      if (formData[keyValue]) {
        var patern = res.data.to_string;
        if (patern.length > 0) {
          Promise.all(formData[keyValue].map(function (el) {
            return parsePattern(el, patern);
          })).then(function (listParsed) {
            setlist(listParsed);
          });
        }
      }
    });
  }, [templateId, formData[keyValue]]);

  /* A hook that is called when the component is mounted.
  It is used to set the options of the select list. */
  useEffect(function () {
    var isMounted = true;
    var setOptions = function setOptions(data) {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistry(registryId).then(function (res) {
      setOptions(createOptions(res.data, locale));
    })["catch"](function (error) {
      // handle errors
    });
    return function () {
      isMounted = false;
    };
  }, [registryId, locale]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  var handleClose = function handleClose() {
    setShow(false);
    setSubData(null);
    setindex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets the state of the
   * show variable to the value of the argument.
   * @param isOpen - boolean
   */
  var handleShow = function handleShow(isOpen) {
    setShow(isOpen);
  };

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  var handleChangeList = function handleChangeList(e) {
    var pattern = template.to_string;
    var parsedPatern = pattern.length > 0 ? parsePattern(e.object, pattern) : null;
    var updatedList = pattern.length > 0 ? [].concat(_toConsumableArray(list), [parsedPatern]) : [].concat(_toConsumableArray(list), [e.value]);
    setlist(updatedList);
    setselectObject(pattern.length > 0 ? [].concat(_toConsumableArray(selectObject), [e.object]) : selectObject);
    changeValue({
      target: {
        name: name,
        value: pattern.length > 0 ? [].concat(_toConsumableArray(selectObject), [e.object]) : e.value
      }
    });
    setFormData(_objectSpread$2(_objectSpread$2({}, formData), {}, _defineProperty({}, keyValue, formData[keyValue] ? [].concat(_toConsumableArray(formData[keyValue]), [e.object]) : [e.object])));
  };

  /**
   * It creates a new array, then removes the item at the index specified by the parameter,
   * then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  var handleDeleteListe = function handleDeleteListe(idx) {
    swal({
      title: 'Ëtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cet élément ?',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then(function (willDelete) {
      if (willDelete) {
        var newList = _toConsumableArray(list);
        setlist(deleteByIndex(newList, idx));
        var deleteIndex = deleteByIndex(formData[keyValue], idx);
        setFormData(_objectSpread$2(_objectSpread$2({}, formData), {}, _defineProperty({}, keyValue, deleteIndex)));
        swal('Opération effectuée avec succès!', {
          icon: 'success'
        });
      }
    });
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  var handleAddToList = function handleAddToList() {
    if (!subData) {
      handleClose();
      return;
    }
    var checkForm = checkRequiredForm(template, subData);
    if (checkForm) {
      toast.error("Veuiller remplire le champs ".concat(getLabelName(checkForm, template)));
    } else {
      if (index !== null) {
        var deleteIndex = deleteByIndex(formData[keyValue], index);
        var concatedObject = [].concat(_toConsumableArray(deleteIndex), [subData]);
        setFormData(_objectSpread$2(_objectSpread$2({}, formData), {}, _defineProperty({}, keyValue, concatedObject)));
        var newList = deleteByIndex(_toConsumableArray(list), index);
        var parsedPatern = parsePattern(subData, template.to_string);
        var copieList = [].concat(_toConsumableArray(newList), [parsedPatern]);
        setlist(copieList);
        setSubData(null);
        handleClose();
      } else {
        handleSave();
      }
      toast.success('Enregistrement a été effectué avec succès !');
    }
  };

  /**
   * I'm trying to add a new object to an array of objects, and then add that array to a new object.
   */
  var handleSave = function handleSave() {
    var newObject = formData[keyValue] ? [].concat(_toConsumableArray(formData[keyValue]), [subData]) : [subData];
    setFormData(_objectSpread$2(_objectSpread$2({}, formData), {}, _defineProperty({}, keyValue, newObject)));
    setlist([].concat(_toConsumableArray(list), [parsePattern(subData, template.to_string)]));
    handleClose();
    setSubData(null);
  };

  /**
   * It sets the state of the subData variable to the value of the formData[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  var handleEdit = function handleEdit(idx) {
    setSubData(formData[keyValue][idx]);
    setShow(true);
    setindex(idx);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("fieldset", {
    className: "sub-fragment registry"
  }, /*#__PURE__*/React.createElement("legend", {
    className: "sub-fragment",
    "data-toggle": "tooltip",
    "data-original-title": tooltip
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 dynamic-field"
  }, /*#__PURE__*/React.createElement(Select, {
    className: "form-control",
    onChange: handleChangeList,
    options: options,
    name: name,
    defaultValue: {
      label: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.',
      value: subData ? subData[name] : 'Sélectionnez une valeur de la liste ou saisissez une nouvelle.'
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
    className: "text-primary",
    href: "#",
    onClick: handleShow
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus-square"
  })))), formData[keyValue] && list && /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: '20px'
    },
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, formData[keyValue].length > 0 && header && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, header), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }))), /*#__PURE__*/React.createElement("tbody", null, formData[keyValue].map(function (el, idx) {
    return /*#__PURE__*/React.createElement("tr", {
      key: idx
    }, /*#__PURE__*/React.createElement("td", {
      scope: "row"
    }, /*#__PURE__*/React.createElement("p", {
      className: "border m-2"
    }, " ", list[idx], " ")), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '10%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, level === 1 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-primary",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleEdit(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-1"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      className: "text-danger",
      href: "#",
      "aria-hidden": "true",
      onClick: function onClick() {
        return handleDeleteListe(idx);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times"
    }))))));
  })))), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Modal, {
    show: show,
    onHide: handleClose
  }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(BuilderForm, {
    shemaObject: template,
    level: level + 1
  })), /*#__PURE__*/React.createElement(Modal.Footer, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: handleClose
  }, "Fermer"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleAddToList
  }, "Enregistrer")))));
}

function TinyArea(_ref) {
  var label = _ref.label,
    name = _ref.name,
    changeValue = _ref.changeValue,
    tooltip = _ref.tooltip,
    level = _ref.level;
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    temp = _useContext.temp;
  var _useState = useState('<p></p>'),
    _useState2 = _slicedToArray(_useState, 2),
    text = _useState2[0],
    settext = _useState2[1];
  useEffect(function () {
    var defaultValue = temp ? temp[name] : formData[name] ? formData[name] : '<p></p>';
    var updatedText = level === 1 ? defaultValue : temp ? temp[name] : '<p></p>';
    settext(updatedText);
  }, [level, name]);
  var handleChange = function handleChange(e) {
    changeValue({
      target: {
        name: name,
        value: e
      }
    });
    settext(e);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "form-group ticket-summernote mr-4 ml-4 border"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label mb-0 mt-2 text-lg"
  }, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement(Editor, {
    onEditorChange: function onEditorChange(newText) {
      return handleChange(newText);
    }
    // onInit={(evt, editor) => (editorRef.current = editor)}
    ,
    value: text,
    name: name,
    init: {
      branding: false,
      height: 230,
      menubar: false,
      plugins: ['table autoresize link paste advlist lists'],
      toolbar: 'bold italic underline | fontsizeselect forecolor | bullist numlist | link | table',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      skin_url: '/tinymce/skins/oxide',
      content_css: ['/tinymce/tinymce.css']
    }
  }));
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function SelectInvestigator(_ref) {
  var label = _ref.label,
    name = _ref.name,
    changeValue = _ref.changeValue,
    templateId = _ref.templateId,
    keyValue = _ref.keyValue,
    level = _ref.level,
    tooltip = _ref.tooltip;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    options = _useState4[0],
    setoptions = _useState4[1];
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    subData = _useContext.subData,
    setSubData = _useContext.setSubData,
    locale = _useContext.locale,
    dmpId = _useContext.dmpId;
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    index = _useState6[0],
    setindex = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    template = _useState8[0],
    setTemplate = _useState8[1];
  var _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    role = _useState10[0],
    setrole = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedValue = _useState12[0],
    setselectedValue = _useState12[1];

  /* A hook that is called when the component is mounted. */
  useEffect(function () {
    getContributors(dmpId, templateId).then(function (res) {
      var builtOptions = res.data.results.map(function (option) {
        return {
          value: option.id,
          label: option.text,
          object: option
        };
      });
      setoptions(builtOptions);
    });
  }, []);

  /* A hook that is called when the component is mounted. */
  useEffect(function () {
    getSchema(templateId).then(function (res) {
      var resTemplate = res.data;
      setrole(resTemplate.properties.role["const@".concat(locale)]);
      setTemplate(resTemplate.properties.person.schema_id);
      var subTemplateId = resTemplate.properties.person.schema_id;
      setrole(resTemplate.properties.role["const@".concat(locale)]);
      getSchema(subTemplateId).then(function (resSubTemplate) {
        setTemplate(resSubTemplate.data);
        if (!formData[keyValue]) {
          return;
        }
        var patern = resSubTemplate.data.to_string;
        if (!patern.length) {
          return;
        }
        setselectedValue(parsePattern(formData[keyValue].person, patern));
      });
    });
  }, [templateId]);

  /**
   * It closes the modal and resets the state of the modal.
   */
  var handleClose = function handleClose() {
    setShow(false);
    setSubData(null);
    setindex(null);
  };
  /**
   * The function takes a boolean value as an argument and sets
   * the state of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  var handleShow = function handleShow(isOpen) {
    setShow(isOpen);
  };
  var handleChangeList = function handleChangeList(e) {
    var patern = template.to_string;
    var _options$e$target$val = options[e.target.value],
      object = _options$e$target$val.object,
      value = _options$e$target$val.value;
    setselectedValue(options[e.target.value].value);
    if (patern.length > 0) {
      changeValue({
        target: {
          name: name,
          value: [object]
        }
      });
      setFormData(_objectSpread$1(_objectSpread$1({}, formData), {}, _defineProperty({}, keyValue, {
        person: object,
        role: role
      })));
    } else {
      changeValue({
        target: {
          name: name,
          value: value
        }
      });
    }
  };

  /**
   * If the index is not null, then delete the item at the index,
   * add the subData item to the end of the array,
   * and then splice the item from the list array.
   * If the index is null, then just save the item.
   */
  var handleAddToList = function handleAddToList() {
    // edit
    if (index !== null) {
      // const objectPerson = { person: subData, role: "from create" };
      setFormData(_objectSpread$1(_objectSpread$1({}, formData), {}, _defineProperty({}, keyValue, {
        person: subData,
        role: role
      })));
      setselectedValue(parsePattern(subData, template.to_string));
    } else {
      // save new
      handleSave();
    }
    toast.success('Enregistrement a été effectué avec succès !');
    setSubData(null);
    handleClose();
  };

  /**
   * When the user clicks the save button, the function will take the
   * temporary person object and add it to the form object, then it will parse the
   * temporary person object and add it to the list array, then it will close
   * the modal and set the temporary person object to null.
   */
  var handleSave = function handleSave() {
    // const objectPerson = { person: subData, role: "from create" };
    setFormData(_objectSpread$1(_objectSpread$1({}, formData), {}, _defineProperty({}, keyValue, {
      person: subData,
      role: role
    })));
    handleClose();
    setSubData(null);
    setselectedValue(parsePattern(subData, template.to_string));
  };
  /**
   * It sets the state of the subData variable to the value of the form[keyValue][idx] variable.
   * @param idx - the index of the item in the array
   */
  var handleEdit = function handleEdit(idx) {
    setSubData(formData[keyValue].person);
    setShow(true);
    setindex(idx);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, label), tooltip && /*#__PURE__*/React.createElement("span", {
    className: "m-4",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: tooltip
  }, "?"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-10"
  }, options && /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    onChange: handleChangeList
  }, /*#__PURE__*/React.createElement("option", null, "S\xE9lectionnez une valeur de la liste ou saisissez une nouvelle."), options.map(function (o, idx) {
    return /*#__PURE__*/React.createElement("option", {
      key: idx,
      value: o.value
    }, o.label);
  }), ";")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2",
    style: {
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
    className: "text-primary",
    href: "#",
    "aria-hidden": "true",
    onClick: handleShow
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus-square"
  }))))), selectedValue && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Valeur s\xE9lectionn\xE9e :"), " ", selectedValue, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: function onClick() {
      return handleEdit(0);
    }
  }, ' ', "(modifi\xE9)"))), /*#__PURE__*/React.createElement(React.Fragment, null, template && /*#__PURE__*/React.createElement(Modal, {
    show: show,
    onHide: handleClose
  }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(BuilderForm, {
    shemaObject: template,
    level: level + 1
  })), /*#__PURE__*/React.createElement(Modal.Footer, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: handleClose
  }, "Fermer"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleAddToList
  }, "Enregistrer")))));
}

function HandleGenerateForms(_ref) {
  var shemaObject = _ref.shemaObject,
    level = _ref.level,
    changeValue = _ref.changeValue;
  var _useContext = useContext(GlobalContext),
    locale = _useContext.locale,
    dmpId = _useContext.dmpId;
  if (!shemaObject) return false;
  var properties = shemaObject.properties;
  var data = [];
  // si type shema is an object
  // retun est code html
  if (shemaObject.type === 'object') {
    for (var _i = 0, _Object$entries = Object.entries(properties); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      var label = value["form_label@".concat(locale)];
      var tooltip = value["tooltip@".concat(locale)];
      var isConst = Object.prototype.hasOwnProperty.call(value, "const@".concat(locale)) ? value["const@".concat(locale)] : false;
      // condition 1
      if (value.type === 'string' || value.type === 'number') {
        // Condition 1.1
        // si inputType === textarea

        if (value.inputType === 'textarea') {
          data.push( /*#__PURE__*/React.createElement(TinyArea, {
            level: level,
            key: key,
            label: label,
            name: key,
            changeValue: changeValue,
            tooltip: tooltip
          }));
          // sethtmlGenerator(data);
        }
        // Condition 1.2
        // si inputType === dropdown
        if (value.inputType === 'dropdown' && Object.prototype.hasOwnProperty.call(value, 'registry_id')) {
          data.push( /*#__PURE__*/React.createElement(SelectSingleList, {
            label: label,
            propName: key,
            key: key,
            registryId: value.registry_id,
            changeValue: changeValue,
            tooltip: tooltip,
            level: level
          }));
        }
        // Condition 1.3
        // si on pas inputType propriete

        if (!Object.prototype.hasOwnProperty.call(value, 'inputType')) {
          data.push( /*#__PURE__*/React.createElement(InputText, {
            key: key,
            label: label,
            type: value.format ? value.format : value.type,
            placeholder: '',
            isSmall: false,
            smallText: '',
            name: key,
            changeValue: changeValue,
            hidden: !!value.hidden,
            tooltip: tooltip,
            isConst: isConst
          }));
        }
      }
      // condition 2
      if (value.type === 'array') {
        // condition 2.1
        // si inputType === dropdown et on n'a pas de registry_name
        if (value.inputType === 'dropdown' && Object.prototype.hasOwnProperty.call(value, 'registry_id')) {
          if (value.items.schema_id) {
            data.push( /*#__PURE__*/React.createElement(SelectWithCreate, {
              label: label,
              name: key,
              key: key,
              registryId: value.registry_id,
              changeValue: changeValue,
              templateId: value.items.schema_id,
              level: level,
              keyValue: key,
              header: value["table_header@".concat(locale)]
            }));
          } else {
            data.push( /*#__PURE__*/React.createElement(SelectMultipleList, {
              label: label,
              name: key,
              key: key,
              registryId: value.registry_id,
              changeValue: changeValue,
              tooltip: tooltip,
              level: level
            }));
          }
        } else {
          // si on a type === array et items.type === object
          if (value.items.type === 'object') {
            if (key === 'contributor' && value.items["class"] === 'Contributor') {
              data.push( /*#__PURE__*/React.createElement(SelectContributor, {
                label: label,
                name: key,
                key: key,
                changeValue: changeValue,
                templateId: value.items.schema_id,
                keyValue: key,
                level: level,
                tooltip: tooltip,
                header: value["table_header@".concat(locale)]
              }));
            } else {
              data.push( /*#__PURE__*/React.createElement(ModalTemplate, {
                key: key,
                tooltip: tooltip,
                value: value,
                templateId: value.items.schema_id,
                keyValue: key,
                level: level,
                header: value["table_header@".concat(locale)]
              }));
            }
          }
          if (value.items.type === 'string') {
            data.push( /*#__PURE__*/React.createElement(InputTextDynamicaly, {
              key: key,
              label: label,
              name: key,
              tooltip: tooltip
            }));
          }
        }
      }
      // condition 3
      if (value.type === 'object') {
        // condition 3.1

        if (Object.prototype.hasOwnProperty.call(value, 'schema_id')) {
          // console.log(" Sous fragment unique (sous formulaire)");
          if (value.inputType === 'pickOrCreate') {
            data.push( /*#__PURE__*/React.createElement(ModalTemplate, {
              key: key,
              tooltip: tooltip,
              value: value,
              templateId: value.schema_id,
              keyValue: key,
              level: level,
              header: value["table_header@".concat(locale)]
            }));
          }
          if (value["class"] === 'Contributor') {
            // console.log("TODO : condition funder à voir");
            data.push( /*#__PURE__*/React.createElement(SelectInvestigator, {
              label: label,
              name: key,
              key: key,
              changeValue: changeValue,
              dmpId: dmpId,
              templateId: value.schema_id,
              keyValue: key,
              level: level,
              tooltip: tooltip
            }));
          }
        }
        // codition 3.2
        if (value.inputType === 'dropdown') {
          if (Object.prototype.hasOwnProperty.call(value, 'registry_id')) {
            data.push( /*#__PURE__*/React.createElement(SelectSingleList, {
              registryId: value.registry_id,
              label: label,
              propName: key,
              changeValue: changeValue,
              tooltip: tooltip,
              level: level
            }));
          }
        }
      }
    }
  }
  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function BuilderForm(_ref) {
  var shemaObject = _ref.shemaObject,
    level = _ref.level;
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    subData = _useContext.subData,
    setSubData = _useContext.setSubData;

  /**
   * Object destructuring
   * If the level is 1, then set the form state to the value of the event target.
   *  If the level is not 1, then set the objectToAdd state to the value of the
   * event target.
   * @param event - the event that is triggered when the input is changed
   */
  var changeValue = function changeValue(event) {
    var _event$target = event.target,
      name = _event$target.name,
      value = _event$target.value;
    level === 1 ? setFormData(_objectSpread(_objectSpread({}, formData), {}, _defineProperty({}, name, value))) : setSubData(_objectSpread(_objectSpread({}, subData), {}, _defineProperty({}, name, value)));
  };

  /**
   * It takes a JSON object and returns a React component
   * @returns An array of React components.
   */

  return /*#__PURE__*/React.createElement(HandleGenerateForms, {
    shemaObject: shemaObject,
    level: level,
    changeValue: changeValue
  });
}

function CustomSpinner() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(RotatingTriangles, {
    visible: true,
    height: "80",
    width: "80",
    colors: ['#2c7dad', '#c6503d', '#FFCC00'],
    ariaLabel: "rotating-triangels-loading",
    wrapperStyle: {},
    wrapperClass: "rotating-triangels-wrapper"
  }));
}

function DynamicForm(_ref) {
  var fragmentId = _ref.fragmentId,
    dmpId = _ref.dmpId,
    _ref$locale = _ref.locale,
    locale = _ref$locale === void 0 ? 'en_GB' : _ref$locale;
  var _useContext = useContext(GlobalContext),
    formData = _useContext.formData,
    setFormData = _useContext.setFormData,
    setlocale = _useContext.setlocale,
    setdmpId = _useContext.setdmpId;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    error = _useState4[0];
    _useState4[1];
  // eslint-disable-next-line global-require
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    standardTemplate = _useState6[0],
    setStandardTemplate = _useState6[1];
  useEffect(function () {
    setLoading(true);
    setlocale(locale);
    setdmpId(dmpId);
    getFragment(fragmentId).then(function (res) {
      setStandardTemplate(res.data.schema);
      setFormData(res.data.fragment);
    })["catch"](console.error)["finally"](function () {
      return setLoading(false);
    });
  }, [fragmentId]);

  /**
   * It checks if the form is filled in correctly.
   * @param e - the event object
   */
  var handleSaveForm = function handleSaveForm(e) {
    e.preventDefault();
    setLoading(true);
    var checkForm = checkRequiredForm(standardTemplate, formData);
    if (checkForm) {
      toast.error("Veuiller remplir le champ ".concat(getLabelName(checkForm, standardTemplate, locale)));
    } else {
      saveForm(fragmentId, formData).then(function (res) {
        toast.success(res.data.message);
      })["catch"](function (error) {
        toast.success(error.data.message);
      })["finally"](function () {
        return setLoading(false);
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, loading && /*#__PURE__*/React.createElement("div", {
    className: "overlay"
  }, /*#__PURE__*/React.createElement(CustomSpinner, null)), !loading && error && /*#__PURE__*/React.createElement("p", null, "error"), !loading && !error && standardTemplate && /*#__PURE__*/React.createElement("div", {
    className: "m-4"
  }, /*#__PURE__*/React.createElement(BuilderForm, {
    shemaObject: standardTemplate,
    level: 1
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveForm,
    className: "btn btn-primary m-4"
  }, "Save")));
}
DynamicForm.propTypes = {
  fragmentId: PropTypes.number,
  dmpId: PropTypes.number,
  schemaId: PropTypes.number,
  locale: PropTypes.string
};

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormRoot = /*#__PURE__*/function (_React$Component) {
  _inherits(FormRoot, _React$Component);
  var _super = _createSuper(FormRoot);
  function FormRoot() {
    _classCallCheck(this, FormRoot);
    return _super.apply(this, arguments);
  }
  _createClass(FormRoot, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(Global, null, /*#__PURE__*/React.createElement(DynamicForm, {
        schemaId: this.props.schemaId,
        dmpId: this.props.dmpId,
        fragmentId: this.props.fragmentId,
        locale: this.props.locale
      }), /*#__PURE__*/React.createElement(Toaster, {
        position: "top-center",
        reverseOrder: false
      }));
    }
  }]);
  return FormRoot;
}(React.Component);
FormRoot.propTypes = {
  fragmentId: PropTypes.number,
  dmpId: PropTypes.number,
  schemaId: PropTypes.number,
  locale: PropTypes.string
};

var returnLibrary = function returnLibrary() {
  return {
    FormRoot: FormRoot
    // you can add here other components that you want to export
  };
};

var index = returnLibrary();

export { index as default };
