import LightDomElement from "light-dom-element";

class JsonresumeElement extends LightDomElement
{
    async fetch( url )
    {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type')|| 'text/html';

        if( contentType.includes('json') )
        {   const data = this.obj2Html( await response.json() );
            console.log(data);
            return data;
        }
        return response.text();
    }
    obj2Html( obj, parentKeys=[] )
    {
        if( typeof obj === 'string')
            return obj;

        return Object.entries(obj).map( ([key,val])=>
        {   const slotName = [...parentKeys,key].join('-');
            if( Array.isArray(val) )
                return  val.map( arrObj=> this.obj2Html( arrObj,[...parentKeys,key] )  )
                            .join('\n');
            if( typeof val === 'string' )
                return `<div slot="${slotName}">${ val }</div>`
            // object
            return this.obj2Html(val,[...parentKeys,key]);
        }).join('\n')
    }
}
window.customElements.define('jsonresume-element', JsonresumeElement);
