const qs=(s,p=document)=>p.querySelector(s);const qsa=(s,p=document)=>[...p.querySelectorAll(s)];

const menu=qs('.menu-button'),nav=qs('.main-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
qsa('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const reveal=()=>qsa('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight-70)el.classList.add('visible')});
addEventListener('scroll',reveal,{passive:true});addEventListener('load',reveal);

const disciplineData={
  mekanik:{k:'MEKANİK PROJE KONTROLÜ',h:'Tesisatı bir bütün olarak görün.',items:['Isıtma, soğutma ve havalandırma projeleri','Temiz su, atık su ve yangın tesisatı koordinasyonu','Cihaz, hat ve keşif kalemlerinin karşılaştırılması','Eksik bilgi ve çakışma kontrolüne hazırlık'],ex:'Projedeki klima santrali kapasitesi ile keşifteki cihaz kapasitesinin tutarlılığını değerlendirmek.'},
  mimari:{k:'MİMARİ PROJE KONTROLÜ',h:'Mahal, ölçü ve kullanım ilişkisini okuyun.',items:['Mahal isimleri ve fonksiyonların takibi','Kapı, duvar, boşluk ve dolaşım kontrolü','Diğer disiplin rezervasyonlarıyla koordinasyon','Plan, kesit ve detay ilişkisinin değerlendirilmesi'],ex:'Mekanik şaftın mimari planda ayrılmış alanla uyumunu kontrol etmek.'},
  statik:{k:'STATİK PROJE KONTROLÜ',h:'Taşıyıcı sistem ile uygulamayı ilişkilendirin.',items:['Temel, radye ve kazık bilgileri','Döşeme ve zımbalama kontrol başlıkları','Boşluk ve rezervasyon koordinasyonu','Statik rapor ve proje verilerinin çapraz kontrolü'],ex:'Tesisat rezervasyonunun kiriş veya döşeme taşıyıcı sistemiyle çakışma riskini işaretlemek.'},
  elektrik:{k:'ELEKTRİK PROJE KONTROLÜ',h:'Güç, güzergâh ve ekipman ilişkisini görün.',items:['Pano ve güç dağılımı inceleme','Mekanik cihaz elektrik beslemeleri','Kablo güzergâhı ve mahal koordinasyonu','Keşif kalemleriyle ekipman karşılaştırması'],ex:'VRF dış ünite gücü ile projede ayrılan elektrik beslemesini karşılaştırmak.'},
  diger:{k:'DİĞER DİSİPLİNLER',h:'Projeyi yalnızca bina içinde bırakmayın.',items:['Peyzaj ve saha elemanları','Altyapı hatları ve bağlantı noktaları','Asansör ve düşey ulaşım koordinasyonu','Disiplinler arası ortak raporlama'],ex:'Altyapı hattının saha kotları ve bina bağlantı noktalarıyla koordinasyonunu değerlendirmek.'}
};
qsa('.discipline').forEach(btn=>btn.addEventListener('click',()=>{qsa('.discipline').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const d=disciplineData[btn.dataset.discipline];qs('#disciplineDetail').innerHTML=`<span>${d.k}</span><h3>${d.h}</h3><ul>${d.items.map(x=>`<li>${x}</li>`).join('')}</ul><div class="example-note"><b>Örnek kontrol</b> ${d.ex}</div>`;}));

