import { ICacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases/save-purchases';

export class LocalSavePurchases{

    constructor(private readonly cacheStore:ICacheStore){}

    async save(savePurchases: Array<SavePurchases.Params>): Promise<void>{
        this.cacheStore.delete('purchases');
        this.cacheStore.insert(savePurchases,'purchases');
    };

}