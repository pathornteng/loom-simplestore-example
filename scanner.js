const rp = require('request-promise');
var JSONbig = require('json-bigint');

const config = {
    url: "http://localhost:26680/",
    defaultUrl: "http://45.125.197.45:46658",
    firstBlock: 1,
    lastBlock: 100,
    frequency: 1,
}

const maxYearlyDistributedReward = 60000000

async function getDelegationTotal(block) {
    var options = {
        method: 'GET',
        uri: config.url + '/dpos_state?height=' + block,
    };

    try {
        const res = await rp(options);
        const data = JSONbig.parse(res);
        if (data.error != undefined) {
            console.log(data.error)
            return 0
        }
        let rawDelegationTotal = data.result.total_validator_delegations.Value.toString(10);
        console.log(rawDelegationTotal)
        return Number(rawDelegationTotal.substring(0, rawDelegationTotal.length - 18))
    } catch (err) {
        console.log(err)
        return 0
    }
}

async function getBlockTime(block) {
    var options = {
        method: 'GET',
        uri: config.defaultUrl + '/rpc/block?height=' + block,
    };

    try {
        const res = await rp(options);
        const data = JSONbig.parse(res);
        if (data.error != undefined) {
            console.log(data.error)
            return 0
        }
        return data.result.block_meta.header.time;
    } catch (err) {
        console.log(err)
        return 0
    }
}

(async function () {
    try {
        for (var i = config.firstBlock; i < config.lastBlock; i = i + config.frequency) {
            const totalDelegation = await getDelegationTotal(i)
            const blockTime = await getBlockTime(i)
            const yearlyDistributedRewards = (totalDelegation * 0.05)
            let percentage = 100
            if (yearlyDistributedRewards > maxYearlyDistributedReward) {
                percentage = maxYearlyDistributedReward * 100 / yearlyDistributedRewards
            }
            const lostRewards = ((yearlyDistributedRewards - maxYearlyDistributedReward) / 365) / 48
            console.log("block (" + i + ")", blockTime, percentage + "%", yearlyDistributedRewards, lostRewards, )
        }
    } catch (err) {
        console.log(err)
    }
})();
