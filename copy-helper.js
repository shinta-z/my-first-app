(function(){
'use strict';
function copyText(text,button){
  function done(){var old=button.textContent;button.textContent='コピー済み';setTimeout(function(){button.textContent=old},900)}
  function fallback(){
    var ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.focus();ta.select();
    try{document.execCommand('copy');done()}catch(e){prompt('この文字をコピーしてください',text)}
    document.body.removeChild(ta);
  }
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(fallback)}else{fallback()}
}
function addCopyButtons(){
  var root=document.getElementById('segments');
  if(!root)return;
  root.querySelectorAll('[data-edit]').forEach(function(edit){
    var row=edit.closest('.segment');
    if(!row||row.querySelector('[data-copy-line]'))return;
    var btn=document.createElement('button');
    btn.className='tiny';
    btn.textContent='コピー';
    btn.setAttribute('data-copy-line','1');
    btn.addEventListener('click',function(){
      var text=row.querySelector('.txt');
      if(text)copyText(text.textContent||'',btn);
    });
    row.insertBefore(btn,edit);
  });
}
var observer=new MutationObserver(addCopyButtons);
function start(){
  var root=document.getElementById('segments');
  if(root){observer.observe(root,{childList:true,subtree:true});addCopyButtons()}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',start)}else{start()}
})();