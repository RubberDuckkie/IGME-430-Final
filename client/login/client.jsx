
const handleLogin = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    console.log($("#signupForm").serialize());
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        console.log($("pass").val(), $("#pass2").val());
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const handleChange = (e) => {
    console.log($("#changeForm").serialize());
    e.preventDefault();

    if ($("#user").val() == '' || $("#oldpass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#newpass").val() !== $("#newpass2").val()) {
        console.log($("pass").val(), $("#pass2").val());
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
           <input id="user" type="text" name="username" placeholder="username" /> 
           <br></br>
           <label htmlFor="username" className="loginText">Username</label>
           <br></br>
           <input id="pass" type="password" name="pass" placeholder="password" />
           <br></br>
           <label htmlFor="pass" className="loginText">Password</label>
           <br></br>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign In" />

        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <input id="user" type="text" name="username" placeholder="username" /> 
            <br></br>
            <label htmlFor="username">Username</label>
            <br></br> 
            <input id="pass" type="password" name="pass" placeholder="password" />
            <br></br>
            <label htmlFor="pass">Password</label>
            <input id="pass2" type="password" name="pass2" placeholder="password" />
            <br></br>
            <label htmlFor="pass2">Confirm Password</label>
            <br></br>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
};

const ChangeWindow = (props) => {
    return (
        <form id="changeForm" 
            name="changeForm"
            onSubmit={handleChange}
            action="/passchange"
            method="POST"
            className="changeForm"
        >
            
            <input id="user" type="text" name="username" placeholder="username" />
            <br></br>
            <label htmlFor="username">Username</label>
            <br></br>
            <input id="oldPass" type="password" name="oldPass" placeholder="old password" />
            <br></br>
            <label htmlFor="oldPass">Old Password</label>
            <br></br>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <br></br>
            <label htmlFor="pass">New Password</label>
            <br></br>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <br></br>
            <label htmlFor="pass2">New Password 2</label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="passSubmit" type="submit" value="Change Password" />
        </form>
    );
};


const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createChangeWindow = (csrf) => {
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changeButton = document.querySelector("#changeButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangeWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
