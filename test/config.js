const {assert} = require('chai');
const {utils, wallets} = require('@aeternity/aeproject');
const {AmountFormatter} = require('@aeternity/aepp-sdk');
const EXAMPLE_CONTRACT_SOURCE = './contracts/VegasMarketContact.aes';

describe('VegasMarketContact', () => {
    let aeSdk;
    let contract;
    let owner;
    let marketId;

    before(async () => {
        aeSdk = await utils.getSdk();

        // a filesystem object must be passed to the compiler if the contract uses custom includes
        const filesystem = utils.getFilesystem(EXAMPLE_CONTRACT_SOURCE);

        // get content of contract
        const source = utils.getContractContent(EXAMPLE_CONTRACT_SOURCE);

        // initialize the contract instance
        contract = await aeSdk.getContractInstance({source, filesystem});
        await contract.deploy();

        // create a snapshot of the blockchain state
        await utils.createSnapshot(aeSdk);
    });

    // after each test roll back to initial state
    after(async () => {
        await utils.rollbackSnapshot(aeSdk);
    });


    it('VegasMarketContact: updateConfig', async () => {
        let decimals = AmountFormatter.toAettos(1)
        let {decodedResult} = await contract.methods.update_config(
            {
                "decimals": decimals,
                "oracle_trigger_count": 3,
                "market_min_height": 1,
                "market_max_height": 480 * 30,
                "market_min_amount": decimals / 100,
                "market_max_amount": decimals * 1000,
                "record_max_count": 10,
                "market_max_people": 10,
                "platform_address": "ak_CNcf2oywqbgmVg3FfKdbHQJfB959wrVwqfzSpdWVKZnep7nj4",
                "foundation_address": "ak_CNcf2oywqbgmVg3FfKdbHQJfB959wrVwqfzSpdWVKZnep7nj4",
                "platform_percentage": 850,
                "foundation_percentage": 150,
                "create_percentage": 500
            }
        );
        console.log(decodedResult);

    })


});
