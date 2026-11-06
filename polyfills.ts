// Runtime polyfills for old Chrome (49+). Must stay the first import in main.tsx.
const g:any=typeof window!=='undefined'?window:{};
const def=(o:any,k:string,v:any)=>{if(!o[k])Object.defineProperty(o,k,{value:v,writable:true,configurable:true})};
if(!g.queueMicrotask)g.queueMicrotask=(f:()=>void)=>{Promise.resolve().then(f)};
def(Object,'assign',function(t:any){if(t==null)throw new TypeError('Cannot convert undefined or null to object');const to=Object(t);for(let i=1;i<arguments.length;i++){const s=arguments[i];if(s!=null)for(const k in s)if(Object.prototype.hasOwnProperty.call(s,k))to[k]=s[k]}return to});
def(Object,'entries',(o:any)=>Object.keys(o).map(k=>[k,o[k]]));
def(Object,'values',(o:any)=>Object.keys(o).map(k=>o[k]));
def(Array.prototype,'includes',function(this:any[],v:any,i?:number){const n=this.length;let k=i||0;if(k<0)k=Math.max(n+k,0);for(;k<n;k++){const x=this[k];if(x===v||(x!==x&&v!==v))return true}return false});
def(Array.prototype,'find',function(this:any[],f:(x:any,i:number,a:any[])=>boolean,t?:any){for(let i=0;i<this.length;i++)if(f.call(t,this[i],i,this))return this[i];return undefined});
def(Array,'from',function(a:any,f?:(x:any,i:number)=>any){const out:any[]=[];if(a==null)return out;if(typeof Symbol!=='undefined'&&Symbol.iterator&&a[Symbol.iterator]&&typeof a.length!=='number'){const it=a[Symbol.iterator]();let s;while(!(s=it.next()).done)out.push(s.value)}else for(let i=0;i<a.length;i++)out.push(a[i]);return f?out.map(f):out});
def(String.prototype,'includes',function(this:string,s:string,i?:number){return this.indexOf(s,i||0)!==-1});
def(Number,'isFinite',(n:any)=>typeof n==='number'&&isFinite(n));
def(Number,'isInteger',(n:any)=>typeof n==='number'&&isFinite(n)&&Math.floor(n)===n);
def(Number,'isSafeInteger',(n:any)=>Number.isInteger(n)&&Math.abs(n)<=9007199254740991);
if(typeof Promise!=='undefined'&&!(Promise.prototype as any).finally)(Promise.prototype as any).finally=function(this:Promise<any>,f:()=>void){return this.then((v:any)=>Promise.resolve(f()).then(()=>v),(e:any)=>Promise.resolve(f()).then(()=>{throw e}))};
export {};
