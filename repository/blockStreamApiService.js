const axios = require('axios');
const config = require('../config/config');
class BlockstreamApiService {
    constructor() {
        this.blockStreamApiEndpoint = config.blockStreamApiEndpoint;
        this.axios = axios;
    }

    async getBlockHash(height) {
        const url = `${this.blockStreamApiEndpoint}/block-height/${height}`;
        const resp = await this.axios({
            url: url,
            method: "get"
        })
        return resp.data;
    }

    async getBlockInfo(hashcode) {
        const blockDataUrl = `${this.blockStreamApiEndpoint}/block/${hashcode}`;
        const blockDataResp = await this.axios({
            url: blockDataUrl,
            method: "get"
        })
        const tx_count = blockDataResp.data.tx_count;

        let blockInfo = [];
        let curIndex = 0;
        while (curIndex < tx_count) {
            const url = `${this.blockStreamApiEndpoint}/block/${hashcode}/txs/${curIndex}`;
            const resp = await this.axios({
                url: url,
                method: "get"
            })
            blockInfo.push(...resp.data);
            curIndex = curIndex + 25;
        }

        return blockInfo;
    }

}

module.exports = BlockstreamApiService;