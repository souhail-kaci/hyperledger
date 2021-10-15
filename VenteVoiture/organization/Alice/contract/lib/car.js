'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate the car state values
const carState = {
    FOR_SALE: 1,
    NOT_FOR_SALE: 2
};


/**
 * Car class that will be used by apps and smart contract to define a car
 */
class Car extends State {
    constructor(obj) {
        super(Car.getClass(), [obj.org, obj.carNumber]);
        Object.assign(this, obj);
    }

    /**
     * Getters & setters
     */
    getSeller() {
        return this.seller;
    }

    setSeller(newSeller) {
        this.seller = newSeller;
    }

    getOwner() {
        return this.owner;
    }

    getState() {
        return this.state;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getPrice() {
        return this.price;
    }

    /**
     * Handling the car state
     */

    setUpForSale(newState){
        this.upForSale = newState;
    }

    static fromBuffer(buffer) {
        return Car.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Car);
    }

    /**
     * Factory method to create a car to sale
     */
    static createInstance(owner, org, carNumber, carBrand, carModel, price, upForSale) {
        return new Car({owner, org, carNumber, carBrand, carModel, price, upForSale});
    }

    static getClass() {
        return 'org.carmarket.car';
    }
}

module.exports = Car;
