import { mockPurchases } from '@/data/tests';
import { CacheStoreSpy, getCacheExpirationDate } from '@/data/tests/mock-cache';
import {LocalLoadPurchases} from '@/data/usecases/'

type SutTypes = {sut: LocalLoadPurchases,
                 cacheStore: CacheStoreSpy };

const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore,timestamp);
    return {sut, cacheStore}
}

describe('LocalLoadPurchases', () => {
    
    test('Should not delete or insert cache on sut.init', () => {

        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toEqual([])
    })

    test('Should return empty list if load fails', async () => {

        const {sut, cacheStore } = makeSut();
        cacheStore.simuleFethError();
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch,CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toBe('purchases');
        expect(resultado).toEqual([]);
    })

    test('Should return a list of purchases if cache is valid', async () => {

        const currentDate = new Date();
        const timestamp =  getCacheExpirationDate(currentDate);
        timestamp.setSeconds(timestamp.getSeconds()+1)
        const {sut, cacheStore } = makeSut(timestamp);
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        };
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
        expect(resultado).toEqual(cacheStore.fetchResult.value)
        expect(cacheStore.fetchKey).toBe('purchases')
    })

    test('Should return an empty list if cache is expired', async () => {

        const currentDate = new Date();
        const timestamp =  getCacheExpirationDate(currentDate);
        timestamp.setSeconds(timestamp.getSeconds()- 1);
        const {sut, cacheStore } = makeSut(currentDate);
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        };
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch,CacheStoreSpy.Action.delete]);
        expect(cacheStore.fetchKey).toBe('purchases');
        expect(cacheStore.deleteKey).toBe('purchases');
        expect(resultado).toEqual([]);
    })

    test('Should return an empty list if cache is on expiration', async () => {

        const currentDate = new Date();
        const timestamp =  getCacheExpirationDate(currentDate);
        const {sut, cacheStore } = makeSut(currentDate);
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        };
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch,CacheStoreSpy.Action.delete]);
        expect(cacheStore.fetchKey).toBe('purchases');
        expect(cacheStore.deleteKey).toBe('purchases');
        expect(resultado).toEqual([]);
    });

    test('Should return an empty list if cache is empty', async () => {

        const currentDate = new Date();
        const timestamp =  getCacheExpirationDate(currentDate);
        timestamp.setSeconds(timestamp.getSeconds()+1)
        const {sut, cacheStore } = makeSut(timestamp);
        cacheStore.fetchResult = {
            timestamp,
            value: []
        };
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(resultado).toEqual([])
    });
})
