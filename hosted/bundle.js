"use strict";

var handleUnit = function handleUnit(e) {
  e.preventDefault();

  if ($("unitName").val() == '' || $("#unitVision").val() == '' || $("#unitLevel").val() == '' || $("#unitWeapon").val() == '') {
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
  }, /*#__PURE__*/React.createElement("input", {
    id: "unitName",
    type: "text",
    name: "name",
    placeholder: "Unit Name"
  }), /*#__PURE__*/React.createElement("input", {
    id: "unitVision",
    type: "text",
    name: "vision",
    placeholder: "Unit Vision"
  }), /*#__PURE__*/React.createElement("input", {
    id: "unitLevel",
    type: "text",
    name: "level",
    placeholder: "Unit Level"
  }), /*#__PURE__*/React.createElement("input", {
    id: "unitWeapon",
    type: "text",
    name: "weapon",
    placeholder: "Unit Weapon"
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
      src: "/Media/imgs/primogem.png",
      alt: "primogem",
      className: "unitFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "unitName"
    }, " Name: ", unit.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitVision"
    }, " Vision: ", unit.vision, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitLevel"
    }, " Level: ", unit.level, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitWeapon"
    }, " Weapon: ", unit.weapon, " "), /*#__PURE__*/React.createElement("form", {
      id: "unitDeleteForm",
      onSubmit: deleteUnit,
      name: "unitDeleteForm",
      action: "/delete",
      method: "DELETE"
    }, /*#__PURE__*/React.createElement("input", {
      className: "makeUnitSubmit",
      type: "submit",
      value: "Delete Unit"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: unit._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "unitList"
  }, unitNodes);
};

var loadUnitsFromServer = function loadUnitsFromServer() {
  sendAjax('GET', '/getToken', null, function (result) {
    sendAjax('GET', '/getUnits', null, function (data) {
      ReactDOM.render( /*#__PURE__*/React.createElement(UnitList, {
        units: data.units,
        csrf: result.csrfToken
      }), document.querySelector("#units"));
    });
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

var deleteUnit = function deleteUnit(e) {
  e.preventDefault();
  sendAjax('DELETE', $("#unitDeleteForm").attr("action"), {
    _id: e.target._id.value,
    _csrf: e.target._csrf.value
  }, function () {
    loadUnitsFromServer();
  });
  return false;
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
