var SR=String.fromCharCode(94),SF=String.fromCharCode(126),SC=String.fromCharCode(124),SP=String.fromCharCode(59);
var rows=[],allCods=[],PROVS={},EST={};
function fN(n){var s=Math.round(Math.abs(n)).toString(),r='';for(var i=0;i<s.length;i++){if(i>0&&(s.length-i)%3===0)r+='.';r+=s[i];}return '$'+r;}
function fI(n){var s=Math.round(Math.abs(n)).toString(),r='';for(var i=0;i<s.length;i++){if(i>0&&(s.length-i)%3===0)r+='.';r+=s[i];}return r;}
function pc(v,p){return p>0?Math.round(v/p*100):0;}
function cl(x){return x>=100?'gd':x>=80?'wn':'bd';}
function clr(x){return x>=100?'#276749':x>=80?'#b7791f':'#c53030';}
function clrB(x){return x>=100?'#1d4ed8':x>=80?'#0369a1':'#1e40af';}
function flt(v,p){return p-v>0?p-v:0;}
function Q(s){return '"'+s+'"';}
function pSec(ico,lbl,cls,monto,nc){return '<div class="ps2 '+cls+'2"><div class=ph><div class=pi2><span class=pio>'+ico+'</span><span class="pla pla-'+cls+'">'+lbl+'</span></div><span class="pm pm-'+cls+'">'+fN(monto)+'</span></div><div class=pme>'+fI(nc)+' cliente'+(nc!==1?'s':'')+'</div></div>';}
function initRows(raw){
  rows=raw.split(SR).filter(Boolean).map(function(r){
    var f=r.split(SF);
    var casas=(f[15]||'').split(SC).filter(Boolean).map(function(c){
      var p=c.split(SP);
      return{prov:p[0]||'',reg:p[1]||'',vt:+p[2]||0,pt:+p[3]||0,vi:+p[4]||0,pi:+p[5]||0,dv:+p[6]||0,pcp:+p[7]||0,vagp:+p[8]||0};
    });
    return{cod:f[0],v:f[1],tp:f[2]||'BASE',ci:f[3]||'?',reg:f[4]||'-',pa:+f[5]||0,pc:+f[6]||0,prc:+f[7]||0,prm:+f[8]||0,nca:+f[9]||0,ncc:+f[10]||0,ncrc:+f[11]||0,ncrm:+f[12]||0,rt:+f[13]||0,ri:+f[14]||0,casas:casas};
  });
  var s={};rows.forEach(function(r){s[r.cod]=1;});
  allCods=Object.keys(s).sort();
  popSel(allCods);
  render();
}
function popSel(cods){var el=document.getElementById('fcod');if(!el)return;el.innerHTML='<option value="">-- Selecciona --</option>';cods.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;el.appendChild(o);});}
function onSearch(){var q=(document.getElementById('fsrch')||{}).value||'';var f=q?allCods.filter(function(c){return c.toLowerCase().indexOf(q.toLowerCase())>=0;}):allCods;popSel(f);document.getElementById('fcod').value='';render();}
function doFilter(){render();}
function clearFilters(){var s=document.getElementById('fsrch');if(s)s.value='';popSel(allCods);var v=document.getElementById('fcod');if(v)v.value='';PROVS={};render();}
function render(){
  var qs=(document.getElementById('fsrch')||{}).value||'';
  var qc=(document.getElementById('fcod')||{}).value||'';
  var el=document.getElementById('out'),cnt=document.getElementById('fcnt');
  if(!rows.length){el.innerHTML='<div class=nr>Sin informacion.</div>';return;}
  if(!qs&&!qc){el.innerHTML='<div class=hint><div class=hi>&#128269;</div><p>Escribe tu codigo para ver tu seguimiento del mes.</p></div>';if(cnt)cnt.textContent='';return;}
  var lista=rows;
  if(qs&&!qc)lista=lista.filter(function(r){return r.cod.toLowerCase().indexOf(qs.toLowerCase())>=0;});
  if(qc)lista=lista.filter(function(r){return r.cod===qc;});
  if(cnt)cnt.textContent=lista.length+' vendedor(es)';
  if(!lista.length){el.innerHTML='<div class=nr>Codigo no encontrado.</div>';return;}
  var html='';lista.forEach(function(r){html+=renderCard(r);});el.innerHTML=html;
  setTimeout(function(){document.querySelectorAll('[data-w]').forEach(function(e){e.style.width=e.getAttribute('data-w')+'%';});},80);
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-est]');if(b){EST[b.getAttribute('data-cod')]=b.getAttribute('data-est');render();}});
function renderCard(r){
  var cod=r.cod,casas=r.casas;
  var provList=casas.map(function(c){return c.prov;}).filter(Boolean).sort();
  var provSel=PROVS[cod]||'';if(provSel&&provList.indexOf(provSel)<0){provSel='';PROVS[cod]='';}
  var filasD=provSel?casas.filter(function(c){return c.prov===provSel;}):casas;
  var regs={};casas.forEach(function(c){regs[c.reg]=1;});var regStr=Object.keys(regs).join(' | ');
  var tV=0,tP=0,tDV=0,tPCP=0,tVAGP=0;
  filasD.forEach(function(c){tV+=c.vt;tP+=c.pt;tDV+=c.dv;tPCP+=c.pcp;tVAGP+=c.vagp;});
  var tPROY=tV+tPCP,cmV=pc(tV,tP),pwV=Math.min(cmV,100),cmPROY=pc(tPROY,tP),fltV=flt(tV,tP),fltPROY=flt(tPROY,tP);
  var cmI=pc(r.ri,r.rt),pwI=Math.min(cmI,100),fltI=flt(r.ri,r.rt);
  var est=EST[cod]||'all';
  var sorted=filasD.slice().sort(function(a,b){return pc(a.vt,a.pt)-pc(b.vt,b.pt);});
  var shown=est==='ok'?sorted.filter(function(c){return c.pt>0&&pc(c.vt,c.pt)>=100;}):(est==='pend'?sorted.filter(function(c){return c.pt>0&&pc(c.vt,c.pt)<100;}):sorted);
  var nOk=sorted.filter(function(c){return c.pt>0&&pc(c.vt,c.pt)>=100;}).length;
  var nPd=sorted.filter(function(c){return c.pt>0&&pc(c.vt,c.pt)<100;}).length;
  var nSP=sorted.filter(function(c){return c.pt===0&&c.vt>0;}).length;
  var h='<div class=vc><div class=vh><div class=vn>'+r.v+'</div><div class=vco>Codigo: '+cod+'</div>';
  h+='<div class=vb><span class="bg b1">'+regStr+'</span><span class="bg b2">'+r.tp+'</span><span class="bg b3">CIA '+r.ci+'</span></div></div>';
  h+='<div class=vs><div class=st>$ Ventas del mes</div><div class=kg>';
  h+='<div class=ki><div class=kv style="color:#6b21a8">'+fN(tP)+'</div><div class=kl>Meta del mes</div></div>';
  h+='<div class=ki><div class=kv style="color:#1a56db">'+fN(tV)+'</div><div class=kl>Ya vendiste</div></div>';
  h+='<div class=ki><div class=kv><span class='+cl(cmV)+'>'+cmV+'%</span></div><div class=kl>Avance real</div></div>';
  h+='<div class=ki><div class=kv style="color:'+(fltV<=0?'#276749':'#c53030')+'">'+( fltV<=0?'&#127881; '+fN(0):fN(fltV))+'</div><div class=kl>'+(fltV<=0?'Lograste la meta!':'Falta facturar')+'</div></div></div>';
  h+='<div class=bw><div class=bt><div class=bf style="width:0%;background:'+clr(cmV)+'" data-w='+pwV+'></div></div>';
  h+='<div class=bl><span style="color:'+clr(cmV)+'">'+cmV+'% facturado</span><span style="color:#718096">Meta: '+fN(tP)+'</span></div></div>';
  h+='<div class=kg style="margin-top:4px">';
  h+='<div class=kp><div class=kv style="color:#1e40af">'+fN(tPROY)+'</div><div class=kl>&#128230; Fac+Comprometidos</div></div>';
  h+='<div class=kp><div class=kv><span style="color:'+clrB(cmPROY)+';font-weight:800">'+cmPROY+'%</span></div><div class=kl>% con comprometidos</div></div>';
  h+='<div class=kp><div class=kv style="color:'+(fltPROY<=0?'#276749':'#1e40af')+'">'+( fltPROY<=0?'&#9989; Asegurado':fN(fltPROY))+'</div><div class=kl>'+(fltPROY<=0?'Cierre asegurado':'Falta con comprometidos')+'</div></div></div>';
  if(tDV>0)h+='<div class=fd><span class=ld>&#9660; Devoluciones del mes</span><span class=ld>-'+fN(tDV)+'</span></div>';
  if(tVAGP>0)h+='<div class=fa><span class=la>&#128683; Agotados del mes</span><span class=la>-'+fN(tVAGP)+'</span></div>';
  h+='</div>';
  h+='<div class=vs><div class=st>&#128230; Pedidos activos</div>';
  if(r.pa>0) h+=pSec('&#9989;','Aprobados','ap',r.pa,r.nca);
  if(r.pc>0) h+=pSec('&#128230;','Comprometidos','co',r.pc,r.ncc);
  if(r.prc>0)h+=pSec('&#9888;','Ret. Cartera','rc',r.prc,r.ncrc);
  if(r.prm>0)h+=pSec('&#9888;','Ret. Margen','rm',r.prm,r.ncrm);
  if(!r.pa&&!r.pc&&!r.prc&&!r.prm)h+='<p style="font-size:12px;color:#9ca3af;font-style:italic;padding:4px 0">Sin pedidos activos.</p>';
  h+='</div>';
  h+='<div class=vs><div class=st># Clientes de la ruta</div><div class=kg>';
  h+='<div class=ki><div class=kv style="color:#6b21a8">'+fI(r.rt)+'</div><div class=kl>En tu ruta</div></div>';
  h+='<div class=ki><div class=kv style="color:#1a56db">'+fI(r.ri)+'</div><div class=kl>Ya compraron</div></div>';
  h+='<div class=ki><div class=kv><span class='+cl(cmI)+'>'+cmI+'%</span></div><div class=kl>Cobertura</div></div>';
  h+='<div class=ki><div class=kv style="color:'+(fltI<=0?'#276749':'#c53030')+'">'+( fltI<=0?'&#127881; 0':fI(fltI))+'</div><div class=kl>'+(fltI<=0?'Ruta completa!':'Por vender')+'</div></div></div>';
  h+='<div class=bw><div class=bt><div class=bf style="width:0%;background:'+clr(cmI)+'" data-w='+pwI+'></div></div>';
  h+='<div class=bl><span style="color:'+clr(cmI)+'">'+cmI+'% cobertura</span><span style="color:#718096">Ruta: '+fI(r.rt)+' clientes</span></div></div></div>';
  h+='<div class=vs><div class=st>Detalle por casa comercial</div>';
  var pOpts='<option value="">Todas las casas</option>'+provList.map(function(p){return '<option value="'+p+'"'+(p===provSel?' selected':'')+'>'+p+'</option>';}).join('');
  h+='<div class=tb><select class=fs style="max-width:240px;min-width:200px;height:29px;padding:3px 8px" onchange="PROVS[\''+cod+'\']=this.value;render()">'+pOpts+'</select>';
  h+='<button class="bn'+(est==='all'?' act':'')+'" data-cod="'+cod+'" data-est="all">Todas ('+sorted.length+')';
  if(nSP>0)h+=' <span class=sb>'+nSP+' s/Ppto</span>';
  h+='</button> <button class="bn bok'+(est==='ok'?' act':'')+'" data-cod="'+cod+'" data-est="ok">&#9989; Cumplidas ('+nOk+')</button> ';
  h+='<button class="bn bpd'+(est==='pend'?' act':'')+'" data-cod="'+cod+'" data-est="pend">&#128680; Pendientes ('+nPd+')</button></div><div class=pg>';
  shown.forEach(function(c){
    var sp=c.pt===0&&c.vt>0,rPROY=c.vt+c.pcp,dfV=flt(rPROY,c.pt);
    var dcV=pc(c.vt,c.pt),dpwV=Math.min(dcV,100),dcPROY=pc(rPROY,c.pt);
    var dcI=pc(c.vi,c.pi),dfI=flt(c.vi,c.pi);
    var cls=sp?'pc psp':(dcV>=100?'pc pok':'pc ppd');
    h+='<div class="'+cls+'">';
    h+='<div class=pn>'+c.prov+(sp?'<span class=sb>S/Ppto</span>':'')+'</div><div class=pr>'+c.reg+'</div>';
    h+='<div class=ps>$ Ventas</div>';
    h+='<div class=pw><span class=pl>Meta</span><span class=pv style="color:#6b21a8">'+fN(c.pt)+'</span></div>';
    h+='<div class=pw><span class=pl>Facturado</span><span class=pv style="color:#1a56db">'+fN(c.vt)+'</span></div>';
    h+='<div class=pw><span class=pl>Avance</span><span class=pv>'+(sp?'<span style="color:#d97706">Venta libre</span>':'<span class='+cl(dcV)+'>'+dcV+'%</span>')+'</span></div>';
    if(!sp){
      h+='<div class=fp><span class=lp>&#128230; V+Comprometidos</span><span class=vp>'+fN(rPROY)+'</span></div>';
      h+='<div class=fp><span class=lp>% con comprom.</span><span class=vp><span style="color:'+clrB(dcPROY)+'">'+dcPROY+'%</span></span></div>';
      h+='<div class="ff '+(dfV<=0?'ffg':'ffr')+'"><span class="lf '+(dfV<=0?'lfg':'lfr')+'">'+(dfV<=0?'&#127881; Cumplida!':'Falta para meta')+'</span><span class='+(dfV<=0?'vfg':'vfr')+'>'+fN(dfV)+'</span></div>';
      h+='<div class=bw style="margin:5px 0 3px"><div class=bt><div class=bf style="width:0%;background:'+clr(dcV)+'" data-w='+dpwV+'></div></div>';
      h+='<div class=bl><span style="color:'+clr(dcV)+'">'+dcV+'%</span><span style="color:'+clrB(dcPROY)+'">'+dcPROY+'% c/ped.</span></div></div>';
    }
    if(c.dv>0)h+='<div class=fd><span class=ld>&#9660; Devoluciones</span><span class=ld>-'+fN(c.dv)+'</span></div>';
    if(c.vagp>0)h+='<div class=fa><span class=la>&#128683; Agotados</span><span class=la>-'+fN(c.vagp)+'</span></div>';
    h+='<div class=ps># Impactos</div>';
    h+='<div class=pw><span class=pl>Ppto Imp.</span><span class=pv style="color:#6b21a8">'+fI(c.pi)+'</span></div>';
    h+='<div class=pw><span class=pl>Logrados</span><span class=pv style="color:#1a56db">'+fI(c.vi)+'</span></div>';
    h+='<div class=pw><span class=pl>Avance</span><span class=pv><span class='+cl(dcI)+'>'+dcI+'%</span></span></div>';
    h+='<div class=pw><span class=pl>'+(dfI>0?'Por lograr':'&#127881; Completo')+'</span><span class=pv style="color:'+(dfI>0?'#c53030':'#276749')+'">'+(dfI>0?fI(dfI):'0')+'</span></div>';
    h+='</div>';
  });
  h+='</div></div></div>';
  return h;
}
