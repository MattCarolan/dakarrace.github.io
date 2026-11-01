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
document.querySelector('#privacy-open').addEventListener('click',()=>openDialog(document.querySelector('#privacy-dialog')));
document.querySelector('#enquiry-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const content=`DAKARRACE.COM / ROAD TO DAKAR 2030\nENQUIRY DRAFT - NOT SENT\n\nInterest: ${data.get('interest')}\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nThis message has not been sent. Keep it until the team's contact route is available.\n`;const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='dakarrace-enquiry-draft.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Your draft download has been requested. It has not been sent to the team.'});
document.querySelector('#year').textContent=new Date().getFullYear();
