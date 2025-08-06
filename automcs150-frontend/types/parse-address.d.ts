// types/parse-address.d.ts
declare module 'parse-address' {
    export function parseLocation(address: string): {
      number?: string;
      prefix?: string;
      suffix?: string;
      street?: string;
      type?: string;
      city?: string;
      state?: string;
      zip?: string;
      box?: string;
      sec_unit_type?: string;
      sec_unit_num?: string;
    };
  }
  