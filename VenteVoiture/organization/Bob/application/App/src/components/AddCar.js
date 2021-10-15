import React, {useState, useEffect} from 'react';
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import {useForm} from "react-hook-form";
import {carState} from "../App";

export const MESSAGE = {
    ADD: "Car has been added successfully, A new block is created in the blockhain",
    UPDATE: "Car has been updated successfully, A new block is created in the blockhain",
    ADD_ERROR: "Car with the same number has been already added, carNumber must be unique",
    CLASS_SUCCES: "is-success",
    CLASS_ERROR: "is-danger"
}

const AddCar = ({
                    car,
                    display,
                    handlClick,
                    setFormSend,
                    setCarForm,
                    carForm,
                    setAlert,
                    setAlertMessage
                }) => {
    const [color, setColor] = useState("#36D7B7");

    const {register, handleSubmit, formState, reset, setValue} = useForm({
        mode: "onChange",
    });
    const {errors, isValid, isSubmitting, isSubmitted} = formState;


    useEffect(() => {
        if (car) {
            setValue("carNumber", car.carNumber, {shouldValidate: true});
            setValue("carBrand", car.carBrand, {shouldValidate: true});
            setValue("carModel", car.carModel, {shouldValidate: true});
            setValue("price", car.price, {shouldValidate: true});
        } else {
            setValue("carNumber", '', {shouldDirty: true});
            setValue("carBrand", '', {shouldDirty: true});
            setValue("carModel", '', {shouldDirty: true});
            setValue("price", '', {shouldDirty: true});
        }
    }, [carForm])


    const onSubmit = async (data) => {
        await axios.post("http://localhost:3001/api/car/sell", {
            owner: 'Bob',
            org : car !== null ? car.org: 'ORG2',
            carNumber: car !== null ? car.carNumber : data.carNumber,
            carBrand: data.carBrand,
            carModel: data.carModel,
            price: data.price,
            upForSale : car!== null ? car.upForSale :  carState.NOT_FOR_SALE,
            for: car !== null ? "Update" : "Add"
        }).then(response => {
            if (response.status >= 400 && response.status < 600) {
                throw new Error("Bad response from server");
            }
            setAlertMessage({
                message: car !== null ? MESSAGE.UPDATE : MESSAGE.ADD,
                class: MESSAGE.CLASS_SUCCES
            })
            setAlert(true);
            setCarForm(prev => !prev);
            reset();
        }).catch((error) => {
            setAlertMessage({
                message: MESSAGE.ADD_ERROR,
                class: MESSAGE.CLASS_ERROR
            })
            setAlert(true);
            setCarForm(prev => !prev);
            console.log(error.message)
        });

    };

    return (<div className={"modal " + display}>
            <div className="modal-background"/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add new Car</p>
                    <button className="delete" id="formDelete" aria-label="close" onClick={handlClick}/>

                </header>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <section className="modal-card-body">


                        <div className="field">
                            <label className="label">Car Number </label>
                            <div className="control">
                                <input className={"input" + " " + (errors.carNumber && 'is-danger')}
                                       type="text"
                                       {...register("carNumber",
                                           {required: "Car Number is required"})}
                                       placeholder="Car Number ... "
                                       disabled={car !== null}
                                />
                                {errors.carNumber && <p className="help is-danger">{errors.carNumber.message}</p>}

                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Car Brand </label>
                            <div className="control">
                                <input className={"input" + " " + (errors.carBrand && 'is-danger')}
                                       type="text"
                                       {...register("carBrand",
                                           {required: "Car Brand is required"})}
                                       placeholder="Car Brand ... "/>
                                {errors.carBrand && <p className="help is-danger">{errors.carBrand.message}</p>}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Car Model </label>
                            <div className="control">
                                <input className={"input" + " " + (errors.carModel && 'is-danger')}
                                       type="text"
                                       {...register("carModel",
                                           {required: "Car Model is required"})}
                                       placeholder="Car Model ..."/>
                                {errors.carModel && <p className="help is-danger">{errors.carModel.message}</p>}
                            </div>

                        </div>

                        <div className="field">
                            <label className="label">Price </label>
                            <div className="control">
                                <input className={"input" + " " + (errors.price && 'is-danger')}
                                       type="number"
                                       {...register("price",
                                           {required: "Car Price is required"})}
                                       placeholder="Price ..."/>
                                {errors.price && <p className="help is-danger">{errors.price.message}</p>}

                            </div>
                        </div>

                    </section>
                    <footer className="modal-card-foot ">
                        <input disabled={isSubmitting || !isValid} className="button is-primary" type="submit"
                               value={(car !== null) ? "update" : "save"}/>
                        {isSubmitting && <span className="mt-2">
                           <ClipLoader color={color} size={35}/>
                        </span>}
                    </footer>
                </form>

            </div>
        </div>
    )


}

export default AddCar;