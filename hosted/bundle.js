"use strict";

var handleUnit = function handleUnit(e) {
  e.preventDefault();
  $("#unitMessage").animate({
    width: 'hide'
  }, 350);

  if ($("unitName").val() == '' || $("#unitVision").val() == '' || $("#unitLevel").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("unitForm").attr("action"), $("#unitForm").serialize(), function () {
    loadUnitsFromServer();
  });
  return false;
};

var UnitForm = function UnitForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "unitForm",
    onSubmit: handleUnit,
    name: "unitForm",
    action: "/maker",
    method: "POST",
    className: "unitForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "unitName",
    type: "text",
    name: "name",
    placeholder: "Unit Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "vision"
  }, "Vision: "), /*#__PURE__*/React.createElement("input", {
    id: "unitVision",
    type: "text",
    name: "vision",
    placeholder: "Unit Vision"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "level"
  }, "Level: "), /*#__PURE__*/React.createElement("input", {
    id: "unitLevel",
    type: "text",
    name: "level",
    placeholder: "Unit Level"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeUnitSubmit",
    type: "submit",
    value: "Make Unit"
  }));
};

var UnitList = function UnitList(props) {
  if (props.units.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "unitList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyUnit"
    }, "No Units Yet"));
  }

  var unitNodes = props.units.map(function (unit) {
    return /*#__PURE__*/React.createElement("div", {
      key: unit._id,
      className: "unit"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/favicon.png",
      alt: "primogem",
      className: "unitFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "unitname"
    }, "Name: ", unit.name), /*#__PURE__*/React.createElement("h3", {
      className: "unitVision"
    }, "Vision: ", unit.vision), /*#__PURE__*/React.createElement("h3", {
      className: "unitLevel"
    }, "Level: ", unit.level));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "unitList"
  }, unitNodes);
};

var loadUnitsFromServer = function loadUnitsFromServer() {
  sendAjax('GET', '/getUnits', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(UnitList, {
      units: data.units
    }), document.querySelector("#units"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UnitForm, {
    csrf: csrf
  }), document.querySelector("#makeUnit"));
  ReactDOM.render( /*#__PURE__*/React.createElement(UnitList, {
    units: []
  }), document.querySelector("#units"));
  loadUnitsFromServer();
};

var getToken = function getToken() {
  sendAjax('Get', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      console.warn(xhr.responseText);
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
