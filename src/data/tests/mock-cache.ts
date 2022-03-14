import { SavePurchases } from "@/domain/usecases";
import { ICacheStore } from "@/data/protocols/cache";

export class CacheStoreSpy implements ICacheStore{

    actions: Array<CacheStoreSpy.Action> = []
    deleteKey: string
    insertKey: string
    fetchKey: string
    insertValues: Array<SavePurchases.Params> = []
    fetchResult: any
  
    fetch (key: string): any {
      this.actions.push(CacheStoreSpy.Action.fetch)
      this.fetchKey = key
      return this.fetchResult
    }
  
    delete (key: string): void {
      this.actions.push(CacheStoreSpy.Action.delete)
      this.deleteKey = key
    }
    
    insert (value: any,key: string, ): void {
      this.actions.push(CacheStoreSpy.Action.insert)
      this.insertKey = key
      this.insertValues = value
    }
  
    replace (key: string, value: any): void {
      this.delete(key)
      this.insert(key, value)
    }

    simuleDeleteError (): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
          this.actions.push(CacheStoreSpy.Action.delete)
          throw new Error()
        })
      }
    
      simuleInsertError (): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
          this.actions.push(CacheStoreSpy.Action.insert)
          throw new Error()
        })
      }
}

export namespace CacheStoreSpy {
    export enum Action {
      delete,
      insert,
      fetch
    }
  }