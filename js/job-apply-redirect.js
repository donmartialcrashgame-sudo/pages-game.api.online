(function(){
const roles={'job-api-backend-developer.html':'API / Backend Developer','job-frontend-developer.html':'Frontend Developer','job-digital-marketing.html':'Digital / Marketing Specialist'};
const file=location.pathname.split('/').pop();
const role=roles[file];
if(!role)return;
const endpoint='https://qbagxeqquskkjksoraiz.supabase.co/functions/v1/job-application';
const escapeHtml=v=>String(v??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('form').forEach(form=>{
 if(form.dataset.jobApiBound)return;
 form.dataset.jobApiBound='1';
 form.addEventListener('submit',async function(e){
  e.preventDefault();e.stopImmediatePropagation();
  const button=form.querySelector('button[type="submit"]');
  const original=button?button.innerHTML:'';
  let result=form.parentElement.querySelector('.job-direct-result');
  if(!result){result=document.createElement('div');result.className='job-direct-result';result.style.cssText='display:none;margin-top:22px;padding:22px;border-radius:16px;border:1px solid #ffffff18;background:#070b13;color:#fff';form.parentElement.appendChild(result)}
  result.style.display='none';
  if(!form.checkValidity()){form.reportValidity();return}
  const cv=form.querySelector('input[name="cv"]');
  if(!cv||!cv.files.length){if(cv)cv.reportValidity();return}
  if(button){button.disabled=true;button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'}
  try{
   const source=new FormData(form);const data=new FormData();
   source.forEach((value,key)=>{
    if(key==='documents')return;
    if(key==='project'){data.append('motivation',String(value));return}
    if(key==='agreement')return;
    data.append(key,value);
   });
   data.set('job_title',role);
   const docs=form.querySelector('input[name="documents"]');
   if(docs)Array.from(docs.files).forEach(f=>data.append('supporting_documents',f));
   const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json'},body:data});
   let payload={};try{payload=await response.json()}catch(_e){}
   if(!response.ok||!payload.success)throw new Error(payload.error||payload.details||'Unable to submit application right now. Please try again in a moment.');
   result.style.display='block';
   result.style.borderColor='#20c99755';
   result.style.background='#20c9970d';
   result.innerHTML='<h3><i class="fa-solid fa-circle-check"></i> Application submitted successfully</h3><p>Your <strong>'+escapeHtml(role)+'</strong> application has been received.</p><p><strong>Your application code:</strong></p><div style="font-size:28px;font-weight:900;letter-spacing:2px;margin:12px 0">'+escapeHtml(payload.application?.application_code||'')+'</div><p>Keep this code safe. You can use it later to check your application status.</p>';
   form.reset();
   result.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){
   result.style.display='block';result.style.borderColor='#ff6b6b55';result.style.background='#ff6b6b0d';
   result.innerHTML='<h3><i class="fa-solid fa-circle-exclamation"></i> Application could not be submitted</h3><p>'+escapeHtml(error.message||'Please try again in a moment.')+'</p>';
   result.scrollIntoView({behavior:'smooth',block:'center'});
  }finally{if(button){button.disabled=false;button.innerHTML=original}}
 },true);
});
})();