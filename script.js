'use strict';
// VRK Detailing demo. All content, previews and form state are processed locally.
const works = [
  {id:'lexus',title:'Lexus LX570',date:'15 ноября 2026',kind:'salon',kindText:'Комплексный уход',description:'Двухфазная мойка, химчистка салона, полировка оптики и мойка подкапотного пространства.',services:['Двухфазная мойка','Химчистка салона','Полировка фар'],note:'По публикации VRK также выполнялась мойка подкапотного пространства. Её возможность следует уточнить напрямую.'},
  {id:'l200',title:'Mitsubishi L200',date:'15 ноября 2026',kind:'wash',kindText:'Мойка / салон',description:'Двухфазная мойка, влажная уборка салона и полировка фары.',services:['Двухфазная мойка','Влажная уборка салона','Полировка фар'],note:'Указана именно влажная уборка, не полная химчистка салона.'},
  {id:'tank',title:'Tank 300',date:'15 ноября 2026',kind:'optics',kindText:'Стёкла',description:'В публикации показана реставрация трещины на автомобильном стекле.',services:['Ремонт стекла'],note:'Возможность работы с конкретным повреждением требует предварительной оценки.'},
  {id:'octavia',title:'Škoda Octavia',date:'4 ноября 2026',kind:'salon',kindText:'Комплексный уход',description:'Двухфазная мойка, химчистка салона и обработка стекла составом «Антидождь».',services:['Двухфазная мойка','Химчистка салона','Антидождь'],note:'Состав услуг приведён по опубликованному кейсу, не является типовым пакетом.'},
  {id:'accent',title:'Hyundai Accent',date:'13 ноября 2026',kind:'wash',kindText:'Мойка кузова',description:'Двухфазная мойка кузова.',services:['Двухфазная мойка'],note:'Конкретные дополнительные обработки в публикации не заявлены.'},
  {id:'polo',title:'Volkswagen Polo',date:'10 ноября 2026',kind:'wash',kindText:'Мойка / детали',description:'Двухфазная мойка с дополнительным уходом за пластиком.',services:['Двухфазная мойка','Другая задача'],note:'Уход за пластиком обсуждается индивидуально.'},
  {id:'niva',title:'Lada Niva',date:'10 ноября 2026',kind:'optics',kindText:'Оптика',description:'Замена штатных фар на BiLED, согласно описанию выполненной работы.',services:['Другая задача'],note:'Это пример отдельной работы, а не подтверждённый постоянный ассортимент или услуга.'},
  {id:'monjaro',title:'Geely Monjaro',date:'10 ноября 2026',kind:'season',kindText:'Сезонный уход',description:'Решение проблемы замерзания дверных замков.',services:['Другая задача'],note:'Возможность аналогичного ремонта или обслуживания уточняется у мастера.'}
];
const qs = (sel, base=document)=>base.querySelector(sel);
const qsa = (sel, base=document)=>[...base.querySelectorAll(sel)];
const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const workGrid=qs('#work-grid'), workDialog=qs('#work-dialog'), dialogContent=qs('#dialog-content');
const mapImg=id=>`assets/car-${id}.svg`;
function renderWorks(){
  workGrid.innerHTML = works.map((w,i)=>`<article class="work-card ${i===0?'is-featured':''}" data-id="${w.id}" data-kind="${w.kind}"><div class="work-picture"><img src="${mapImg(w.id)}" width="850" height="540" alt="Авторский эскиз автомобиля для карточки ${w.title}" loading="eager"><span class="image-label">ДЕМОНСТРАЦИОННЫЙ ЭСКИЗ</span></div><div class="work-data"><div class="work-meta"><span>${w.kindText.toUpperCase()}</span><span>${w.date}</span></div><h3>${w.title}</h3><p class="work-desc">${w.description}</p><div class="work-bottomline"><span>Подробнее о работе</span><button class="work-open" type="button" data-open="${w.id}" aria-label="Подробнее: ${w.title}">${icon('arrow-up')}</button></div></div></article>`).join('');
}
renderWorks();
qsa('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  const filter=btn.dataset.filter;
  qsa('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  let first=true;
  qsa('.work-card').forEach(card=>{const w=works.find(item=>item.id===card.dataset.id); const show=filter==='all' || w.kind===filter || (filter==='optics' && ['polo','niva'].includes(w.id)) || (filter==='season' && ['octavia','monjaro'].includes(w.id));card.hidden=!show;card.classList.toggle('is-featured',show&&first);if(show)first=false;});
}));
function openWork(w){
  dialogContent.innerHTML=`<div class="dialog-visual"><img src="${mapImg(w.id)}" width="850" height="540" alt="Авторская иллюстрация автомобиля ${w.title}"></div><div class="dialog-body"><span class="dialog-meta">${w.date.toUpperCase()} · ${w.kindText.toUpperCase()}</span><h2>${w.title}</h2><p>${w.description}</p><div class="dialog-services">${w.services.map(s=>`<span>${s}</span>`).join('')}</div><p class="dialog-note">${w.note} Изображение — авторский эскиз, не фотография данного автомобиля. Детали кейса взяты из описания в сообществе VRK Detailing.</p><div class="dialog-actions"><button type="button" class="btn btn-accent" id="similar-care">Обсудить похожий уход ${icon('arrow-up')}</button><a href="https://vk.com/vrkdetailing" class="btn btn-outline" rel="noopener noreferrer" target="_blank">Открыть VK ${icon('arrow-up')}</a></div></div>`;
  workDialog.showModal();
  qs('#similar-care').addEventListener('click',()=>{
    applyServices(w.services);
    qs('#car-model').value=w.title;
    const carTypes={lexus:'Внедорожник',l200:'Пикап',tank:'Внедорожник',octavia:'Седан',accent:'Седан',polo:'Седан',niva:'Внедорожник',monjaro:'Кроссовер'};
    const inferred=qsa('input[name="vehicle"]').find(r=>r.value===carTypes[w.id]);
    if(inferred)inferred.checked=true;
    updateSummary();
    workDialog.close();
    scrollToBooking();
    showToast('Услуги из кейса добавлены в вашу заявку');
  });
}
workGrid.addEventListener('click',e=>{const btn=e.target.closest('[data-open]');if(!btn)return;const w=works.find(x=>x.id===btn.dataset.open);if(w)openWork(w);});
qs('#dialog-close').addEventListener('click',()=>workDialog.close());
workDialog.addEventListener('click',e=>{if(e.target===workDialog)workDialog.close();});
const workServices=qsa('#service-checks input[type="checkbox"]');
function applyServices(services){workServices.forEach(checkbox=>checkbox.checked=services.includes(checkbox.value));updateSummary();}
function scrollToBooking(){qs('#booking').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
qsa('.pick-service').forEach(btn=>btn.addEventListener('click',()=>{
  workServices.forEach(input=>{if(input.value===btn.dataset.service)input.checked=true;});
  updateSummary();scrollToBooking();showToast('Услуга добавлена в заявку');
}));
const presets={exterior:['Двухфазная мойка','Защитная обработка'],interior:['Химчистка салона','Влажная уборка салона'],combo:['Двухфазная мойка','Химчистка салона','Полировка фар']};
qsa('.choose-preset').forEach(btn=>btn.addEventListener('click',()=>{applyServices(presets[btn.dataset.preset]||[]);scrollToBooking();showToast('Сценарий ухода выбран — можно уточнить детали');}));
const compare=qs('#compare'),compareRange=qs('#compare-range');
compareRange.addEventListener('input',()=>compare.style.setProperty('--split',compareRange.value+'%'));

// Main request builder. Nothing is uploaded, stored or transmitted by this site.
const carModel=qs('#car-model'),carCondition=qs('#car-condition'),schedule=qs('#schedule'),comment=qs('#comment'),summaryText=qs('#summary-text'),status=qs('#summary-status');
const photosInput=qs('#car-photos'),photosList=qs('#photo-list'),photosWarning=qs('#upload-warning');
const MAX_PHOTOS=3,MAX_BYTES=8*1024*1024,VALID_TYPES=['image/jpeg','image/png','image/webp'];
let photos=[];
function selectedServices(){return workServices.filter(c=>c.checked).map(c=>c.value);}
function currentSummary(){
  const vehicle=qs('input[name="vehicle"]:checked')?.value||'Не указан';
  const model=carModel.value.trim()||'не указана';
  const services=selectedServices();
  return [`Здравствуйте! Хочу уточнить стоимость и запись в VRK Detailing.`, ``, `Автомобиль: ${vehicle}${model==='не указана'?'':', '+model}`, `Услуги: ${services.length?services.join('; '):'нужна консультация по услугам'}`, `Состояние / задача: ${carCondition.value}`,`Когда удобно: ${schedule.value}`,`Пожелания: ${comment.value.trim()||'нет'}`,`Фото автомобиля: ${photos.length} шт. (прикреплю отдельно при необходимости)`, ``, `Подскажите, пожалуйста, возможность выполнения, стоимость и время.`].join('\n');
}
function updateSummary(){summaryText.textContent=currentSummary();status.textContent='';}
qsa('#booking-form input:not([type="file"]),#booking-form select,#booking-form textarea').forEach(el=>{el.addEventListener('change',updateSummary);el.addEventListener('input',updateSummary);});
function renderPhotos(){
  photosList.innerHTML='';
  photos.forEach((photo,index)=>{
    const item=document.createElement('div');item.className='photo-item';
    const img=document.createElement('img');img.src=photo.url;img.alt='Выбранное изображение: '+photo.file.name;
    const remove=document.createElement('button');remove.type='button';remove.setAttribute('aria-label','Удалить изображение '+photo.file.name);remove.innerHTML=icon('trash');
    remove.addEventListener('click',()=>{URL.revokeObjectURL(photo.url);photos.splice(index,1);renderPhotos();updateSummary();});
    item.append(img,remove);photosList.append(item);
  });
  updateSummary();
}
function warnPhotos(message){photosWarning.textContent=message;photosWarning.hidden=!message;}
photosInput.addEventListener('change',()=>{
  const incoming=[...photosInput.files];const warnings=[];
  for(const file of incoming){
    if(photos.length>=MAX_PHOTOS){warnings.push('Можно выбрать не более трёх фотографий.');break;}
    if(!VALID_TYPES.includes(file.type)){warnings.push(`Файл «${file.name}» не поддерживается.`);continue;}
    if(file.size>MAX_BYTES){warnings.push(`«${file.name}»: файл больше 8 МБ.`);continue;}
    if(photos.some(p=>p.file.name===file.name&&p.file.size===file.size&&p.file.lastModified===file.lastModified))continue;
    photos.push({file,url:URL.createObjectURL(file)});
  }
  warnPhotos([...new Set(warnings)].join(' '));
  photosInput.value='';renderPhotos();
});
window.addEventListener('pagehide',()=>photos.forEach(p=>URL.revokeObjectURL(p.url)));
async function copyText(text){
  if(navigator.clipboard && window.isSecureContext){try{await navigator.clipboard.writeText(text);return true;}catch(_e){/* fallback */}}
  const temp=document.createElement('textarea');temp.value=text;temp.style.position='fixed';temp.style.left='-9999px';temp.setAttribute('aria-hidden','true');document.body.appendChild(temp);temp.select();let ok=false;
  try{ok=document.execCommand('copy');}catch(_e){ok=false;}temp.remove();return ok;
}
let toastTimer;
function showToast(message){const toast=qs('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2900);}
qs('#copy-request').addEventListener('click',async()=>{
  const copied=await copyText(currentSummary());
  if(copied){showToast('Заявка скопирована. Откройте VK и вставьте текст.');status.textContent='Текст скопирован. Фотографии приложите в VK вручную.';}
  else{showToast('Не удалось скопировать автоматически — выделите текст заявки вручную.');status.textContent='Скопируйте текст из блока выше вручную.';}
});
qs('#booking-form').addEventListener('submit',e=>{e.preventDefault();updateSummary();status.textContent='Заявка готова. Скопируйте текст и отправьте его в VK; время пока не забронировано.';if(window.innerWidth<=860)qs('.summary-box').scrollIntoView({behavior:'smooth',block:'start'});showToast('Заявка подготовлена. Осталось связаться с VRK.');});
updateSummary();
// Mobile navigation; every menu action closes the overlay.
const menu=qs('#site-nav'),menuBtn=qs('#menu-toggle');
menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menuBtn.innerHTML=icon(open?'close':'menu');});
qsa('#site-nav a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Открыть меню');menuBtn.innerHTML=icon('menu');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.innerHTML=icon('menu');}});
