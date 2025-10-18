// Thi trắc nghiệm online: 50 phút, tự động nộp, chấm 10 điểm
const DURATION_SECONDS = 50 * 60; // 50 phút
const MC_WEIGHT = 6 / 24; // mỗi câu phần I = 0.25 điểm
const TF_WEIGHT = 4 / (4 * 4); // 4 câu * 4 ý = 16 ý, mỗi ý 0.25 điểm
let remaining = DURATION_SECONDS;
let timerId = null;
let submitted = false;

// Phần I: Trắc nghiệm nhiều lựa chọn (24 câu)
const mcQuestions = [
  {id:1, q:"Chức năng của trí tuệ nhân tạo?", opts:["Lưu trữ dữ liệu lớn","Thực hiện các tác vụ thông minh","Kết nối mạng xã hội","Tạo phần mềm văn phòng"], ans:1},
  {id:2, q:"AI không thể thực hiện nhiệm vụ nào?", opts:["Nhận dạng giọng nói","Chẩn đoán qua ảnh y tế","Phân tích Big Data","Phát triển cảm xúc như người"], ans:3},
  {id:3, q:"Ứng dụng AI có thể dùng để giả mạo danh tính bằng video?", opts:["DeepFaceLab","AutoSploit","ChatGPT","AI-Powered Phishing Tools"], ans:0},
  {id:4, q:"Ứng dụng AI để giảm gian lận giao dịch ngân hàng?", opts:["Tạo giao diện web thân thiện","Dự đoán xu hướng dài hạn","Phân tích hành vi phát hiện bất thường","Tự động in sao kê"], ans:2},
  {id:5, q:"Giá trị trả về của kt_ngto(13) là?", opts:["False","True","1","0"], ans:2},
  {id:6, q:"Giao thức truyền email giữa các máy chủ?", opts:["SMTP","POP3","IMAP","HTTPS"], ans:0},
  {id:7, q:"Chức năng địa chỉ MAC?", opts:["Xác định địa chỉ vật lý thiết bị mạng","Kết nối Internet tốc độ cao","Mã hóa dữ liệu truyền","Định danh thiết bị trên Internet"], ans:0},
  {id:8, q:"Vì sao DNS cần thiết trên Internet?", opts:["Giúp ghi nhớ địa chỉ web qua tên miền","Bảo vệ thông tin người dùng","Giúp ghi nhớ địa chỉ IP","Hỗ trợ kiểm soát email"], ans:0},
  {id:9, q:"Thiết bị kết nối 2 LAN và ra Internet?", opts:["Router","Modem","Switch","Access Point"], ans:0},
  {id:10, q:"Hành vi văn minh trên mạng xã hội?", opts:["Xúc phạm nặc danh","Chia sẻ chưa kiểm chứng","Bình luận lịch sự, tôn trọng","Chế giễu người khác"], ans:2},
  {id:11, q:"Hành động nên tránh khi giao tiếp trực tuyến?", opts:["Đăng kích động thù ghét","Tôn trọng quyền riêng tư","Trả lời ôn hòa","Ngôn ngữ phù hợp"], ans:0},
  {id:12, q:"Hành động gây rủi ro bảo mật khi đăng ảnh du lịch?", opts:["Chia sẻ ảnh kèm vị trí và thông tin hộ chiếu","Thiết lập riêng tư chỉ bạn bè","Đăng ảnh phong cảnh","Bật xác thực hai yếu tố"], ans:0},
  {id:13, q:"Nhiệm vụ chính nghề dịch vụ CNTT?", opts:["Dạy lập trình web","Thiết kế đồ họa","Hỗ trợ kĩ thuật, khắc phục sự cố phần cứng","Tổ chức sự kiện công nghệ"], ans:2},
  {id:14, q:"Vai trò nhân lực CNTT trong ngân hàng hiện đại?", opts:["Bảo vệ thông tin khách hàng, an toàn hệ thống","Làm việc trực tiếp tại quầy","Thiết kế đồ họa quảng cáo","Công việc văn thư hành chính"], ans:0},
  {id:15, q:"Ngành phù hợp bảo vệ dữ liệu, xử lý mối đe dọa?", opts:["Khoa học máy tính","Mạng máy tính","An toàn thông tin","Công nghệ phần mềm"], ans:2},
  {id:16, q:"Chức năng thẻ <audio> trong HTML?", opts:["Hiển thị hình ảnh","Nhúng tệp âm thanh","Tạo liên kết","Hiển thị video"], ans:1},
  {id:17, q:"CSS không có vai trò nào sau đây?", opts:["Định dạng kiểu dáng","Xác định cấu trúc và nội dung","Thay đổi màu, font","Định kiểu theo trạng thái"], ans:1},
  {id:18, q:"Thẻ HTML tạo textbox, checkbox, radio?", opts:["div","form","input","iframe"], ans:2},
  {id:19, q:"Thẻ không bắt buộc trong trang HTML cơ bản?", opts:["html","head","body","h1"], ans:3},
  {id:20, q:"CSS viền đỏ 2px nét liền cho div?", opts:["div {border: 2px solid red;}","div {border-color: red; border-width: 2px solid;}","div {border: red 2px solid;}","div {border-style: solid; border: 2px red;}"], ans:0},
  {id:21, q:"Vai trò thẻ <mark> trong HTML?", opts:["In đậm","Làm nổi bật đoạn văn","Liên kết","Chữ nghiêng"], ans:1},
  {id:22, q:"Sử dụng mã HTML nào để tạo danh sách gạch đầu dòng vuông với các mục: Hoa đào, Hoa mai, Hoa cúc?", opts:[
    "<ul style='list-style-type: square;'><li>Hoa đào</li><li>Hoa mai</li><li>Hoa cúc</li></ul>",
    "<ul style='list-style-type: disc;'><li>Hoa đào</li><li>Hoa mai</li><li>Hoa cúc</li></ul>",
    "<ol style='list-style-type: circle;'><li>Hoa đào</li><li>Hoa mai</li><li>Hoa cúc</li></ol>",
    "<ol style='list-style-type: square;'><li>Hoa đào</li><li>Hoa mai</li><li>Hoa cúc</li></ol>"
  ], ans:0},
  {id:23, q:"Mã CSS nào đổi màu chữ của liên kết sang đỏ khi người dùng di chuột qua?", opts:["a:hover {color: red;}","a {hover-color: red;}","a:active {color: red;}","a:visited {color: red;}"], ans:0},
  {id:24, q:"Mã HTML nào tạo ô nhập liệu chỉ nhập số và bắt buộc?", opts:["<input type=\"text\" required>","<input type=\"number\" required>","<input type=\"number\">","<input type=\"text\">"], ans:1},
];

