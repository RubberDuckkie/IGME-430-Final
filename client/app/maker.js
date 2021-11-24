const handleUnit = (e) => {
    e.preventDefault();

    $("#unitMessage").animate({width:'hide'},350);

    if($("unitName").val() == '' || $("#unitVision").val() == '' || $("#unitLevel").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("unitForm").attr("action"), $("#unitForm").serialize(), function() {
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
            <input id="unitVision" type="text" name="vision" placeholder="Unit Vision"/>
            <label htmlFor="level">Level: </label>
            <input id="unitLevel" type="text" name="level" placeholder="Unit Level"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeUnitSubmit" type="submit" value="Make Unit" />
            
        </form>
        
    );
};

const UnitList = function(props) {
    if(props.units.length === 0){
        return (
            <div className="unitList">
                <h3 className="emptyUnit">No Units Yet</h3>
            </div>
        );
    }

    const unitNodes = props.units.map(function(unit) {
        return (
            <div key={unit._id} className="unit">
                <img src="/Media/imgs/primogem.png" alt="primogem" className="unitFace" />
                <h3 className="unitname">Name: {unit.name}</h3>
                <h3 className="unitVision">Vision: {unit.vision}</h3>
                <h3 className="unitLevel">Level: {unit.level}</h3>
                
            </div>
        );
    });

    return(
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

const setup = function(csrf) {
    ReactDOM.render(
        <UnitForm csrf={csrf} />, document.querySelector("#makeUnit")
    );

    ReactDOM.render(
        <UnitList units={[]} />, document.querySelector("#units")
    );

    loadUnitsFromServer();
};

const getToken = () => {
    sendAjax('Get', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});