import React from 'react';
import {set, useForm} from "react-hook-form";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import {MESSAGE} from "./AddCar";


const Car = ({Car, handleCar, handleClick, setAlertMessage,setAlert}) => {

    const {handleSubmit, formState} = useForm();
    const {isSubmitting, isSubmitted} = formState;

    const onClick = () => {
        handleCar(Car);
        handleClick();
    }
    const onSubmit = async () => {

        await axios.post("http://localhost:3001/api/car/sell", {
            ...Car,
            upForSale: !JSON.parse(Car.upForSale)
        })
        setAlert(true);
        setAlertMessage({
            message: MESSAGE.UPDATE ,
            class: MESSAGE.CLASS_SUCCES
        })
    }

    return (
        <div className="column is-6-desktop is-12-tablet ">
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-content ">
                            <p className="title is-4"> Owner : {Car.owner}
                                <button onClick={() => onClick()}
                                        className="button is-primary is-outlined is-rounded is-pulled-right"
                                >Modify
                                </button>
                            </p>
                            <p className="subtitle is-6">@{Car.owner}</p>
                            <div className="columns">
                                <div className="column is-12">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {isSubmitting ?
                                            <div className="column is-2 is-offset-5"><ClipLoader color="#3273dc"
                                                                                                 size={35}/></div>
                                            :
                                            <div className="column is-12">
                                                <input type="submit"
                                                       className="button is-link  is-outlined is-rounded is-fullwidth"
                                                       value={Car.upForSale === 'true' ? 'Remove from sale' : 'Put on sale'}
                                                />
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <table>
                            <tbody>
                            <tr>
                                <td>Car Brand :</td>
                                <td> {Car.carBrand}</td>
                            </tr>
                            <tr>
                                <td>car Model :</td>
                                <td> {Car.carModel}</td>
                            </tr>
                            <tr>
                                <td>price :</td>
                                <td> {Car.price}$</td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default Car;
