const eventBus = {
  on(event:string, callback: (e: any) => void) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  },
  dispatch(event:string, data?:any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data ?? null }));
  },
  remove(event:string, callback: ()=>void) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;