export const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function number(value){return Number(String(value).trim().replace(',','.'));}
export function piecesFrom(text){
 const rows=String(text).trim().split(/\n/).filter(s=>s.trim());
 if(!rows.length)throw Error('Ajoutez au moins une pièce.');
 const pieces=[];
 rows.forEach((row,i)=>{const m=row.trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:[x×*;]\s*(\d+))?(?:\s*:\s*(.{1,40}))?$/i);if(!m)throw Error(`Ligne ${i+1} : utilisez « longueur x quantité : nom », par exemple 800 x 4 : montant.`);
 const length=number(m[1]),qty=Number(m[2]||1);if(length<1||length>100000||qty<1||qty>200)throw Error(`Ligne ${i+1} : longueur de 1 à 100 000 mm, quantité de 1 à 200.`);
 if(pieces.length+qty>200)throw Error('Limite : 200 pièces par calcul.');
 for(let j=0;j<qty;j++)pieces.push({length:Math.round(length*1000),label:m[3]?.trim()||`Pièce ${i+1}`,id:pieces.length+1});});return pieces;
}
// Integer micrometres prevent decimal rounding from creating impossible layouts.
export function plan(pieces,stock,kerf=3,margin=0){
 stock=number(stock);kerf=number(kerf);margin=number(margin);
 if(!Number.isFinite(stock)||stock<1||stock>100000||!Number.isFinite(kerf)||kerf<0||kerf>20||!Number.isFinite(margin)||margin<0||margin>=stock)throw Error('Vérifiez la barre (1 à 100 000 mm), le trait de scie (0 à 20 mm) et la réserve aux extrémités.');
 const S=Math.round(stock*1000),K=Math.round(kerf*1000),M=Math.round(margin*1000),cap=S-M;
 if(!pieces.length||pieces.length>200)throw Error('Le calcul nécessite de 1 à 200 pièces.');
 const tooLong=pieces.find(p=>!Number.isInteger(p.length)||p.length<=0||p.length>cap);if(tooLong)throw Error(`${tooLong.label} (${tooLong.length/1000} mm) dépasse la longueur utilisable de ${cap/1000} mm.`);
 const desc=[...pieces].sort((a,b)=>b.length-a.length||a.id-b.id);
 function pack(order,best){const bars=[];for(const p of order){let chosen=-1,space=Infinity;for(let i=0;i<bars.length;i++){const b=bars[i],cost=p.length+(b.pieces.length?K:0),left=cap-b.used-cost;if(left>=0&&(!best||left<space)){chosen=i;space=left;if(!best)break;}}
 if(chosen<0){bars.push({pieces:[],used:0});chosen=bars.length-1;}const b=bars[chosen];b.used+=p.length+(b.pieces.length?K:0);b.pieces.push(p);}return bars;}
 const choices=[pack(desc,true),pack(desc,false),pack([...desc].reverse(),true),pack(pieces,false)];
 choices.sort((a,b)=>a.length-b.length||Math.max(...b.map(x=>cap-x.used))-Math.max(...a.map(x=>cap-x.used)));
 const bars=choices[0].map((b,i)=>{const gap=cap-b.used,tailKerf=Math.min(K,gap);return {index:i+1,pieces:b.pieces.map(p=>({...p,length:p.length/1000})),stock:S/1000,reserve:M/1000,kerf:((b.pieces.length-1)*K+tailKerf)/1000,tailKerf:tailKerf/1000,offcut:(gap-tailKerf)/1000};});
 const total=bars.length*S/1000,useful=pieces.reduce((sum,p)=>sum+p.length,0)/1000;
 return {bars,total,useful,offcut:bars.reduce((s,b)=>s+b.offcut,0),loss:bars.reduce((s,b)=>s+b.kerf+b.reserve,0),yield:useful/total*100,lowerBound:Math.ceil(pieces.reduce((s,p)=>s+p.length,0)/cap),kerfWidth:K/1000};
}
export function csv(result){const q=v=>'"'+String(v).replaceAll('"','""')+'"';return '\ufeff'+['Barre;Pièce;Longueur (mm);Chute finale (mm)',...result.bars.flatMap(b=>b.pieces.map(p=>[b.index,q(p.label.startsWith('=')||/^[+@-]/.test(p.label)?"'"+p.label:p.label),p.length,b.offcut].join(';')))].join('\r\n');}
