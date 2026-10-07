export const days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
export function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function minutes(value) { if(!/^\d{2}:\d{2}$/.test(value)) return null; const [h,m]=value.split(':').map(Number); return h<24&&m<60 ? h*60+m : null; }
export function duration(a,b,c='',d='') {
  let total=0; const intervals=[];
  for(const [start,end] of [[a,b],[c,d]]) {
    if(!start&&!end) continue;
    const x=minutes(start),y=minutes(end);
    if(x===null||y===null) return {error:'Complétez le début et la fin de chaque créneau.'};
    if(y<=x) return {error:'Le départ doit être après l’arrivée, le même jour.'};
    intervals.push([x,y]); total+=y-x;
  }
  if(intervals.length===2&&intervals[1][0]<intervals[0][1]) return {error:'Les deux créneaux se chevauchent ou ne sont pas dans l’ordre.'};
  return {total};
}
export function hours(value) { return `${Math.floor(value/60)} h ${String(value%60).padStart(2,'0')}`; }
export function monthDates(value) {
  if(!/^\d{4}-\d{2}$/.test(value)) return [];
  const [year,month]=value.split('-').map(Number);
  if(year<1900||year>2100||month<1||month>12) return [];
  return Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>{
    const date=new Date(Date.UTC(year,month-1,i+1));
    return {iso:`${value}-${String(i+1).padStart(2,'0')}`,number:i+1,weekday:(date.getUTCDay()+6)%7};
  });
}
export function monday(value) {
  const date=new Date(`${value}T12:00:00Z`);
  if(!value||Number.isNaN(date.getTime())) return null;
  date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7); return date;
}
export function dateLabel(value) { const date=new Date(`${value}T12:00:00Z`); return Number.isNaN(date.getTime())?'':date.toLocaleDateString('fr-FR',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}); }
export function csvCell(value) { let s=String(value??''); if(/^\s*[=+@\-]/.test(s)||/^[\t\r]/.test(s)) s="'"+s; return '"'+s.replaceAll('"','""')+'"'; }
