import { mockPurchases } from '@/data/tests';
import { CacheStoreSpy } from '@/data/tests/mock-cache';
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

    test('Shuold call correct key on load', async () => {
        const {sut, cacheStore } = makeSut()
        await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
        expect(cacheStore.fetchKey).toBe('purchases')
    })

    test('Should return empty list if load fails', async () => {
        const {sut, cacheStore } = makeSut()
        cacheStore.simuleFethError();
        const resultado = await sut.loadAll();
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch,CacheStoreSpy.Action.delete])
        expect(cacheStore.deleteKey).toBe('purchases');
        expect(resultado).toEqual([]);
    })



})