const aiData={
 mechanical:{q:'“Bu projeyi mekanik açıdan kontrol et. Keşif ile projedeki ana cihazları karşılaştır.”',head:'4 kontrol başlığı',findings:[['good','✓','Kaynak ayrımı','Proje verisi ile keşif verisi ayrı kaynaklar olarak değerlendirilir.'],['warn','!','Kapasite karşılaştırması','Ana cihaz kapasitesi iki kaynakta farklıysa mühendis kontrolü gerektiren bulgu olarak işaretlenir.'],['info','i','Koordinasyon','Hat, cihaz ve mahaller arası ilişki raporlanabilir.']]},
 quantity:{q:'“Projede görünen ekipmanlarla keşif listesini karşılaştır. Eksik veya fazla kalemleri ayır.”',head:'3 karşılaştırma grubu',findings:[['good','✓','Eşleşen kalemler','Ad, tip ve kapasite verisi bulunan kalemler ayrı grupta gösterilir.'],['warn','!','Keşifte olup projede bulunamayanlar','Kaynak belgelere göre manuel kontrol gerektiren aday kalemler listelenir.'],['info','i','Projede olup keşifte bulunamayanlar','Metraj veya poz kontrolü için takip listesine alınır.']]},
 structural:{q:'“Statik proje ile mekanik rezervasyonları karşılaştır. Taşıyıcı elemanlarla olası çakışmaları ayır.”',head:'Koordinasyon kontrolü',findings:[['good','✓','Kaynak veriler','Statik elemanlar ve rezervasyonlar farklı veri katmanları olarak korunur.'],['warn','!','Çakışma adayı','Kiriş, perde veya döşemeyle kesişen rezervasyonlar kesin hata değil kontrol adayı olarak işaretlenir.'],['info','i','Raporlama','Konum, kat ve ilgili eleman bilgisi rapora taşınabilir.']]},
 missing:{q:'“Bu proje paketinde karar vermek için eksik kalan teknik bilgileri bul.”',head:'Eksik bilgi taraması',findings:[['warn','!','Eksik kapasite / etiket','Cihaz etiketi veya kapasite bilgisi yoksa sonuç üretilmez, veri eksikliği kaydedilir.'],['warn','!','Detay eksikliği','Plan üzerinde görünen fakat detay veya şeması bulunmayan sistemler ayrılır.'],['info','i','Kontrol listesi','Eksikler disiplin ve önem seviyesine göre takip listesine dönüştürülebilir.']]}
};
let selectedAi='mechanical';
qsa('[data-ai]').forEach(btn=>btn.addEventListener('click',()=>{qsa('[data-ai]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');selectedAi=btn.dataset.ai;qs('#aiQuestion').textContent=aiData[selectedAi].q;renderAi(false);}));
function renderAi(animate=true){const d=aiData[selectedAi],panel=qs('#aiResult');panel.innerHTML=`<div class="result-head"><span>ÖRNEK ANALİZ</span><b>${d.head}</b></div>`+d.findings.map((f,i)=>`<div class="finding ${f[0]}" style="${animate?'opacity:0;transform:translateY(8px)':''}"><i>${f[1]}</i><div><b>${f[2]}</b><p>${f[3]}</p></div></div>`).join('');if(animate)qsa('.finding',panel).forEach((el,i)=>setTimeout(()=>{el.style.transition='.35s';el.style.opacity='1';el.style.transform='none'},160*i));}
qs('#runAi')?.addEventListener('click',()=>renderAi(true));

qsa('.layer-toggle').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('active');qs('.'+btn.dataset.layer)?.classList.toggle('hidden');}));
qs('#resetLayers')?.addEventListener('click',()=>{qsa('.layer-toggle').forEach(b=>b.classList.add('active'));qsa('.drawing-demo .layer').forEach(l=>l.classList.remove('hidden'));});

const lb=qs('#lightbox'),lbImg=qs('#lightbox img');
qsa('.gallery-card').forEach(card=>card.addEventListener('click',()=>{lbImg.src=card.dataset.image;lb.hidden=false;document.body.style.overflow='hidden';}));
function closeLb(){lb.hidden=true;lbImg.src='';document.body.style.overflow='';}
qs('#lightbox button')?.addEventListener('click',closeLb);lb?.addEventListener('click',e=>{if(e.target===lb)closeLb()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)closeLb()});

qs('#buildSummary')?.addEventListener('click',()=>{const type=qs('#requestType').value,count=qs('#userCount').value,term=qs('#licenseTerm').value,disc=qs('#disciplineSelect').value,need=qs('#needText').value.trim()||'Saha proje inceleme ve mobil CAD kullanımı';const txt=`MusaCAD — ${type}\nKullanıcı / cihaz sayısı: ${count}\nLisans süresi: ${term}\nÖncelikli disiplin: ${disc}\nKullanım ihtiyacı: ${need}`;qs('#summaryText').textContent=txt;qs('#summaryBox').hidden=false;});
qs('#copySummary')?.addEventListener('click',async()=>{const t=qs('#summaryText').textContent;try{await navigator.clipboard.writeText(t);qs('#copySummary').textContent='Kopyalandı ✓';setTimeout(()=>qs('#copySummary').textContent='Metni kopyala',1600)}catch{qs('#copySummary').textContent='Kopyalanamadı'}});