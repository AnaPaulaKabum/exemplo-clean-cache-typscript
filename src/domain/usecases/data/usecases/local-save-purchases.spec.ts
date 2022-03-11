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
        new LocalSavePurchases(cacheStore);

        expect(cacheStore.deleteCallsCount).toBe(0);
    })

    test('Should not delete cache on sut.save', async () => {

        const {sut,cacheStore} = makeSut();
        
        await sut.save();

        expect(cacheStore.deleteCallsCount).toBe(1);
    })
})
