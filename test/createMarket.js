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


    it('VegasMarketContact: AddMarkets', async () => {

        for (let i = 0; i < 15; i++) {
            let content = "恭她祥识盒豪狠摔翁驳朱摘度包匆饲济遇蔽若舍气堪顶帜善尘洒演彼锹零男萝袜辅勒宅雅玉五具照郎镇榨专隐搜痕它慎竞啄右纽密遍于墓影对免妨恋清女涌搏皱球姻即先芹躁齐核愿缘迈突钱谣话穷铜慈醉纺欧雹述勺和链杠挑腰帝月挽灯揉店袍蕉例值液猴与井朋良搅讽棋杀成污怪锁触览脂凭沫泻罗团婚闪洽瓶买令减辽拒云咽袖亡无逃启唇棒猛漫绝移桥违解往满弱且砍俗低带拳秘章躺擦帅售诊温孤海哥丹声垦行酿巾驰台举操馆送祸勾煎招颂博鹅毯捡粮俯券幸遣柳整扯闭醒三灶餐孕误模梁踩慢省销皮估额练居土碰仗誓晕粒丰尖瓦柜压伟第缸浊银铺惨债释描写端旁运疆众护堂糟崭塑悉梯珍及钞很叶记耳损感喜牵航魔拦楼锻橘营认揭钳丛抚骂松捞糕范胆匙考玻绢空懒烈酸芬掌如展网纹忍国忆敞偶逐刘乱硬倦愉龙含刮帽跃默汉烤穿烫缺探拴朵笼族勤屠赚揪嫌库叨千芽锋底粱崇狭钩蓝盈习毕降暴辱掘晋亩波刺秩渔之扑敲秧简域高侵熊使陕弹多诵协脚念礼柔逝段顿贩输据炮坚雨劳乡观叙雷订姑警寺山壮尚改当花捏尊爱澡奋鲁轧催畏港胃搭宙养恩聚抛锄姨氧惊木俊虏微世白每从孟威妇舒穴岗超卧价犬员侍腥获捐戏赞离逼粘肌菜抹化炊产赶知约府傲挤游池咸益伍市僚真坦眠导糠呆隙栏榴孝颈屯二哭午践嗓迷名积食依弓昌柏禾锦炎叼萄剩谊迁";
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
                }]);
            owner = decodedEvents[0].args[0];
            marketId = decodedEvents[0].args[1];
            console.log("           owner______________________________ " + owner);
            console.log("           marketId___________________________ " + marketId);
            console.log("           " + i);
            await contract.methods.get_markets_start(wallets[0].publicKey,false);
            // assert.equal(decodedEvents[0].name, 'AddMarketEvent');
        }

    })


});
