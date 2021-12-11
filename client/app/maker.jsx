const handleUnit = (e) => {
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

const UnitForm = (props) => {
    return (

        <form id="unitForm" onSubmit={handleUnit}
            name="unitForm"
            action="/maker"
            method="POST"
            className="unitForm"
        >

            <input id="unitName" type="text" name="name" placeholder="Unit Name" />
            <input id="unitVision" type="text" name="vision" placeholder="Unit Vision" />
            <input id="unitLevel" type="text" name="level" placeholder="Unit Level" />
            <input id="unitWeapon" type="text" name="weapon" placeholder="Unit Weapon" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeUnitSubmit" type="submit" value="Make Unit" />

        </form>


    );
};


const UnitList = function (props) {

    if (props.units.length === 0) {
        return (
            <div className="unitList">
                <h3 className="emptyUnit">No Units Yet</h3>
            </div>
        );
    }



    const unitNodes = props.units.map(function (unit) {




        return (
            <div key={unit._id} className="unit">
                <img src="/assets/img/character_icon.png" alt="primogem" className="unitFace Icon" />
                <h3 className="unitName Name"> Name: {unit.name} </h3>
                <h3 className="unitVision Vision"> Vision: {unit.vision} </h3>
                <h3 className="unitLevel Level"> Level: {unit.level} </h3>
                <h3 className="unitWeapon Weapon"> Weapon: {unit.weapon} </h3>
                <form id="unitDeleteForm"
                    className="Delete"
                    onSubmit={deleteUnit}
                    name="unitDeleteForm"
                    action="/delete"
                    method="DELETE"
                >
                    <input className="makeUnitSubmit Delete" type="submit" value="Delete Unit" />
                    <input type="hidden" name="_id" value={unit._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />

                </form>
            </div>

        );
    });

    return (
        <div className="unitList">
            {unitNodes}
        </div>
    );
};

const loadUnitsFromServer = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        sendAjax('GET', '/getUnits', null, (data) => {
            ReactDOM.render(
                <UnitList units={data.units} csrf={result.csrfToken} />, document.querySelector("#units")
            );
        });
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <UnitForm csrf={csrf} />, document.querySelector("#makeUnit")
    );

    ReactDOM.render(
        <UnitList units={[]} />, document.querySelector("#units")
    );

    loadUnitsFromServer();
};

const getToken = () => {
    sendAjax('Get', '/getToken', null, (result) => {
        setup(result.csrfToken);

    });
};



const deleteUnit = (e) => {
    e.preventDefault();
    sendAjax('DELETE', $("#unitDeleteForm").attr("action"), { _id: e.target._id.value, _csrf: e.target._csrf.value }, function () {
        loadUnitsFromServer();
    });

    return false
};



$(document).ready(function () {
    getToken();
});