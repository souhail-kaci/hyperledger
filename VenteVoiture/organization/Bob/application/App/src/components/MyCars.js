import React from 'react';
import Car from "./Car";
import Alert from "./Alert";

const MyCars = ({cars, handleClick, handleCar, alert, setAlert, alertMessage, setFormSend,setAlertMessage}) => {
    const onClick = () => {
        handleCar(null);
        handleClick();
    }

    return <>
        <Alert
            message={alertMessage.message}
            classN={alertMessage.class}
            display={alert}
            setAlert={setAlert}
        />
        <button className="button is-primary is-pulled-right" onClick={onClick}>Add new Car</button>

        <div className="columns is-multiline">
            {cars.map(car =>
                <Car Car={car}
                     key={car.key}
                     handleCar={handleCar}
                     handleClick={handleClick}
                     setFormSend={setFormSend}
                     setAlert={setAlert}
                     setAlertMessage={setAlertMessage}
                />
            )}
        </div>
    </>

}
export default MyCars;
