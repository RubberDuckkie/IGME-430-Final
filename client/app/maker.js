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
            <label htmlFor="name">Name: </label>
            <input id="unitName" type="text" name="name" placeholder="Unit Name" />
            <label htmlFor="vision">Vision: </label>
            <input id="unitVision" type="text" name="vision" placeholder="Unit Vision" />
            <label htmlFor="level">Level: </label>
            <input id="unitLevel" type="text" name="level" placeholder="Unit Level" />
            <label htmlFor="weapon">Weapon: </label>
            <input id="unitWeapon" type="text" name="name" placeholder="Unit Weapon" />
            <label htmlFor="artifact">Artifact: </label>
            <input id="unitArtifact" type="text" name="artifact" placeholder="Unit Artifact" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeUnitSubmit" type="submit" value="Make Unit" />

        </form>

    );
};

const handleDeleteClick = (e) => {
        const method = "DELETE";
        const path = "/delete-unit";
        const unitId = e.currentTarget.getAttribute("unitid");
        const _csrf = document.querySelector("input[name='_csrf']").value;
        const query = `_csrf=${_csrf}&unitId=${unitId}`;
        const completionCallback = loadUnitsFromServer;
        sendAjax('GET', $("unitForm").attr("action"), $("#unitForm").serialize(), function () {
            loadUnitsFromServer();
        });
    }



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
                <img src="/Media/imgs/primogem.png" alt="primogem" className="unitFace" />
                <h3 className="unitName"> Name: {unit.name} </h3>
                <h3 className="unitVision"> Vision: {unit.vision} </h3>
                <h3 className="unitLevel"> Level: {unit.level} </h3>
                <h3 className="unitWeapon"> Weapon: {unit.weapon} </h3>
                <h3 className="unitArtifact"> Artifact: {unit.artifact} </h3>
                <button className="btnDelete" onClick={handleDeleteClick}>Delete</button>
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
    sendAjax('GET', '/getUnits', null, (data) => {
        ReactDOM.render(
            <UnitList units={data.units} />, document.querySelector("#units")
        );
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

$(document).ready(function () {
    getToken();
});