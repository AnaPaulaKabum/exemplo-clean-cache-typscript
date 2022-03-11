import { ICacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases/save-purchases';

export class LocalSavePurchases{

    constructor(private readonly cacheStore:ICacheStore,
                private readonly timestamp: Date){}

    async save(savePurchases: Array<SavePurchases.Params>): Promise<void>{
        this.cacheStore.delete('purchases');
        this.cacheStore.insert({timestamp: this.timestamp,value:savePurchases}   
                                ,'purchases');
    };

}