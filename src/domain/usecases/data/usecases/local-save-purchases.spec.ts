class LocalSavePurchases{

    constructor(private readonly cacheStore:ICacheStore){}

    async save(): Promise<void>{
        this.cacheStore.delete();
    };

}

interface ICacheStore{

    delete() : void;
  
}

class CacheStoreSpy implements ICacheStore{
  
    deleteCallsCount = 0;

    delete(): void {
        this.deleteCallsCount ++;
    }
}


describe('LocalSAvePurchases', () => {
    test('Should not delete cache on sut.init',  () => {

        const cacheStore = new CacheStoreSpy()
        new LocalSavePurchases(cacheStore);

        expect(cacheStore.deleteCallsCount).toBe(0);
    })

    test('Should not delete cache on sut.save', async () => {

        const cacheStore = new CacheStoreSpy()
        const sut = new LocalSavePurchases(cacheStore);
        
        await sut.save();

        expect(cacheStore.deleteCallsCount).toBe(1);
    })
})
