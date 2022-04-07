const {assert} = require('chai');
const {utils, wallets} = require('@aeternity/aeproject');
const {AmountFormatter} = require('@aeternity/aepp-sdk');
const EXAMPLE_CONTRACT_SOURCE = './contracts/VegasMarketContact.aes';

describe('VegasMarketContact', () => {
    let aeSdk;
    let contract;
    let owner;
    let marketId;
    let name = "abcdefghijklmnopqrstuvwxyz.chain";
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

    it('ClaimName: ' + name, async () => {
        const preClaim = await aeSdk.aensPreclaim(name, {
            onAccount: wallets[1].publicKey,

        });
        await preClaim.claim({
            onAccount: wallets[1].publicKey,

        });
    })

    it('AensMarketContract: addCertificate', async () => {
        await contract.methods.add_certificate(name);
    });

    it('VegasMarketContact: AddMarket', async () => {
        let content = "Qatar World Cup & The first round On November 21 🇸🇳Senegal VS 🇳🇱Holland, Who will win! ";
        console.log(content.length)
        //content, source_url, min_amount, over_height, answers
        const {decodedEvents} = await contract.methods.add_market(
            content,
            "https://www.fifa.com/",
            AmountFormatter.toAettos(100),
            20,
            [{
                content: "🇸🇳Senegal",
                count: 0,
            }, {
                content: "🇳🇱Holland",
                count: 0,
            }, {
                content: "Special results",
                count: 0,
            }],
            {
                onAccount: wallets[1].publicKey,

            });
        owner = decodedEvents[0].args[0];
        marketId = decodedEvents[0].args[1];
        console.log("           owner______________________________ " + owner);
        console.log("           marketId___________________________ " + marketId);
        assert.equal(decodedEvents[0].name, 'AddMarketEvent');
    })

    it('VegasMarketContact: SubmitAnswer', async () => {
        let {decodedResult} = await contract.methods.get_market(owner, marketId);
        let minAmount = parseInt(decodedResult.min_amount);
        console.log("           minAmount______________________________ " + AmountFormatter.toAe(minAmount));
        let answerIndex = 0;
        for (let i = 0; i < 5; i++) {
            await SubmitAnswer(answerIndex, minAmount, i);
        }

    })


    async function SubmitAnswer(answerIndex, minAmount, i) {
        const {decodedEvents} = await contract.methods.submit_answer(
            owner,
            marketId,
            answerIndex,
            {
                amount: Number(minAmount),
                onAccount: wallets[i].publicKey
            });

        assert.equal(decodedEvents[0].name, 'SubmitAnswerEvent');
        assert.equal(decodedEvents[0].args[0], owner);
        assert.equal(decodedEvents[0].args[1], marketId);
        assert.equal(decodedEvents[0].args[2], wallets[i].publicKey);
        assert.equal(decodedEvents[0].args[3], answerIndex);
    }

    it('VegasMarketContact: SubmitAnswer2', async () => {
        let {decodedResult} = await contract.methods.get_market(owner, marketId);
        let minAmount = parseInt(decodedResult.min_amount);
        console.log("           minAmount______________________________ " + AmountFormatter.toAe(minAmount));
        let answerIndex = 1;
        for (let i = 10; i > 5; i--) {
            await SubmitAnswer(answerIndex, minAmount, i);
        }
    });

    it('AensMarketContract: PrivateUpdateMarketProgressToOver', async () => {
        await utils.awaitKeyBlocks(aeSdk, 20)
        const {decodedResult: get_state} = await contract.methods.private_update_market_progress_to_over(
            owner,
            marketId,
            1,
            {
                onAccount: wallets[1].publicKey
            });
    });


    it('VegasMarketContact: ReceiveReward', async () => {
        for (let i = 10; i > 7; i--) {
            await contract.methods.receive_reward(
                owner,
                marketId,
                {
                    onAccount: wallets[i].publicKey
                });
        }
    });


    it('AensMarketContract: GetState', async () => {
        const {decodedResult: get_state} = await contract.methods.get_state();
        console.dir(get_state, {depth: null});
        // console.dir(get_state.markets.get(owner).get(marketId), {depth: null});
    });


});
