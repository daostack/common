import {LocalStorageValue} from '~/Services';

export class LocalStoageStore {
  onboarded = new LocalStorageValue<boolean>({
    key: 'onboarding',
    encode: (value) => (value ? 'true' : 'false'),
    decode: (payload) => payload === 'true',
  });
}

// examples of how to use LocalStorageValue:
/**
 interface WineCellar {
   storage: {
     year: number;
     name: string;
   }[];
 }

 const wineCellar = new LocalStorageValue<WineCellar>({
   key: 'onboarding',
   encode: (value) => JSON.stringify(value),
   decode: (payload) =>
     payload
       ? JSON.parse(payload)
       : {
           storage: [
             {
               year: 19023,
               name: 'amos',
             },
           ],
         },
 });
 
 
 wineCellar.set({
   storage: [
     {
       year: 19023,
       name: 'amos',
     },
   ],
 });
 
 wineCellar.value;

 */
