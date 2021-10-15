import React from 'react';

const CarToBuy = ({Car,setDisplayForm,setSelectedCar}) => {


    const handlClick = () => {
        setSelectedCar(Car);
        setDisplayForm(prev => !prev);
    }

    return (
        <div className="column is-6">
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                        </div>
                        <div className="media-content ">
                            <p className="title is-4"> Owner : {Car.owner}
                            </p>
                            <p className="subtitle is-6">@{Car.owner}</p>
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
                <footer className="card-footer">
                    <button className="button is-primary is-outlined card-footer-item" onClick={handlClick}>Buy this car</button>
                </footer>
            </div>
        </div>
    )

}

export default CarToBuy;