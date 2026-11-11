document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
  if(toggle&&nav) toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    document.querySelectorAll('.menu-card').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter);
  }));
  const form=document.getElementById('booking-form');
  if(form){
    const storageKey='baanBaitongReservations';
    const dateInput=document.getElementById('booking-date');
    const today=new Date();const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
    dateInput.min=localDate;
    const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}};
    const save=(items)=>localStorage.setItem(storageKey,JSON.stringify(items));
    const list=document.getElementById('booking-list'),count=document.getElementById('saved-count');
    const render=()=>{
      const items=read();count.textContent=`${items.length} รายการ`;
      if(!items.length){list.innerHTML='<p class="empty-state">ยังไม่มีรายการจองในอุปกรณ์นี้</p>';return}
      list.innerHTML=items.map(item=>`<article class="reservation-item"><div><h3>${escapeHtml(item.name)} · ${item.guests} ท่าน</h3><p>${item.date} เวลา ${item.time} น. · โทร. ${escapeHtml(item.phone)}${item.note?'<br>หมายเหตุ: '+escapeHtml(item.note):''}</p></div><button class="cancel-btn" data-id="${item.id}">ยกเลิก</button></article>`).join('');
      list.querySelectorAll('.cancel-btn').forEach(btn=>btn.addEventListener('click',()=>{if(confirm('ต้องการยกเลิกรายการจองนี้หรือไม่?')){save(read().filter(x=>x.id!==btn.dataset.id));render()}}));
    };
    function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const data=Object.fromEntries(new FormData(form).entries());
      if(data.date<localDate){alert('กรุณาเลือกวันที่ตั้งแต่วันนี้เป็นต้นไป');return}
      const item={...data,id:Date.now().toString()};const items=read();items.push(item);save(items);
      document.getElementById('success-copy').textContent=`คุณ ${item.name} · ${item.guests} ท่าน วันที่ ${item.date} เวลา ${item.time} น.`;
      form.hidden=true;document.getElementById('success-message').hidden=false;render();
    });
    document.getElementById('new-booking').addEventListener('click',()=>{form.reset();form.hidden=false;document.getElementById('success-message').hidden=true});
    render();
  }
});