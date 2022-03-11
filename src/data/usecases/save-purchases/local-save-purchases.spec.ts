import { mockPurchases } from '@/data/tests';
import { CacheStoreSpy } from '@/data/tests/mock-cache';
import {LocalSavePurchases} from '@/data/usecases/'

type SutTypes = {sut: LocalSavePurchases,
                 cacheStore: CacheStoreSpy };

const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore,timestamp);
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

    test('Should not insert new cache if delete fails', async() => {

        const {sut,cacheStore} = makeSut();
        cacheStore.simuleDeleteError();

        const promise = sut.save(mockPurchases());

        expect(cacheStore.insertCallsCount).toBe(0);
        await expect(promise).rejects.toThrow();
    })

    test('Should insert new cache if delete succeds', async () => {

        const timestamp = new Date();
        const {sut,cacheStore} = makeSut();
        const purchases = mockPurchases();

        const promisse = sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        });
        await expect(promisse).resolves.not.toThrow();
        await expect(promisse).resolves.toBeFalsy();
    })

    test('Should throw if insert throws', async () => {

        const {sut,cacheStore} = makeSut();
        cacheStore.simuleInsertError();
        
        const promise = sut.save(mockPurchases());

        expect(cacheStore.insertCallsCount).toBe(0);
        await expect(promise).rejects.toThrow();
    })
})