// Phần II: Đúng/Sai
const tfCommon = [
  { id:"II-1", title:"Câu 1: Mạng trường học", items:[
    {t:"Switch kết nối các máy tính trong cùng LAN.", a:true},
    {t:"Router chuyển đổi tín hiệu giữa các chuẩn Wi-Fi.", a:false},
    {t:"Mạng chậm do Switch không đủ mạnh để phát Wi-Fi.", a:false},
    {t:"Mất Internet vẫn chia sẻ dữ liệu nội bộ.", a:true},
  ]},
  { id:"II-2", title:"Câu 2: Hệ CSDL quan hệ", items:[
    {t:"Bảng dữ liệu gồm các trường (cột) và bản ghi (hàng).", a:true},
    {t:"SQL chỉ hỗ trợ truy vấn, không tạo/cập nhật CSDL.", a:false},
    {t:"Ràng buộc giữa bảng qua khóa ngoại.", a:true},
    {t:"Nên cân nhắc NoSQL cho dữ liệu phi cấu trúc và mở rộng linh hoạt.", a:true},
  ]},
];

const tfCS = [
  { id:"II-3", title:"Câu 3: Giai thừa (đệ quy)", items:[
    {t:"factorial(n) là đệ quy tuyến tính.", a:true},
    {t:"Có điều kiện dừng tại n = 0.", a:true},
    {t:"Độ phức tạp thời gian O(n).", a:true},
    {t:"Nên tối ưu bằng đệ quy gọi lại nhiều nhánh.", a:false},
  ]},
  { id:"II-4", title:"Câu 4: Nhận diện thư rác (ML)", items:[
    {t:"Chất lượng dữ liệu đầu vào rất quan trọng.", a:true},
    {t:"Không cần tiền xử lý dữ liệu trước huấn luyện.", a:false},
    {t:"Dữ liệu đưa vào mô hình khi huấn luyện là tập huấn luyện.", a:true},
    {t:"Chia dữ liệu thành huấn luyện/kiểm tra sẽ làm kém chính xác.", a:false},
  ]},
];

