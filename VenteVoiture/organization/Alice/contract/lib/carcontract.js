'use strict'

//Fabric smart contract classes
const {Contract, Context} = require('fabric-contract-api')

// Car market specific classes
const Car = require('./car.js');
const CarList = require('./carlist.js');
const QueryUtils = require('./queries.js');
const carState = {
    FOR_SALE: 1,
    NOT_FOR_SALE: 2
};

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CarContext extends Context {

    constructor() {
        super();
        // All cars are held in a list of cars
        this.carList = new CarList(this);
    }
}

/**
 * Define a car smart contract by extending Fabric Contract class
 */
class CarContract extends Contract {
    constructor() {
        super('org.carmarket.car')
    }

    createContext() {
        return new CarContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async sale(ctx, owner, organisation,carNumber, carBrand, carModel, price, upForSale) {
        // Create an instance of the car
        let car = Car.createInstance(owner,organisation, carNumber, carBrand, carModel, price, upForSale)

        // Add the car to the list of cars into the ledger state
        await ctx.carList.addCar(car);

        return car;
    }

    async buy(ctx, owner, organisation,carNumber, carBrand, newOwner, price) {
        //Retrieve the car
        let carKey = Car.makeKey([organisation, carNumber]);
        let car = await ctx.carList.getCar(carKey);

        //Validate owner
        if (car.getOwner() !== owner) {
            throw new Error('Car ' + owner + carNumber + ' is not owned by ' + newOwner);
        }

        //Check if the price correspond
        if (price !== car.getPrice()) {
            throw new Error('Wrong price entered, the price of this car is : ' + car.getPrice());
        }

        car.setOwner(newOwner);
        car.setUpForSale(false);
        await ctx.carList.updateCar(car);
        return car;
    }

    async info(ctx, organisation, carNumber) {
        let carKey = Car.makeKey([organisation, carNumber]);
        let car = await ctx.carList.getCar(carKey);

        return car;
    }


    async queryOwner(ctx, owner) {

        let query = new QueryUtils(ctx, 'org.carmarket.car');
        let owner_results = await query.queryKeyByOwner(owner);

        return owner_results;

    }


}

module.exports = CarContract;