import { ICacheStore } from '@/data/protocols/cache'
import { SavePurchases,LoadPurchases } from '@/domain/usecases/';

export class LocalLoadPurchases implements SavePurchases, LoadPurchases{

    private readonly key = 'purchases'

    constructor(private readonly cacheStore:ICacheStore,
                private readonly currentDate: Date){}

    async save(savePurchases: Array<SavePurchases.Params>): Promise<void>{
        this.cacheStore.delete(this.key);
        this.cacheStore.insert({timestamp: this.currentDate,value:savePurchases}   
                                ,this.key);
    };

    async loadAll(): Promise<Array<LoadPurchases.Result>>{
        
        try {
           const cache = this.cacheStore.fetch(this.key); 
           return cache.value;
           
       } catch (error) {
           this.cacheStore.delete(this.key);
           return [];
       }

    }

}