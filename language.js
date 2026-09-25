/* Translate presentation only, preserving game state and event handlers. */
function translateEnglish(source) {
  const text=source.trim();
  let translated=englishTranslations[text];
  if(translated===undefined){
    const decorated=text.match(/^([✓↗]|\d+\.)\s+(.+)$/);
    const progress=text.match(/^(\d+) af (\d+) stöðum skoðaðir( — flott könnunarferð!)?$/);
    if(decorated && englishTranslations[decorated[2]])translated=decorated[1]+' '+englishTranslations[decorated[2]];
    else if(progress)translated=`${progress[1]} of ${progress[2]} places explored${progress[3]?' — great exploring!':''}`;
  }
  return translated===undefined?source:source.replace(text,()=>translated);
}
if(typeof module!=='undefined')module.exports={translateEnglish};
if(typeof document!=='undefined'){
  const originals=new WeakMap();
  let language='is';
  try{if(localStorage.getItem('fristund-language')==='en')language='en'}catch{}
  const logo=document.querySelector('.brand');
  const attributes=['aria-label','alt','title'];
  function localize(node,key,read,write){
    let entries=originals.get(node);
    if(!entries){entries={};originals.set(node,entries)}
    const value=read();
    if(!entries[key] || entries[key].rendered!==value)entries[key]={source:value,rendered:value};
    const entry=entries[key];
    const result=language==='en'?translateEnglish(entry.source):entry.source;
    if(result!==value)write(result);
    entry.rendered=result;
  }
  const observer=new MutationObserver(refresh);
  function refresh(){
    observer.disconnect();
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.parentElement.closest('script,style,.brand'))continue;
      const textNode=node;
      localize(textNode,'text',()=>textNode.nodeValue,value=>{textNode.nodeValue=value});
    }
    document.querySelectorAll('[aria-label],[alt],[title]').forEach(el=>{
      if(el===logo)return;
      for(const attr of attributes)if(el.hasAttribute(attr))localize(el,attr,()=>el.getAttribute(attr),value=>el.setAttribute(attr,value));
    });
    document.documentElement.lang=language;
    document.title=language==='en'?'After-school — Leikurinn':'Frístund — The game';
    logo.innerHTML=language==='en'?'after-school<span>LEIKURINN</span><small><img class="language-globe" src="assets/globe.svg" alt="" aria-hidden="true"></small>':'frístund<span>THE GAME</span><small><img class="language-globe" src="assets/globe.svg" alt="" aria-hidden="true"></small>';
    logo.setAttribute('aria-label',language==='en'?'Switch to Icelandic':'Skipta yfir á ensku');
    logo.title=language==='en'?'Switch to Icelandic':'Skipta yfir á ensku';
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  }
  logo.addEventListener('click',()=>{
    language=language==='is'?'en':'is';
    try{localStorage.setItem('fristund-language',language)}catch{}
    refresh();
  });
  refresh();
}
