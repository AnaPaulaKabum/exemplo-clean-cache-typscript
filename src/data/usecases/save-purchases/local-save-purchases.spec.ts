import { mockPurchases } from '@/data/tests';
import { CacheStoreSpy } from '@/data/tests/mock-cache';
import {LocalSavePurchases} from '@/data/usecases/'

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
