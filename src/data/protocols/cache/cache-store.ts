import { SavePurchases } from '@/domain/usecases/save-purchases';
export interface ICacheStore{

    delete(key:string) : void;
    insert(savePurchases : any, key:string):void;
  
}