import { SavePurchases } from "@/domain/usecases";
import { ICacheStore } from "@/data/protocols/cache";

export class CacheStoreSpy implements ICacheStore{

    deleteKey:string;
    insertKey:string;
    insertCallsCount = 0;
    insertValues: Array<SavePurchases.Params>;
    deleteCallsCount = 0;

    delete(key:string): void {
        this.deleteCallsCount ++;
        this.deleteKey = key;
    }

    insert(savePurchases: SavePurchases.Params[], key: string): void {
        this.insertCallsCount ++;  
        this.insertKey = key;
        this.insertValues = savePurchases;
    }

    simuleDeleteError():void{
        jest.spyOn(CacheStoreSpy.prototype,'delete').mockImplementationOnce(() => {throw new Error()});
    }

    simuleInsertError():void{
        jest.spyOn(CacheStoreSpy.prototype,'insert').mockImplementationOnce(() => {throw new Error()});
    }

}
