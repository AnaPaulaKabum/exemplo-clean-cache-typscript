
import { ICacheStore } from '@/data/protocols/cache'
import {LocalSavePurchases} from '@/data/usecases/'


class CacheStoreSpy implements ICacheStore{
  
    insertCallsCount = 0;
    deleteCallsCount = 0;
    key:string;

    delete(key:string): void {
        this.deleteCallsCount ++;
        this.key = key;
    }
}

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

        await sut.save();
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.key).toBe("purchases");
    })

    test('Should not insert new cache if delete fails', async () => {

        const {sut,cacheStore} = makeSut();
        jest.spyOn(cacheStore,'delete').mockImplementationOnce(() => {throw new Error()});

        expect(cacheStore.insertCallsCount).toBe(0);
        const promise = sut.save();
        expect(promise).rejects.toThrow();
    })
})
