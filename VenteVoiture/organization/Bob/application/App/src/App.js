import './App.css';
import '../node_modules/bulma/css/bulma.min.css'
import axios from "axios";
import React, {useEffect, useState} from 'react';
import Navbar from "./components/Navbar";
import AddCar from "./components/AddCar";
import AsideBar from "./components/AsideBar";
import {Route, Switch} from 'react-router-dom';
import MyCars from "./components/MyCars";
import CarsToBuy from "./components/CarsToBuy";

export const carState = {
    FOR_SALE: true,
    NOT_FOR_SALE: false
};

function App() {
    const [state, setState] = useState(() => []);
    const [carForm, setCarForm] = useState(false);
    const [formeSend, setFormSend] = useState(true);
    const [car, setCar] = useState(null);
    const [carsToBuy, setCarsToBuy] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertBuy, setAlertBuy] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        message: "",
        class: ""
    });
    const [ws, setWss] = useState(() => new WebSocket('ws://localhost:3001'));

    useEffect(() => {
        ws.onopen = (event) => {
            console.log("We are connected.");
        };
        ws.onmessage = (event) => {
            setFormSend(true);
        };

    }, []);

    useEffect(() => {
        if (formeSend) {
            axios.get('http://localhost:3001/api/cars/Bob')
                .then(response => {
                    setState(_ => response.data.map(donne => donne.Record))
                    axios.get('http://localhost:3001/api/cars/Alice', {
                        params: {
                            client: 'Bob'
                        }
                    }).then(response => {
                        setCarsToBuy(_ => response.data.map(donne => donne.Record))
                    })
                });

            setFormSend(false);
        }
    }, [formeSend])


    function handleClick() {
        setCarForm(prev => !prev);
    }

    return (
        <div>
            <Navbar/>
            <AddCar display={carForm === true ? 'is-active' : ''}
                    handlClick={handleClick}
                    setFormSend={setFormSend}
                    setCarForm={setCarForm}
                    car={car}
                    carForm={carForm}
                    setAlert={setAlert}
                    setAlertMessage={setAlertMessage}
            />

            <div className="container mt-6">

                <div className="columns">
                    <div className="column is-2">
                        <AsideBar/>
                    </div>
                    <div className="column is-10">
                        <Switch>
                            <Route exact path="/myCars">
                                <MyCars
                                    cars={state}
                                    handleClick={handleClick}
                                    handleCar={setCar}
                                    setAlert={setAlert}
                                    alert={alert}
                                    alertMessage={alertMessage}
                                    setFormSend={setFormSend}
                                    setAlertMessage={setAlertMessage}

                                />
                            </Route>

                            <Route exact path="/carToBuy">
                                <CarsToBuy
                                    cars={carsToBuy}
                                    setFormSend={setFormSend}
                                    alertBuy={alertBuy}
                                    alertMessage={alertMessage}
                                    setAlertBuy={setAlertBuy}
                                />

                            </Route>
                        </Switch>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;
