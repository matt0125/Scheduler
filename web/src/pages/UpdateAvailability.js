body, html {
    background-color: #EDE7E3;
    font-family: Katibeh;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    height: 10vh;
}

.update-title {
    text-align: center;
    margin-bottom: 10px;
}

h1 {
    color: #49423E;
    text-align: left;
    font-family: Katibeh;
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin: 0;
}

h2 {
    font-size: 50px;
    color: #47413d;
    font-family: Katibeh;
    margin-top: 0;
    margin-bottom: auto;
    text-align: center;
}

h3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 25px;
}

.logo-container {
    margin-left: 10px;
    margin-top: 10px;
}

.logo {
    width: 50px;
    height: auto;
    margin-left: 10px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
}

.dropdown-container {
    display: flex;
    margin-bottom: 20px;
}


form {
    color: #000000;
}

.availabilities div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

label {
    margin-right: 10px;
    margin-left: 10px;
    display: flex;
    align-items: center;
}

::after {
    content: "";
    display: table;
    clear: both;
}

select {
    width: 150px;
    margin-bottom: 5px;
    margin-top: 2px;
    margin-right: 5px;
    background-color: #CDBFB6;
    color: #49423E;
    border: 2px solid #000000;
    border-radius: 4px;
    padding: 8px;
    font-family: Katibeh;
    font-size: 15px;
}

select[name="position"] {
    margin-left: 10px;
}

select, input[type="checkbox"] {
    margin-right: 10px;
}

/* checkbox */
input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 30px;
    height: 30px;
    border: 2px solid #000000;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    background-color: #CDBFB6;
    margin-right: 5px;
}

input[type="checkbox"]:checked::before {
    content: '\2714';
    font-size: 20px;
    color: #000000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.dropdown-container {
    display: flex;
    justify-content: center;
}

button {
    background-color: #B1947B;
    color: #000000;
    font-family: Katibeh;
    font-size: 15px;
    border-radius: 5px;
    border: 2px solid #000000;
    margin: 20px auto;
    width: 200px;
    height: 40px;
    display: flex;
    justify-content: center;
    line-height: 35px;
}

.background-square {
    background-color: #F8F8F8;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    max-width: 600px;
    box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
} 