const tfApplied = [
  { id:"II-5", title:"Câu 5: Thiết kế website", items:[
    {t:"Phần mềm tạo web hỗ trợ kéo-thả, thiết kế nhanh.", a:true},
    {t:"Chỉ cần màu sắc/hình ảnh, không cần bố cục/UX.", a:false},
    {t:"Tự điều chỉnh cơ bản hiển thị trên nhiều thiết bị (responsive).", a:true},
    {t:"Có thể lưu trang dạng mã nguồn HTML để nâng cấp sau.", a:true},
  ]},
  { id:"II-6", title:"Câu 6: CSDL bán vé máy bay", items:[
    {t:"Thêm CHECK (NoiDi <> NoiDen) cho ChuyenBay là hợp lý.", a:true},
    {t:"MaVe không được để trống khi nhập bảng VeMayBay.", a:true},
    {t:"Có thể thêm VeMayBay với MaCB không tồn tại ở ChuyenBay.", a:false},
    {t:"JOIN KhachHang với VeMayBay để liệt kê khách đã mua vé.", a:true},
  ]},
];

function formatTime(s){const m=Math.floor(s/60);const sec=(s%60).toString().padStart(2,'0');return `${m}:${sec}`;}

function startTimer(){
  const timeEl=document.getElementById('time-left');
  timeEl.textContent=formatTime(remaining);
  timerId=setInterval(()=>{
    if(remaining<=0){
      clearInterval(timerId);
      autoSubmit();
      return;
    }
    remaining--; timeEl.textContent=formatTime(remaining);
  },1000);
}

