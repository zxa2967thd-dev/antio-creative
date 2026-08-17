const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
const header=document.querySelector('.site-header');

menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});

document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  }
}),{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();

const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>40);
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

// Gallery lightbox used on portfolio detail pages.
const lightbox=document.querySelector('.lightbox');
const lightboxImage=lightbox?.querySelector('img');
document.querySelectorAll('button.gallery-item').forEach(button=>button.addEventListener('click',()=>{
  if(!lightbox||!lightboxImage) return;
  const image=button.querySelector('img');
  lightboxImage.src=image.src;
  lightboxImage.alt=image.alt;
  lightbox.classList.add('open');
  document.body.style.overflow='hidden';
}));
const closeLightbox=()=>{if(!lightbox)return;lightbox.classList.remove('open');document.body.style.overflow='';};
lightbox?.querySelector('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeLightbox();});

// Contact form — submits via Web3Forms, no page reload, no backend needed.
const contactForm=document.getElementById('contact-form');
const formStatus=document.getElementById('form-status');
contactForm?.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const submitBtn=contactForm.querySelector('button[type="submit"]');
  const originalLabel=submitBtn.textContent;

  if(contactForm.botcheck.value!==''){return;} // honeypot tripped, silently drop

  submitBtn.disabled=true;
  submitBtn.textContent='Sending…';
  formStatus.textContent='';
  formStatus.className='form-status';

  try{
    const response=await fetch(contactForm.action,{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result=await response.json();
    if(response.ok&&result.success){
      formStatus.textContent="Thanks — that's in. You'll hear back within a day.";
      formStatus.classList.add('success');
      contactForm.reset();
    }else{
      throw new Error(result.message||'Submission failed');
    }
  }catch(err){
    formStatus.textContent='Something went wrong. Please email Zacharyantaya@gmail.com directly.';
    formStatus.classList.add('error');
  }finally{
    submitBtn.disabled=false;
    submitBtn.textContent=originalLabel;
  }
});
