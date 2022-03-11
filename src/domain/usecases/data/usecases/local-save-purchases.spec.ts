class LocalSavePurchases{

    constructor(private readonly cacheStore:ICacheStore){}

}

interface ICacheStore{
  
}

class CacheStoreSpy implements ICacheStore{
  
    deleteCallsCount = 0;
}


describe('LocalSAvePurchases', () => {
    test('Should not delete dache on sut.init',  () => {

        const cacheStore = new CacheStoreSpy()
        new LocalSavePurchases(cacheStore);

        expect(cacheStore.deleteCallsCount).toBe(0);
    })
})
