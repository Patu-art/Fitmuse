const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const labels={top:"Top",bottom:"Bottom",footwear:"Footwear",accessory:"Accessory",traditional:"Traditional"};
let vibe="minimal",variation=0;
let wardrobe=[
{id:"tee",name:"White tee",category:"top",color:"Neutral",visual:"visual-tee"},
{id:"shirt",name:"Blue shirt",category:"top",color:"Blue",visual:"visual-shirt"},
{id:"jeans",name:"Blue jeans",category:"bottom",color:"Denim",visual:"visual-jeans"},
{id:"trousers",name:"Black trousers",category:"bottom",color:"Dark",visual:"visual-black"},
{id:"kurta",name:"Festive kurta",category:"traditional",color:"Green",visual:"visual-kurta"},
{id:"sneakers",name:"White sneakers",category:"footwear",color:"Neutral",visual:"visual-shoe"}];
let saved=[];try{saved=JSON.parse(localStorage.getItem("fitmuse-saved")||"[]")}catch(e){}
let current=null;
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function choose(cat,occ){return wardrobe.filter(x=>x.category===cat&&(!x.occasions||x.occasions.includes(occ)))}
function makeLook(){
 const occ=$("#occasion").value,weather=$("#weather").value,priority=$("#comfort").value,notes=$("#notes").value.trim(),low=notes.toLowerCase();
 let cats=(vibe==="traditional"||occ==="festive"||occ==="wedding")?["traditional","bottom","footwear"]:["top","bottom","footwear"];
 let chosen=[];
 cats.forEach((cat,i)=>{
  let options=choose(cat,occ);
  if(cat==="traditional"&&!options.length)options=choose("top",occ);
  if(vibe==="street")options.sort((a,b)=>Number(/black|denim/i.test(b.name))-Number(/black|denim/i.test(a.name)));
  if(vibe==="classic")options.sort((a,b)=>Number(/shirt|trouser|white/i.test(b.name))-Number(/shirt|trouser|white/i.test(a.name)));
  if((low.includes("no bright")||low.includes("not bright")||low.includes("dark colour")||low.includes("dark color"))&&options.length>1)options=options.filter(x=>!/neon|yellow|red/i.test(x.name+" "+x.color));
  if(options.length)chosen.push(options[variation%options.length]);
 });
 if(chosen.length<2){$("#resultTitle").textContent="Add a few more pieces";$("#resultIntro").textContent="Your wardrobe does not have enough suitable pieces for this look. Add a top, bottom, or footwear to complete it."}
 else{$("#resultTitle").textContent=occ==="interview"?"The interview edit":occ==="festive"?"Festive, your way":occ==="wedding"?"Celebration-ready":vibe==="traditional"?"A traditional touch":vibe==="street"?"Relaxed street edit":vibe==="classic"?"The classic edit":"The easy-going edit";$("#resultIntro").textContent="Built from "+chosen.length+" items in your wardrobe for "+$("#occasion").selectedOptions[0].text.toLowerCase()+". "+(weather==="hot"?"Keep fabrics light for hot weather.":weather==="rainy"?"Choose practical footwear for rain.":weather==="cool"?"Add a layer if needed.":"")}
 $("#lookItems").innerHTML=chosen.map(x=>'<div class="look-item"><span class="swatch '+(x.swatch||"cream")+'">'+esc(x.name.charAt(0).toUpperCase())+'</span><strong>'+esc(x.name)+'</strong><small>'+esc(labels[x.category]||x.category)+' · '+esc(x.color||"Your item")+'</small></div>').join("");
 let tip=priority==="comfort"?"Choose comfortable fits and footwear you can walk in.":priority==="style"?"Use one deliberate colour contrast or accessory you already own.":"Balance comfort with one intentional detail.";
 if(weather==="rainy")tip+=" Avoid delicate fabrics and choose shoes with grip.";if(weather==="hot")tip+=" Prefer breathable fabrics.";if(weather==="cool")tip+=" Add a layer if needed.";if(low.includes("walk"))tip+=" Your note about walking was considered.";if(notes)tip+=" Note considered: "+notes.slice(0,100)+".";
 $("#stylistTip").textContent=tip;current={title:$("#resultTitle").textContent,occasion:occ,ids:chosen.map(x=>x.id),names:chosen.map(x=>x.name),tip};$("#saveLook").disabled=chosen.length<2;$("#savedMessage").hidden=true;$("#saveLook").textContent="♡ Save this look";updateShopping(chosen);
}
function updateShopping(chosen){
 let cats=new Set(chosen.map(x=>x.category)),missing=["top","bottom","footwear"].filter(x=>!cats.has(x)),grid=$("#productGrid");
 if(!missing.length){grid.innerHTML='<div class="gap-message"><strong>Your basic outfit is covered.</strong><p>You do not need to shop for the basics of this look.</p></div>';$("#shoppingDisclaimer").textContent="Wardrobe-first suggestion. No live products, prices, stock, or affiliate links are verified.";return}
 grid.innerHTML=missing.map(cat=>'<article class="product-card gap-card"><div class="product-art gap-art"><span>WARDROBE GAP</span><i>'+esc(labels[cat].charAt(0))+'</i></div><div class="product-details"><small>OPTIONAL GAP-FILLER</small><strong>'+esc(labels[cat])+' to complete the look</strong><span>Suggested category, not a product listing</span></div></article>').join("");
 $("#shoppingDisclaimer").textContent="Category suggestions reflect this outfit only. You do not need to buy anything; these are not live listings or affiliate links.";
}
function renderWardrobe(){
 const grid=$("#wardrobeGrid");
 grid.innerHTML=wardrobe.map(x=>'<article class="wardrobe-item">'+(x.image?'<img class="wardrobe-photo" src="'+x.image+'" alt="'+esc(x.name)+'">':'<div class="item-visual '+(x.visual||"visual-tee")+'"><i></i></div>')+'<div class="item-info"><strong>'+esc(x.name)+'</strong><small>'+esc(labels[x.category])+' · '+esc(x.color||"Unlabelled")+'</small></div><button class="remove-item" type="button" data-remove="'+esc(x.id)+'" aria-label="Remove '+esc(x.name)+'">×</button></article>').join("");
 $("#wardrobeCount").textContent=wardrobe.length+" "+(wardrobe.length===1?"piece":"pieces");
 $$("[data-remove]",grid).forEach(b=>b.addEventListener("click",()=>{let x=wardrobe.find(y=>y.id===b.dataset.remove);if(x&&x.image)URL.revokeObjectURL(x.image);wardrobe=wardrobe.filter(y=>y.id!==b.dataset.remove);renderWardrobe();makeLook()}));
}
function persist(){try{localStorage.setItem("fitmuse-saved",JSON.stringify(saved))}catch(e){$("#savedMessage").textContent="Browser storage unavailable; this look may not persist."}}
function renderSaved(){
 const host=$("#savedLooks");
 host.innerHTML=saved.length?"<h4>Saved looks on this device</h4>"+saved.map((x,i)=>'<div class="saved-look-row"><span><strong>'+esc(x.title)+'</strong><small>'+esc((x.names||[]).join(", "))+'</small></span><button class="remove-saved" data-saved-remove="'+i+'" type="button">Remove</button></div>').join(""):"";
 $$("[data-saved-remove]",host).forEach(b=>b.addEventListener("click",()=>{saved.splice(Number(b.dataset.savedRemove),1);persist();renderSaved()}));
}
$("#stylingForm").addEventListener("submit",e=>{e.preventDefault();variation=0;makeLook()});
$("#shuffleLook").addEventListener("click",()=>{variation++;makeLook()});
$("#saveLook").addEventListener("click",()=>{if(!current||current.ids.length<2)return;let sig=current.ids.join("|")+"|"+current.occasion;if(saved.some(x=>x.sig===sig)){$("#savedMessage").textContent="This look is already saved."}else{saved.unshift({...current,sig});saved=saved.slice(0,20);persist();renderSaved();$("#savedMessage").textContent="Saved on this device in this browser."}$("#savedMessage").hidden=false;$("#saveLook").textContent="♥ Look saved"});
$$(".chip").forEach(b=>{b.setAttribute("aria-pressed",b.classList.contains("selected")?"true":"false");b.addEventListener("click",()=>{$$(".chip").forEach(x=>{x.classList.remove("selected");x.setAttribute("aria-pressed","false")});b.classList.add("selected");b.setAttribute("aria-pressed","true");vibe=b.dataset.vibe;makeLook()})});
$("#itemUpload").addEventListener("change",e=>{let cat=$("#uploadCategory").value;[...e.target.files].filter(f=>f.type.startsWith("image/")).forEach(f=>wardrobe.push({id:"upload-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),name:f.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," "),category:cat,color:"Unlabelled",image:URL.createObjectURL(f)}));renderWardrobe();makeLook();e.target.value=""});
["occasion","weather","comfort","notes"].forEach(id=>$("#"+id).addEventListener(id==="notes"?"input":"change",makeLook));
$("#menuToggle").addEventListener("click",()=>{let open=$("#menuToggle").getAttribute("aria-expanded")==="true";$("#menuToggle").setAttribute("aria-expanded",String(!open));$("#mainNav").classList.toggle("nav-open",!open);$("#menuToggle").textContent=open?"Menu ☰":"Close ×"});
$$('#mainNav a').forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("nav-open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").textContent="Menu ☰"}));
renderWardrobe();renderSaved();makeLook();