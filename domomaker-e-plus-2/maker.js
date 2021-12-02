const { Unit } = require("../server/models");

// I. React Components
const UnitAppNavigation = () => (
  <nav>
    <div className="navlink"><a href="/logout">Log out</a></div>
  </nav>
);



class UnitForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      csrf: props.csrf,
      name: "",
      age: 0,
      mood: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUnit = this.handleUnit.bind(this);
    this.refreshUnits = this.refreshUnits.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  checkFields(){
   return !(this.state.name == '' || this.state.age == '' || this.state.mood == '');
  }

  createQuery(){
    const sanitize = str => encodeURIComponent(str.toString().trim());
    return `name=${sanitize(this.state.name)}&age=${sanitize(this.state.age)}&mood=${sanitize(this.state.mood)}&_csrf=${this.state.csrf}`;
  }

  refreshUnits(){
    console.log("refreshUnits");
    this.unitListRef.loadUnitsFromServer();
   }

  handleUnit(e){
    e.preventDefault();
    if(this.checkFields()){
      const method = "POST";
      const path = document.querySelector("#unitForm").getAttribute("action");
      const query = this.createQuery();
      const completionCallback = this.refreshUnits;
      sendAjax(method,path,query,completionCallback);
      this.setState( {name: "", vision: 0, level: ""} );
    }else{
      handleError("All fields are required");
      return false;
    }
  }

  render(){
    return (
      <form id="unitForm" 
          onSubmit={this.handleUnit}
          name="unitForm"
          action="/maker"
          method="POST"
          className="unitForm"
      >
        <label htmlFor="name">Name: </label>
        <input id="unitName" type="text" name="name" placeholder="Unit Name" value={this.state.name} onChange={this.handleChange}/>
        <label htmlFor="vision">Vision: </label>
        <input id="unitVision" type="text" name="vision" placeholder="Unit Name" value={this.state.vision} onChange={this.handleChange}/>
        <label htmlFor="level">Level: </label>
        <input id="unitLevel" type="number" name="level" value={this.state.level} onChange={this.handleChange}/>
        <label htmlFor="weapon">Weapon: </label>
        <input id="unitWeapon" type="text" name="name" placeholder="Unit Weapon" value={this.state.weapon} onChange={this.handleChange}/>
        <label htmlFor="artifact">Artifact: </label>
        <input id="unitArtifact" type="text" name="artifact" placeholder="Unit Artifact" value={this.state.artifact} onChange={this.handleChange}/>
        <input type="hidden" name="_csrf" value={this.state.csrf} />
        <input className="makeUnitSubmit" type="submit" value="Make Unit"/>
      </form>
    );
  }
}

class UnitList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      csrf: props.csrf,
      units: props.units,
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.loadUnitsFromServer = this.loadUnitsFromServer.bind(this);
    this.loadUnitsFromServer();
  }

  loadUnitsFromServer(){
    const completionCallback = data => this.setState( {units:data.units} );
    sendAjax('GET', '/getUnits', null, completionCallback);
   }

  handleDeleteClick(e){
    const method = "DELETE";
    const path = "/delete-unit";
    const unitId = e.currentTarget.getAttribute("unitid");
    const _csrf = document.querySelector("input[name='_csrf']").value;
    const query = `_csrf=${_csrf}&unitId=${unitId}`;
    const completionCallback = this.loadUnitsFromServer;
    sendAjax(method, path, query, completionCallback);
  }

  render(){
    console.log("render",this.state.units);
    if(this.state.units.length === 0){
      return (
        <div className="unitList">
          <h3 className="emptyUnit">No Units</h3>
        </div>
      );
    }

    const unitNodes = this.state.units.map(unit => {
      return (
        <div key={unit._id} className="unit">
          <img src="/assets/img/vision/anemo.png" alt="Unit type" className="unitType" />
          <h3 className="unitName"> Name: {unit.name} <button className="btnDelete" unitid={unit._id} onClick={this.handleDeleteClick}>Delete</button></h3>
          <h3 className="unitVision"> Vision: {unit.vision} </h3>
          <h3 className="unitLevel"> Level: {unit.level} </h3>
          <h3 className="unitWeapon"> Weapon: {unit.weapon} </h3>
          <h3 className="unitArtifact"> Artifact: {unit.artifact} </h3>
        </div>
      );
    });
  
    return (
      <div className="unitList">
        {unitNodes}
      </div>
    );
  }
}

class UnitApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      csrf: props.csrf
    };
  }

  componentDidMount(){
    // These 2 properties were initialized in `render()` below
    console.log("this.unitListRef=",this.unitListRef);
    console.log("this.unitFormRef=",this.unitFormRef);
    
    // Give the <UnitForm> a reference to the <UnitList> so that
    // it can tell the UnitList to update whenever a new Unit is added
    this.unitFormRef.unitListRef = this.unitListRef;
  }

  render(){
    return (
      <React.Fragment>
        <UnitAppNavigation />
        <section id="makeUnit">
          <UnitForm csrf={this.state.csrf} ref={ref => this.unitFormRef = ref}/>
        </section>
        <section id="units">
          <UnitList units={[]} ref={ref => this.unitListRef = ref} />
        </section>
        <UnitMessage />
      </React.Fragment>
    );
  }
}

// II. Helper Functions
const setup = csrf => {
  // note that #makeUnit and #units have been moved to UnitApp.render()
  // and that we now have an #app <div> in app.handlebars
  ReactDOM.render(
    <UnitApp csrf={csrf} />, document.querySelector("#app")
  );
};

const getToken = () => {
  const completionCallback = result => setup(result.csrfToken);
  sendAjax('GET', '/getToken', null, completionCallback);
};

// III. Initialization
window.onload = getToken;