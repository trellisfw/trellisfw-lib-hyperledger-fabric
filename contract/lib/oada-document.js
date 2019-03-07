/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class OADADocument extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const docs = [
            {
                hash: 'test_hash',
            }
        ];

        for (let i = 0; i < docs.length; i++) {
            docs[i].docType = 'doc';
            await ctx.stub.putState('DOC' + i, Buffer.from(JSON.stringify(docs[i])));
            console.info('Added <--> ', docs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryDoc(ctx, docNumber) {
        const docAsBytes = await ctx.stub.getState(docNumber); // get the car from chaincode state
        if (!docAsBytes || docAsBytes.length === 0) {
            throw new Error(`${docNumber} does not exist`);
        }
        console.log(docAsBytes.toString());
        return docAsBytes.toString();
    }

    async createDoc(ctx, docNumber, hash) {
        console.info('============= START : Create Car ===========');

        const doc = {
            hash,
            docType: 'doc',
        };

        await ctx.stub.putState(docNumber, Buffer.from(JSON.stringify(doc)));
        console.info('============= END : Create Car ===========');
    }

    // async queryAllDocs(ctx) {
    //     const startKey = 'DOC0';
    //     const endKey = 'DOC999';

    //     const iterator = await ctx.stub.(startKey, endKey);

    //     const allResults = [];
    //     while (true) {
    //         const res = await iterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             console.log(res.value.value.toString('utf8'));

    //             const Key = res.value.key;
    //             let Record;
    //             try {
    //                 Record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 console.log(err);
    //                 Record = res.value.value.toString('utf8');
    //             }
    //             allResults.push({ Key, Record });
    //         }
    //         if (res.done) {
    //             console.log('end of data');
    //             await iterator.close();
    //             console.info(allResults);
    //             return JSON.stringify(allResults);
    //         }
    //     }
    // }

    async changeDocHash(ctx, docNumber, newHash) {
        console.info('============= START : changeCarOwner ===========');

        const docAsBytes = await ctx.stub.getState(docNumber); // get the car from chaincode state
        if (!docAsBytes || docAsBytes.length === 0) {
            throw new Error(`${docNumber} does not exist`);
        }
        const doc = JSON.parse(docAsBytes.toString());
        doc.hash = newHash;

        await ctx.stub.putState(docNumber, Buffer.from(JSON.stringify(doc)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = OADADocument;
