const rp = require('request-promise');
var JSONbig = require('json-bigint');
const fs = require('fs');
var hex64 = require('hex64');
const events = require('./out.json')
const BigNumber = require('bignumber.js');

const config = {
    apiURL: "http://dev-api.loom.games/delegation/stake?action=unbound",
    loomURL: "http://basechain.dappchains.com",
    startPage: 1,
    endPage: 10000,
}

function niceNumber(num) {
  try{
        var sOut = num.toString();
      if ( sOut.length >=17 || sOut.indexOf("e") > 0){
      sOut=parseFloat(num).toPrecision(5)+"";
      sOut = sOut.replace("e","x10<sup>")+"</sup>";
      }
      return sOut;

  }
  catch ( e) {
      return num;
  }
}

function bigIntToString(num) {
    let rawBigint = num.toString(10);
    return Number(rawBigint.substring(0, rawBigint.length - 18))
}

async function getBlockTime(block) {
    var options = {
        method: 'GET',
        uri: config.loomURL + '/rpc/block?height=' + block,
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

function base64ToHexAddr(str) {
    return "default:0x" + hex64.transform(str)
}

async function readJSON(filename) {
    let rawdata = fs.readFileSync(filename);
    let delegations = JSONbig.parse(rawdata);
    return delegations.result
}

async function getDelegationEvents(page) {
    var options = {
        method: 'GET',
        uri: config.apiURL + "&page=" + page,
    };

    try {
        const res = await rp(options);
        const data = JSONbig.parse(res);
        return data.data
    } catch (err) {
        console.log(err)
        return 0
    }
}

const payoutBonus = {
    6: 5, // June 5%
    7: 6, // July 6%
    9: 2, // September 2
    10: 3, // October 3
    11: 5, // November 5
}

async function getPaidRewards(currentMonthFile, nextMonthFile, fromBlock, toBlock) {
    const paidRewards = {}
    const diffRewards = {}
    // read delegations from files
    let delegations = await readJSON(nextMonthFile)
    for (response of delegations.list_responses) {
        //console.log(response.delegations)
        const validatorDelegations = response.delegations;
        if (validatorDelegations == undefined) {
            continue;
        }
        for (delegation of validatorDelegations) {
            // Skip normal delegation
            if (delegation.index) {
                continue;
            }
            const d = base64ToHexAddr(delegation.delegator.local)
            const v = base64ToHexAddr(delegation.validator.local)
            //const amount = bigIntToString(delegation.amount.Value)
            //console.log(d, v, amount)
            paidRewards[d + v] = delegation.amount
        }
    }
    delegations = await readJSON(currentMonthFile)
    for (response of delegations.list_responses) {
        const validatorDelegations = response.delegations;
        if (validatorDelegations == undefined) {
            continue;
        }
        for (delegation of validatorDelegations) {
            // Skip normal delegation
            if (delegation.index) {
                continue;
            }
            const d = base64ToHexAddr(delegation.delegator.local)
            const v = base64ToHexAddr(delegation.validator.local)
            if (typeof paidRewards[d + v] !== 'undefined') {
                diffRewards[d + v] = {
                    "amount": paidRewards[d + v].Value - delegation.amount.Value,
                    "delegator" : d,
                    "validator" : v,
                }
                diffRewards[d + v].amount = getUnboundRewardEventAmount(d,v,fromBlock, toBlock).plus(diffRewards[d + v].amount)
                
            }
        }
    }
    return diffRewards
}

function getUnboundRewardEventAmount(delegator, validator, fromBlock, toBlock) {
    let unboundAmount = new BigNumber(0)
    for (page in events) {
        let unboundEvents = events[page];
        for (event of unboundEvents) {
            if(event.validator.toLowerCase() == validator.toLowerCase() &&
                 event.delegator.toLowerCase() == delegator.toLowerCase() &&
                 event.index == 0 && event.block_height >= fromBlock && event.block_height < toBlock){
                    
                     let amount = BigNumber(event.amount)
                     unboundAmount = unboundAmount.plus(amount)
                 }
        }
    }
    //console.log("unbound number", unboundAmount.toString(10))
    return unboundAmount
}

async function scanUnboundEvent() {
    let allPages = {}
        // get rewards unbound events 
        for (i = config.startPage; i <= config.endPage; i++) {
            console.log("page", i)
            const data = await getDelegationEvents(i)
            allPages[i] = data
            if (data.length < 100) {
                break;
            }
            // if (data.length < 100) {
            //     break;
            // }
            // for (delegation of data) {
            //     const blocktime = new Date(delegation.block_time * 1000).toISOString();
            //     console.log(delegation.delegator.toLowerCase(),
            //         delegation.validator.toLowerCase(),
            //         delegation.amount.toString(10),
            //         delegation.index, blocktime, delegation.block_height)
            // }
        }
        console.log(JSON.stringify(allPages, null, 2))
}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return a.value - b.value; });
    let result = {}
    let totalCompensationAmount = 0
    for(obj of arr) {
        totalCompensationAmount += obj.value
        result[obj.key] = obj.value
    }
    result["total_refund_amount"] = totalCompensationAmount
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return result; // returns array
}

