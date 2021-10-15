import React from 'react';
import BeatLoader from "react-spinners/BeatLoader"

import {useForm} from "react-hook-form";
import axios from "axios";

const CarBuyConfirmation = ({displayForm, setDisplayForm, selectedCar,setFormSend,setAlert}) => {

    const {handleSubmit, formState} = useForm();
    const {isSubmitting, isSubmitted} = formState;


  const  onSubmit = async () => {

      try {
          await axios.put("http://localhost:3001/api/car/buy",{
              buyer :'Alice',
              ...selectedCar
          });
          setAlert(true);
      }catch (er) {
          setDisplayForm(prev => !prev);
      }
      setDisplayForm(prev => !prev);
    }
    return (
        <div className={"modal " + (displayForm && "is-active")}>
            <div className="modal-background"/>
            <div className="modal-content">
                <div className="box">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p>Are you sure that you want to buy this car ? {isSubmitting && <span className={"ml-5 has-text-primary"}>
                            purchase in progress
                            <span className={"mt-4"}>
                                <BeatLoader color="#36D7B7" size="10"/>
                            </span>
                        </span>}
                        </p>
                        <input type="submit" className="button is-primary is-pulled-right" value="Buy it"/>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={() => setDisplayForm(prev => !prev)}>X
            </button>
        </div>
    )


}

export default CarBuyConfirmation;
