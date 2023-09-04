const BlockStreamServiceApi = require('../repository/blockStreamApiService');
class ComputeAncestorsLogic{
    constructor() {
        this.blockStreamServiceApi = new BlockStreamServiceApi();
    }

    async computeAncestors(height) {
        const hashCode = await this.blockStreamServiceApi.getBlockHash(height);
        const blockInfo = await this.blockStreamServiceApi.getBlockInfo(hashCode);
        const parentsMap = this.buildParentsMap(blockInfo);
        const ancestorsMap = this.buildAncestorsMap(parentsMap);
        this.printHighestAncestorsTransactions(ancestorsMap);
    }

    buildParentsMap(blockInfo) {
        const parentsMap = new Map();
        for (const txn of blockInfo ) {
            let parentsArray = [];
            const taxId = txn.txid;
            for (const parent of txn.vin) {
                parentsArray.push(parent.txid)
            }
            parentsMap.set(taxId, parentsArray);
        }
        return parentsMap;
    }

    buildAncestorsMap(parentsMap) {
        const ancestorsMap = new Map();
        for (const txn of parentsMap.keys()) {
            this.setAncestorsList(parentsMap, txn, ancestorsMap);
        }
        return ancestorsMap;
    }

    setAncestorsList(parentsMap, txId, ancestorMap) {
        if (ancestorMap.has(txId))
            return;
        let ancestorsList = [];
        const parentsList = parentsMap.get(txId);
        for (const parent of parentsList) {
            if (parentsMap.has(parent)) {
                ancestorsList.push(parent);
                this.setAncestorsList(parentsMap, parent, ancestorMap);
                for (const ancestor of ancestorMap.get(parent)) {
                    ancestorsList.push(ancestor);
                }
            }
        }
        ancestorMap.set(txId, ancestorsList);
    }

    printHighestAncestorsTransactions(ancestorsMap) {
        // const sortedAncestorsMap = new Map([...ancestorsMap.entries()].sort((a, b) => (ancestorsMap.get(b) ? ancestorsMap.get(b).length : 0
        //     - ancestorsMap.get(a) ? ancestorsMap.get(a).length : 0)));
        // const limit = 10;
        // let cur = 1;
        // for (const txn of sortedAncestorsMap.keys()) {
        //     if (cur > limit) {
        //         break;
        //     }
        //     console.log(txn + ancestorsMap.get(txn).length);
        //     cur = cur + 1
        // }


        const ancestorLengthMap = new Map();
        for (const txn of ancestorsMap.keys()) {
            const ancestorArr = ancestorsMap.get(txn);
            ancestorLengthMap.set(txn, ancestorArr.length);
        }
        const sortedAncestorLengthMap = new Map([...ancestorLengthMap.entries()].sort((a, b) => b[1] - a[1]));
        //ancestorLengthMap.sort((a, b) => ancestorLengthMap.get(a) - ancestorLengthMap.get(b));
        const limit = 10;
        let cur = 1;
        for (const txn of sortedAncestorLengthMap.keys()) {
            if (cur > limit) {
                break;
            }
            console.log(txn + "  " + sortedAncestorLengthMap.get(txn));
            cur = cur + 1
        }
    }
}

module.exports = ComputeAncestorsLogic;