function buildMCSection(root){
  const sec=document.createElement('section');
  sec.className='block';
  sec.innerHTML=`<div class="section-title">Phần I. Trắc nghiệm nhiều lựa chọn (6 điểm)</div>
  <div class="small-note">Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu chọn A, B, C hoặc D.</div>`;
  mcQuestions.forEach((q,idx)=>{
    const div=document.createElement('div');
    div.className='q-item';
    const name=`mc-${q.id}`;

    const qText=document.createElement('div');
    qText.className='q-text';
    qText.textContent=`Câu ${q.id}. ${q.q}`;
    div.appendChild(qText);

    const optsWrap=document.createElement('div');
    optsWrap.className='options';

    q.opts.forEach((t,i)=>{
      const label=document.createElement('label');
      const input=document.createElement('input');
      input.type='radio'; input.name=name; input.value=i;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${String.fromCharCode(65+i)}. `));
      const isCode = /[<>&{}]/.test(t);
      if(isCode){
        const code=document.createElement('code');
        code.textContent=t;
        label.appendChild(code);
      }else{
        label.appendChild(document.createTextNode(t));
      }
      optsWrap.appendChild(label);
    });

    div.appendChild(optsWrap);

    const fb=document.createElement('div');
    fb.className='feedback small-note'; fb.dataset.q=`${q.id}`;
    div.appendChild(fb);

    sec.appendChild(div);
  });
  root.appendChild(sec);
}

function buildTFSection(root){
  const sec=document.createElement('section');
  sec.className='block';
  sec.innerHTML=`<div class="section-title">Phần II. Trắc nghiệm đúng/sai (4 điểm)</div>
  <div class="small-note">Thí sinh trả lời 4 câu (mỗi câu 4 ý). Phần chung bắt buộc, phần riêng chọn <b>1 trong 2</b> định hướng.</div>`;

  // Phần chung
  const chung=document.createElement('div');
  chung.innerHTML=`<h3>A. Phần chung</h3>`;
  tfCommon.forEach((g,gi)=>{
    const block=document.createElement('div');
    block.className='q-item';
    block.innerHTML=`<div class="q-text">${g.title}</div>`;
    const group=document.createElement('div');
    group.className='tf-group';
    g.items.forEach((it,i)=>{
      const row=document.createElement('div');
      row.className='tf-row';
      const name=`tf-${g.id}-${i}`;
      row.innerHTML=`<div class="statement">${String.fromCharCode(97+i)}) ${it.t}</div>
        <label><input type="radio" name="${name}" value="true"> Đúng</label>
        <label><input type="radio" name="${name}" value="false"> Sai</label>`;
      group.appendChild(row);
    });
    block.appendChild(group);
    chung.appendChild(block);
  });
  sec.appendChild(chung);

  // Phần riêng: chọn định hướng
  const rieng=document.createElement('div');
  rieng.innerHTML=`<h3>B. Phần riêng (chọn 1)</h3>
    <div class="track-select">
      <label><input type="radio" name="track" value="cs"> Khoa học máy tính</label>
      <label><input type="radio" name="track" value="app"> Tin học ứng dụng</label>
    </div>
    <div id="track-questions" class="q-item"></div>`;
  sec.appendChild(rieng);
  root.appendChild(sec);

  // gắn sự kiện thay đổi định hướng
  Array.from(document.querySelectorAll('input[name="track"]')).forEach(r=>{
    r.addEventListener('change', renderTrack);
  });
}

function renderTrack(){
  const holder=document.getElementById('track-questions');
  const val=document.querySelector('input[name="track"]:checked')?.value;
  holder.innerHTML='';
  const dataset=(val==='cs'?tfCS:(val==='app'?tfApplied:[]));
  dataset.forEach(g=>{
    const block=document.createElement('div');
    block.className='q-item';
    block.innerHTML=`<div class="q-text">${g.title}</div>`;
    const group=document.createElement('div'); group.className='tf-group';
    g.items.forEach((it,i)=>{
      const row=document.createElement('div'); row.className='tf-row';
      const name=`tf-${g.id}-${i}`;
      row.innerHTML=`<div class="statement">${String.fromCharCode(97+i)}) ${it.t}</div>
        <label><input type="radio" name="${name}" value="true"> Đúng</label>
        <label><input type="radio" name="${name}" value="false"> Sai</label>`;
      group.appendChild(row);
    });
    block.appendChild(group);
    holder.appendChild(block);
  });
}

function grade(){
  if(submitted) return; submitted=true;
  // dừng đồng hồ
  if(timerId) clearInterval(timerId);

  let mcCorrect=0, tfCorrect=0;

  // chấm phần I
  mcQuestions.forEach(q=>{
    const sel=document.querySelector(`input[name="mc-${q.id}"]:checked`);
    const feedback=document.querySelector(`.feedback[data-q="${q.id}"]`);
    const correctLetter=String.fromCharCode(65+q.ans);
    if(sel && Number(sel.value)===q.ans){
      mcCorrect++;
      feedback.textContent=`Đúng ✔️`;
      feedback.classList.remove('incorrect'); feedback.classList.add('correct');
    } else {
      feedback.textContent=`Sai ❌ (Đáp án đúng: ${correctLetter})`;
      feedback.classList.remove('correct'); feedback.classList.add('incorrect');
    }
  });

  // chấm phần II - chung
  tfCommon.forEach(g=>{
    g.items.forEach((it,i)=>{
      const name=`tf-${g.id}-${i}`;
      const sel=document.querySelector(`input[name="${name}"]:checked`);
      const isTrue=sel? (sel.value==='true') : null;
      const row=sel? sel.closest('.tf-row') : document.querySelector(`[name="${name}"]`)?.closest('.tf-row');
      if(isTrue!==null && isTrue===it.a){ tfCorrect++; markRow(row,true); } else { markRow(row,false); }
    });
  });
  // chấm phần II - riêng
  const val=document.querySelector('input[name="track"]:checked')?.value;
  const dataset=(val==='cs'?tfCS:(val==='app'?tfApplied:[]));
  dataset.forEach(g=>{
    g.items.forEach((it,i)=>{
      const name=`tf-${g.id}-${i}`;
      const sel=document.querySelector(`input[name="${name}"]:checked`);
      const isTrue=sel? (sel.value==='true') : null;
      const row=sel? sel.closest('.tf-row') : document.querySelector(`[name="${name}"]`)?.closest('.tf-row');
      if(isTrue!==null && isTrue===it.a){ tfCorrect++; markRow(row,true); } else { markRow(row,false); }
    });
  });

  const mcScore=mcCorrect*MC_WEIGHT;
  const tfScore=tfCorrect*TF_WEIGHT;
  const total=+(mcScore+tfScore).toFixed(2);

  // khóa các input
  Array.from(document.querySelectorAll('input')).forEach(i=>i.disabled=true);

  const sum=document.getElementById('result-summary');
  sum.classList.remove('hidden');
  sum.innerHTML=`<b>Kết quả:</b> ${total}/10 điểm<br>
    - Phần I: đúng ${mcCorrect}/24 (=${mcScore.toFixed(2)} điểm)<br>
    - Phần II: đúng ${tfCorrect}/16 (=${tfScore.toFixed(2)} điểm)`;
}

function markRow(row,ok){ if(!row) return; row.classList.remove('correct','incorrect'); row.classList.add(ok?'correct':'incorrect'); }

function autoSubmit(){
  if(submitted) return; grade();
  const sum=document.getElementById('result-summary');
  sum.innerHTML += `<br><i>Hết thời gian, hệ thống đã tự động nộp bài.</i>`;
}

function init(){
  const root=document.getElementById('exam-root');
  buildMCSection(root);
  buildTFSection(root);
  startTimer();
  document.getElementById('submit-btn').addEventListener('click', ()=>{
    // yêu cầu chọn định hướng trước khi nộp
    const trackSel=document.querySelector('input[name="track"]:checked');
    if(!trackSel){ alert('Vui lòng chọn 1 định hướng ở Phần II (Khoa học máy tính hoặc Tin học ứng dụng).'); return; }
    grade();
  });
}

document.addEventListener('DOMContentLoaded', init);