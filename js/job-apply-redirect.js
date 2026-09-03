(function(){
const roles={'job-api-backend-developer.html':'API / Backend Developer','job-frontend-developer.html':'Frontend Developer','job-digital-marketing.html':'Digital / Marketing Specialist','job-future-roles.html':'Future Roles / General Application'};
const file=location.pathname.split('/').pop(),role=roles[file];if(!role)return;
const endpoint='https://qbagxeqquskkjksoraiz.supabase.co/functions/v1/job-application';
const escapeHtml=v=>String(v??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
const reviewUrl=code=>'index.html?code='+encodeURIComponent(code);
document.querySelectorAll('form').forEach(form=>{
 if(form.dataset.jobApiBound)return;form.dataset.jobApiBound='1';
 form.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();return false},true);
 form.addEventListener('submit',async function(e){
  e.preventDefault();e.stopImmediatePropagation();
  const button=form.querySelector('button[type="submit"]'),original=button?button.innerHTML:'';
  let result=form.parentElement.querySelector('.job-direct-result');
  if(!result){result=document.createElement('div');result.className='job-direct-result';form.parentElement.appendChild(result)}
  result.style.cssText='display:none;margin-top:22px;padding:22px;border-radius:16px;border:1px solid #ffffff18;background:#070b13;color:#fff';
  if(!form.checkValidity()){form.reportValidity();return false}
  const cv=form.querySelector('input[name="cv"]');if(!cv||!cv.files.length){if(cv)cv.reportValidity();return false}
  if(button){button.disabled=true;button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'}
  try{
   const source=new FormData(form),data=new FormData();
   source.forEach((value,key)=>{if(key==='documents'||key==='agreement')return;if(key==='project'||(key==='experience'&&role==='Future Roles / General Application'))data.append('motivation',String(value));else data.append(key,value)});
   data.set('job_title',role);const docs=form.querySelector('input[name="documents"]');if(docs)Array.from(docs.files).forEach(f=>data.append('supporting_documents',f));
   const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json'},body:data});let payload={};try{payload=await response.json()}catch{}
   if(!response.ok||!payload.success)throw new Error(payload.error||payload.details||'Unable to submit application right now. Please try again in a moment.');
   const code=payload.application?.application_code||'';result.style.display='block';result.style.borderColor='#20c99755';result.style.background='#20c9970d';
   result.innerHTML='<h3><i class="fa-solid fa-circle-check"></i> Application submitted successfully</h3><p>Your <strong>'+escapeHtml(role)+'</strong> application has been received.</p><p><strong>Your application code:</strong></p><div style="font-size:28px;font-weight:900;letter-spacing:2px;margin:12px 0">'+escapeHtml(code)+'</div><p>Keep this code safe. It is your application and account-status code.</p><p style="display:flex;gap:9px;flex-wrap:wrap"><a href="'+reviewUrl(code)+'" style="display:inline-flex;align-items:center;gap:8px;padding:12px 17px;border-radius:11px;background:#20c997;color:#06130f;font-weight:800;text-decoration:none"><i class="fa-solid fa-magnifying-glass"></i> Review / Check Status</a><button type="button" class="copy-code-btn" style="border:0;padding:12px 17px;border-radius:11px;background:#182438;color:#fff;font-weight:800;cursor:pointer"><i class="fa-regular fa-copy"></i> Copy Code</button></p>';
   result.querySelector('.copy-code-btn')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code)}catch{}const b=result.querySelector('.copy-code-btn');if(b)b.innerHTML='<i class="fa-solid fa-check"></i> Copied'});
   try{sessionStorage.setItem('jobApplication',JSON.stringify(payload.application||{}))}catch{}form.reset();result.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){result.style.display='block';result.style.borderColor='#ff6b6b55';result.style.background='#ff6b6b0d';result.innerHTML='<h3><i class="fa-solid fa-circle-exclamation"></i> Application could not be submitted</h3><p>'+escapeHtml(error.message||'Please try again in a moment.')+'</p>';result.scrollIntoView({behavior:'smooth',block:'center'})}
  finally{if(button){button.disabled=false;button.innerHTML=original}}
  return false;
 },false);
});
})();