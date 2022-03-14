import { ICacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases/save-purchases';

export class LocalLoadPurchases{

    private readonly key = 'purchases'

    constructor(private readonly cacheStore:ICacheStore,
                private readonly timestamp: Date){}

    async save(savePurchases: Array<SavePurchases.Params>): Promise<void>{
        this.cacheStore.delete(this.key);
        this.cacheStore.insert({timestamp: this.timestamp,value:savePurchases}   
                                ,this.key);
    };

    async loadAll(): Promise<void>{
       this.cacheStore.fetch(this.key); 
    }

}