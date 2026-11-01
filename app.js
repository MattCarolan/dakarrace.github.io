const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}));
const enquiry=document.querySelector('#enquiry-dialog');
const dialogs=[...document.querySelectorAll('dialog')];
let previousFocus;
function openDialog(dialog){previousFocus=document.activeElement;dialogs.forEach(d=>{if(d.open)d.close()});dialog.showModal();document.body.classList.add('modal-open')}
dialogs.forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(!dialogs.some(d=>d.open)){document.body.classList.remove('modal-open');previousFocus?.focus()}});dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}})});
document.querySelectorAll('[data-enquiry]').forEach(button=>button.addEventListener('click',()=>{enquiry.querySelector('select').value=button.dataset.enquiry;document.querySelector('#form-status').textContent='';openDialog(enquiry)}));
document.querySelector('#read-journal').addEventListener('click',()=>openDialog(document.querySelector('#journal-dialog')));
document.querySelectorAll('#privacy-open, [data-privacy]').forEach(button=>button.addEventListener('click',()=>openDialog(document.querySelector('#privacy-dialog'))));
const form=document.querySelector('#enquiry-form');
let sending=false;
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending || !form.reportValidity())return;
  const data=new FormData(form);
  if(data.get('_honey'))return;
  const status=document.querySelector('#form-status');
  const button=form.querySelector('[type="submit"]');
  const originalLabel=button.innerHTML;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  sending=true;
  button.disabled=true;
  button.textContent='SENDING…';
  form.setAttribute('aria-busy','true');
  status.textContent='Submitting your enquiry…';
  try{
    const response=await fetch('https://formsubmit.co/ajax/matt@mattcarolan.net',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(Object.fromEntries(data)),
      signal:controller.signal
    });
    if(!response.ok)throw new Error('Service unavailable');
    const result=await response.json();
    if(result.success!==true && result.success!=='true')throw new Error('Submission not accepted');
    status.textContent='Thank you. Your enquiry has been accepted by our email service for the team. We look forward to talking with you.';
    form.reset();
  }catch(error){
    status.textContent=error.name==='AbortError'
      ?'The email service did not respond in time, so we cannot confirm submission. Your message is still here. You can try again or email matt@mattcarolan.net.'
      :'We could not confirm your submission. Your message is still here. Please try again or email matt@mattcarolan.net.';
  }finally{
    clearTimeout(timeout);
    sending=false;
    button.disabled=false;
    button.innerHTML=originalLabel;
    form.removeAttribute('aria-busy');
  }
});
document.querySelector('#year').textContent=new Date().getFullYear();
