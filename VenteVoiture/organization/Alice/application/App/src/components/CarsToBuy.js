import React, {useState} from 'react';
import CarToBuy from "./CarToBuy";
import CarBuyConfirmation from "./carBuyConfirmation";
import Alert from "./Alert";
const MESSAGE = {
    BUY: "Car has been bought successfully, A new block is created in the blockhain",
    CLASS: "is-success",
}
const CarsToBuy  = ({cars,setFormSend,alertBuy,setAlertBuy}) => {
    const [displayForm,setDisplayForm] = useState(false);
    const [selectedCar,setSelectedCar] = useState(null);

    return <>
        <CarBuyConfirmation
            displayForm={displayForm}
            setDisplayForm = {setDisplayForm}
            selectedCar = {selectedCar}
            setFormSend = {setFormSend}
            setAlert = {setAlertBuy}
        />
        <Alert
            message={MESSAGE.BUY}
            classN={MESSAGE.CLASS}
            display={alertBuy}
            setAlert = {setAlertBuy}
        />
        <div className="columns is-multiline">
            {cars.map(car =>
                <CarToBuy Car={car} key={car.key} setDisplayForm = {setDisplayForm} setSelectedCar={setSelectedCar}/>
            )}
        </div>
    </>


}
export default CarsToBuy;
