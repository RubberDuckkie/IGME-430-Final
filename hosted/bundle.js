"use strict";

//handles part of the unit form
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

//Makes the unit form to add to the database
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

//displays the units made by the ownder
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
      src: "/assets/img/character_icon.png",
      alt: "primogem",
      className: "unitFace Icon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "unitName Name"
    }, " Name: ", unit.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitVision Vision"
    }, " Vision: ", unit.vision, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitLevel Level"
    }, " Level: ", unit.level, " "), /*#__PURE__*/React.createElement("h3", {
      className: "unitWeapon Weapon"
    }, " Weapon: ", unit.weapon, " "), /*#__PURE__*/React.createElement("form", {
      id: "unitDeleteForm",
      className: "Delete",
      onSubmit: deleteUnit,
      name: "unitDeleteForm",
      action: "/delete",
      method: "DELETE"
    }, /*#__PURE__*/React.createElement("input", {
      className: "makeUnitSubmit Delete",
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

//loads all the units made the user
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

//develops all of the units
var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UnitForm, {
    csrf: csrf
  }), document.querySelector("#makeUnit"));
  ReactDOM.render( /*#__PURE__*/React.createElement(UnitList, {
    units: []
  }), document.querySelector("#units"));
  loadUnitsFromServer();
};

//gets the csrf token
var getToken = function getToken() {
  sendAjax('Get', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

//removes the unit from the user's database
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

//handles errors
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

//brings the user to another page
var redirect = function redirect(response) {
  window.location = response.redirect;
};

//sends an ajax form
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
