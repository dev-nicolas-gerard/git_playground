import {days,escapeHtml as e,duration,hours,monthDates,monday,dateLabel,csvCell} from './core.mjs';
const type=document.body.dataset.tool,form=document.querySelector('#controls'),sheet=document.querySelector('#sheet'),status=document.querySelector('#status');
const tableData=new Map();let errors=[],total=0,currentRows=[];
const today=new Date();const localDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const value=name=>form.elements.namedItem(name)?.value||'';
const set=(name,v)=>{const input=form.elements.namedItem(name);if(input)input.value=v;};
if(form.elements.namedItem('month'))set('month',localDate.slice(0,7));
if(form.elements.namedItem('week'))set('week',localDate);
if(form.elements.namedItem('date'))set('date',localDate);
const person=()=>`<p class="sheet-meta">Enfant : ${e(value('child'))||'................................................................'}<br>Assistant(e) maternel(le) : ${e(value('caregiver'))||'........................................................'}</p>`;
const foot=()=>'<p class="sheet-foot">Mes Fiches Assmat · Modèle d’organisation · mes-fiches-assmat.pages.dev</p>';
function input(key,label,kind='time',readOnly=false){const v=tableData.get(key)||'';return `<input type="${kind}" data-key="${e(key)}" aria-label="${e(label)}" value="${e(v)}" ${readOnly?'readonly tabindex="-1"':''}><span class="print-value">${e(v)}</span>`;}
function weekDates(){const start=monday(value('week'));if(!start)return [];return Array.from({length:7},(_,i)=>{const d=new Date(start);d.setUTCDate(start.getUTCDate()+i);return {iso:d.toISOString().slice(0,10),weekday:i,number:d.getUTCDate()};});}
function rowState(key){return ['a','b','c','d'].map(k=>tableData.get(`${key}-${k}`)||'');}
function hourRows(rows,prefix,split=true,readOnly=false){return rows.map((d,i)=>{
 const key=prefix==='presence'?d.iso:`week-${i}`;const vals=rowState(key);const result=duration(...vals);if(result.error&&!readOnly)errors.push(`${days[d.weekday]} ${d.number} : ${result.error}`);if(!readOnly)total+=result.total||0;
 if(!readOnly)currentRows.push({...d,vals,total:result.total});
 return `<tr class="${d.weekday>4?'off':''}"><td>${days[d.weekday].slice(0,3)}. ${d.number}/${d.iso.slice(5,7)}</td><td>${input(`${key}-a`,`${days[d.weekday]} ${d.number} arrivée 1`,'time',readOnly)}</td><td>${input(`${key}-b`,`${days[d.weekday]} ${d.number} départ 1`,'time',readOnly)}</td>${split?`<td>${input(`${key}-c`,`${days[d.weekday]} ${d.number} arrivée 2`,'time',readOnly)}</td><td>${input(`${key}-d`,`${days[d.weekday]} ${d.number} départ 2`,'time',readOnly)}</td><td data-row-total="${key}">${result.error?'À corriger':result.total?hours(result.total):'—'}</td>`:''}</tr>`;
}).join('');}
function hourTable(rows,prefix,split=true,readOnly=false){return `<div class="table-scroll"><table class="${type==='presence'?'presence-table':''}"><thead><tr><th scope="col">Jour</th><th scope="col">${split?'Arrivée 1':'Arrivée'}</th><th scope="col">${split?'Départ 1':'Départ'}</th>${split?'<th scope="col">Arrivée 2</th><th scope="col">Départ 2</th><th scope="col">Durée</th>':''}</tr></thead><tbody>${hourRows(rows,prefix,split,readOnly)}</tbody></table></div>`;}
function render(){
 errors=[];total=0;currentRows=[];sheet.className='sheet';
 if(type==='presence'){
  const rows=monthDates(value('month'));if(!rows.length)errors.push('Choisissez un mois valide entre 1900 et 2100.');
  const date=rows.length?new Date(`${rows[0].iso}T12:00:00Z`).toLocaleDateString('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'}):'';
  sheet.innerHTML=`<h2>Feuille de présence · ${e(date)}</h2>${person()}${hourTable(rows,'presence')}<p class="total" id="total">Total de présence saisi : ${hours(total)}</p><p class="tiny">Deux créneaux possibles par jour. Ce total n’est pas un calcul de salaire.</p><div class="signature"><span>Relu par l’assistant(e) maternel(le) :<br>Date et signature :</span><span>Relu par le parent :<br>Date et signature :</span></div>${foot()}`;
 }
 if(type==='planning'){
  const rows=weekDates();if(!rows.length)errors.push('Choisissez une date valide.');
  sheet.innerHTML=`<h2>Planning d’accueil</h2><p class="sheet-meta">Semaine du ${e(dateLabel(rows[0]?.iso||''))}</p>${person()}${hourTable(rows,'week')}<p class="total" id="total">Total des horaires prévus : ${hours(total)}</p><div class="line-box"><h3>Notes et modifications</h3><div class="line-space"></div></div><div class="signature"><span>Préparé le :</span><span>Relu avec la famille :</span></div>${foot()}`;
 }
 if(type==='coupons'){
  const rows=weekDates().slice(0,5);if(!rows.length)errors.push('Choisissez une date valide.');
  sheet.innerHTML=`<div class="coupons">${Array.from({length:Number(value('copies'))||4},(_,i)=>`<div class="coupon"><h2>Horaires d’accueil · semaine du ${e(dateLabel(rows[0]?.iso||''))}</h2>${person()}${hourTable(rows,'week',false,i>0)}<p class="sheet-foot">Horaires prévus · À découper · Mes Fiches Assmat</p></div>`).join('')}</div>`;
 }
 if(type==='transmission'){
  if(!value('date'))errors.push('Choisissez une date.');
  const schedule=duration(value('arrival'),value('departure'));if(schedule.error)errors.push(schedule.error);
  sheet.classList.add('transmission-sheet');
  sheet.innerHTML=`<h2>Ma journée chez l’assistant(e) maternel(le)</h2><p class="sheet-meta">${e(dateLabel(value('date')))}</p>${person()}<p class="sheet-meta">Arrivée : ${e(value('arrival'))||'................'} · Départ : ${e(value('departure'))||'................'}</p>${[['meals','Repas et goûter'],['sleep','Sieste et repos'],['changes','Changes'],['activity','Activité et petit moment du jour'],['message','Message aux parents']].map(([key,title])=>`<section class="line-box"><h3>${title}</h3>${value(key)?e(value(key)):'<div class="line-space"></div>'}</section>`).join('')}${foot()}`;
 }
 if(type==='menus'){
  const rows=weekDates().slice(0,5);if(!rows.length)errors.push('Choisissez une date valide.');
  const cell=(key,label)=>`<textarea data-key="${key}" maxlength="250" aria-label="${label}">${e(tableData.get(key)||'')}</textarea><span class="print-value">${e(tableData.get(key)||'')}</span>`;
  sheet.innerHTML=`<h2>${e(value('heading'))||'Les menus de la semaine'}</h2><p class="sheet-meta">Semaine du ${e(dateLabel(rows[0]?.iso||''))}</p><div class="table-scroll"><table class="menu-table"><thead><tr><th scope="col">Jour</th><th scope="col">Déjeuner</th><th scope="col">Goûter</th></tr></thead><tbody>${rows.map((d,i)=>`<tr><td>${days[i]}<br>${d.number}/${d.iso.slice(5,7)}</td><td>${cell(`menu-${i}-lunch`,`${days[i]} déjeuner`)}</td><td>${cell(`menu-${i}-snack`,`${days[i]} goûter`)}</td></tr>`).join('')}</tbody></table></div><p class="sheet-foot">Repas prévus, susceptibles d’être adaptés. Tableau d’organisation sans recommandation nutritionnelle.</p>${foot()}`;
 }
 if(type==='etiquettes'){
  sheet.classList.add('labels-sheet');
  sheet.innerHTML=`<h2>Étiquettes prénom</h2><p class="sheet-meta">24 exemplaires · 60 × 30 mm · Imprimer à 100 %</p><div class="label-grid">${Array.from({length:24},()=>`<div class="name-label"><strong>${e(value('child'))||'Prénom'}</strong>${value('subtitle')?`<span>${e(value('subtitle'))}</span>`:''}</div>`).join('')}</div>${foot()}`;
 }
 showStatus();
}
function showStatus(){status.textContent=errors[0]||'';document.querySelector('#print').disabled=errors.length>0;const csv=document.querySelector('#csv');if(csv)csv.disabled=errors.length>0;}
function updateDurations(){
 errors=[];total=0;currentRows=[];
 const rows=type==='presence'?monthDates(value('month')):weekDates().slice(0,type==='coupons'?5:7);
 for(let i=0;i<rows.length;i++){
  const d=rows[i],key=type==='presence'?d.iso:`week-${i}`,vals=rowState(key),result=duration(...vals);
  if(result.error)errors.push(`${days[d.weekday]} ${d.number} : ${result.error}`);total+=result.total||0;currentRows.push({...d,vals,total:result.total});
  sheet.querySelectorAll(`[data-row-total="${key}"]`).forEach(el=>el.textContent=result.error?'À corriger':result.total?hours(result.total):'—');
 }
 const label=sheet.querySelector('#total');if(label)label.textContent=`${type==='presence'?'Total de présence saisi':'Total des horaires prévus'} : ${hours(total)}`;
 showStatus();
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('input',render);
sheet.addEventListener('input',event=>{
 const el=event.target;if(!el.dataset.key)return;tableData.set(el.dataset.key,el.value);
 // Update printed values and coupon copies without replacing the focused field.
 for(const peer of sheet.querySelectorAll('[data-key]'))if(peer.dataset.key===el.dataset.key){if(peer!==el)peer.value=el.value;peer.nextElementSibling.textContent=el.value;}
 if(['presence','planning','coupons'].includes(type))updateDurations();
});
document.querySelector('#print').addEventListener('click',()=>{if(form.reportValidity()&&!errors.length)window.print();});
document.querySelector('#reset').addEventListener('click',()=>{if(!window.confirm('Effacer tous les champs saisis sur cette fiche ?'))return;tableData.clear();form.reset();set('month',localDate.slice(0,7));set('week',localDate);set('date',localDate);render();status.textContent='La saisie a été effacée.';});
document.querySelector('#csv')?.addEventListener('click',()=>{
 if(errors.length||!form.reportValidity())return;
 const lines=[['Date','Prénom ou initiales','Assistant(e) maternel(le)','Arrivée 1','Départ 1','Arrivée 2','Départ 2','Durée en minutes'],...currentRows.map(d=>[d.iso,value('child'),value('caregiver'),...d.vals,d.total||0])];
 const blob=new Blob(['\ufeff'+lines.map(r=>r.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`presence-${value('month')}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();