async function calculateMissingRewards() {
    let monthlyPaidRewards = {}
    try {
        //await scanUnboundEvent()
        //console.log(eventsByBlock)
        // 5700000 -> June * 
        // 7250000 -> July
        // 9250000 -> August
        // 11000000 -> September
        // 12700000 -> October
        // 14550000 -> November
        // 16150000 -> End of problem
        let rewards = await getPaidRewards("june_delegations.json", "july_delegations.json", 5700000, 7250000)
        let currentMonthRewardsPaid = {}
        let bonusPercent = 100/95 - 1
        for (var key in rewards) {
            if (typeof currentMonthRewardsPaid[rewards[key].delegator] === 'undefined') {
                currentMonthRewardsPaid[rewards[key].delegator] = (rewards[key].amount/1000000000000000000) * bonusPercent
            } else {
                currentMonthRewardsPaid[rewards[key].delegator] += (rewards[key].amount/1000000000000000000) * bonusPercent
            }
        }
        monthlyPaidRewards["June"] = currentMonthRewardsPaid

        rewards = await getPaidRewards("july_delegations.json", "august_delegations.json", 7250000, 9250000)
        currentMonthRewardsPaid = {}
        bonusPercent = 100/94 - 1
        for (var key in rewards) {
            if (typeof currentMonthRewardsPaid[rewards[key].delegator] === 'undefined') {
                currentMonthRewardsPaid[rewards[key].delegator] = (rewards[key].amount/1000000000000000000) * bonusPercent
            } else {
                currentMonthRewardsPaid[rewards[key].delegator] += (rewards[key].amount/1000000000000000000) * bonusPercent
            }
        }
        monthlyPaidRewards["July"] = currentMonthRewardsPaid

        rewards = await getPaidRewards("september_delegations.json", "october_delegations.json", 11000000, 12700000)
        currentMonthRewardsPaid = {}
        bonusPercent = 100/98 - 1
        for (var key in rewards) {
            if (typeof currentMonthRewardsPaid[rewards[key].delegator] === 'undefined') {
                currentMonthRewardsPaid[rewards[key].delegator] = (rewards[key].amount/1000000000000000000) * bonusPercent
            } else {
                currentMonthRewardsPaid[rewards[key].delegator] += (rewards[key].amount/1000000000000000000) * bonusPercent
            }
        }
        monthlyPaidRewards["September"] = currentMonthRewardsPaid

        rewards = await getPaidRewards("october_delegations.json", "november_delegations.json", 12700000, 14550000)
        currentMonthRewardsPaid = {}
        bonusPercent = 100/97 - 1
        for (var key in rewards) {
            if (typeof currentMonthRewardsPaid[rewards[key].delegator] === 'undefined') {
                currentMonthRewardsPaid[rewards[key].delegator] = (rewards[key].amount/1000000000000000000) * bonusPercent
            } else {
                currentMonthRewardsPaid[rewards[key].delegator] += (rewards[key].amount/1000000000000000000) * bonusPercent
            }
        }
        monthlyPaidRewards["October"] = currentMonthRewardsPaid

        rewards = await getPaidRewards("november_delegations.json", "november_end_delegations.json", 14550000, 16150000)
        currentMonthRewardsPaid = {}
        bonusPercent = 100/95 - 1
        for (var key in rewards) {
            if (typeof currentMonthRewardsPaid[rewards[key].delegator] === 'undefined') {
                currentMonthRewardsPaid[rewards[key].delegator] = (rewards[key].amount/1000000000000000000) * bonusPercent
            } else {
                currentMonthRewardsPaid[rewards[key].delegator] += (rewards[key].amount/1000000000000000000) * bonusPercent
            }
        }
        monthlyPaidRewards["November"] = currentMonthRewardsPaid

        let totalPaidRewards = {}
        for(month in monthlyPaidRewards) {
            let monthlyPayout = monthlyPaidRewards[month]
            for(delegator in monthlyPayout) {
                if (typeof totalPaidRewards[delegator] === 'undefined') {
                    if (monthlyPayout[delegator] > 0) {
                        totalPaidRewards[delegator] = monthlyPayout[delegator]
                    }
                } else {
                    if (monthlyPayout[delegator] > 0) {
                        totalPaidRewards[delegator] += monthlyPayout[delegator]
                    }
                }
            }
        }

        console.log(JSON.stringify(sortObject(totalPaidRewards), null, 2))
    } catch (err) {
        console.log("should not revert", err);
    }
}

(async function () {
    await calculateMissingRewards();
})();