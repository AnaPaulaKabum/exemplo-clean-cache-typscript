
import { ICacheStore } from '@/data/protocols/cache'
import {LocalSavePurchases} from '@/data/usecases/'
import { SavePurchases } from '@/domain/usecases/save-purchases';

class CacheStoreSpy implements ICacheStore{

  
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

const mockPurchases = (): Array<SavePurchases.Params> => [{
    id: '1', 
    date: new Date(),
    value: 50,
},{   
    id: '2', 
    date: new Date(),
    value: 70,
}]

type SutTypes = {sut: LocalSavePurchases,
                 cacheStore: CacheStoreSpy };

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore);
    return {sut, cacheStore}
}


describe('LocalSAvePurchases', () => {
    test('Should not delete cache on sut.init',  () => {

        const {cacheStore} = makeSut();

        expect(cacheStore.deleteCallsCount).toBe(0);
    })

    test('Should not delete cache on sut.save', async () => {

        const {sut,cacheStore} = makeSut();

        await sut.save(mockPurchases());
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.deleteKey).toBe("purchases");
    })

    test('Should not insert new cache if delete fails', () => {

        const {sut,cacheStore} = makeSut();
        cacheStore.simuleDeleteError();

        const promise = sut.save(mockPurchases());

        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow();
    })

    test('Should insert new cache if delete succeds', async () => {

        const {sut,cacheStore} = makeSut();
        const purchases = mockPurchases();

        await sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertValues).toEqual(purchases);

    })

    test('Should throw if insert throws', () => {

        const {sut,cacheStore} = makeSut();
        cacheStore.simuleInsertError();
        
        const promise = sut.save(mockPurchases());

        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow();
    })
})
