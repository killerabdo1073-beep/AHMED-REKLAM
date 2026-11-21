/* =====================================================================
   أدوات Ahmed Reklam
   1) «صمّم لوحتك»: معاينة اللوحة مضاءة + حاسبة المواد (ليت، محوّلات، ألواح، بكرة)
   2) «صورة الأسعار»: صورة مرتبة بالأسعار للنشر بحالة واتساب
   هذا الملف ينحمّل فقط لما الزبون يفتح الأداة، حتى تبقى قائمة الأسعار خفيفة.
   يستعمل الدوال والبيانات من index.html (CATS, T, L, money, setQty …)
   ===================================================================== */
"use strict";

/* ---------- إعدادات الحاسبة (عدّلها إذا تغيّرت طريقة شغلكم) ---------- */
const CALC = {
  space6: 5.15,                 // المسافة بين مركز ليت 6 سم والثاني (سم) — معايَرة حتى حرف ارتفاعه 30 سم ياخذ ~15 ليت
  space8: 6.9,                  // نفس الشي لليت 8 سم (أبعد بنسبة 8 إلى 6)
  edge6: 1.2, edge8: 1.5,       // أقل بُعد لمركز الليت عن حافة الحرف (سم)
  psu: 400 / (300 * 1.5),       // قاعدتكم: 300 ليت 1.5 وات على محوّلة 400 وات
  sheet: [244, 122],            // قياس لوح البلاستك والفووم (سم)
  cutGap: 2,                    // مسافة القص بين القطع على اللوح (سم)
  trimExtra: 1.08               // زيادة البكرة للّف والهدر
};

/* ---------- النصوص ---------- */
const SDT = {
ar: {
  txt:"اكتب اسم المحل", txtPh:"اسم محلك", txtHint:"للسطر الثاني اضغط Enter", font:"الخط", size:"قياس اللوحة (سم)", w:"العرض", h:"الارتفاع",
  light:"لون الإضاءة", face:"لون وجه الحرف", sides:"جوانب الحرف (بكرة لف)", back:"ظهر الحرف (فووم)", sideK:["حافة","ألمنيوم"], board:"لون اللوحة خلف الحروف", led:"الليت", watt:"وات",
  modes:["ليلاً","نهاراً","توزيع الليت"], mat:"المواد المطلوبة (تقريبية)", textH:"ارتفاع الكتابة", textW:"عرضها", leds:"ليت",
  faceM:"لوجه الحروف", backM:"لظهر الحروف", sideM:"للجوانب", sheetU:"لوح", pcsU:"قطعة", mU:"متر", power:"استهلاك الليت",
  matNote:"تقدير تقريبي: حرف ارتفاعه 30 سم يحتاج نحو 15 ليت، ومحوّلة 400 وات لكل 300 ليت (1.5 وات). قد تختلف الكميات قليلاً عند التنفيذ.",
  addMat:"أضف المواد إلى طلبيتي", sendD:"أرسل التصميم للمحل بواتساب", saveImg:"احفظ صورة اللوحة", added:"أُضيفت المواد إلى طلبيتك",
  small:"الكتابة صغيرة على هذا القياس، كبّر ارتفاع اللوحة أو قصّر النص.", na:"غير متوفر حالياً",
  dIntro:"السلام عليكم، صمّمت لوحتي على موقعكم وأريد السعر والتنفيذ:", dTxt:"النص", dSize:"القياس", dFont:"الخط", dLight:"الإضاءة", dFace:"الوجه", dSides:"الجوانب", dBack:"الظهر",
  note:"من «صمّم لوحتك»", from:"من", share:"مشاركة", dl:"تنزيل الصورة", madeOn:"صُمّمت على موقع", cvLabel:"معاينة اللوحة",
  styles:[["عصري"],["كوفي"],["هندسي"],["رقعة"],["ناعم"],["عريض"]], boards:["أسود","رمادي","أبيض"]
},
ku: {
  txt:"ناڤێ دکانێ بنڤیسە", txtPh:"ناڤێ دکانا تە", txtHint:"بۆ دێڕا دووێ Enter بکە", font:"فۆنت", size:"قەبارێ تابلۆیێ (سم)", w:"پەهنی", h:"بلندی",
  light:"رەنگێ رۆناهیێ", face:"رەنگێ رویێ پیتێ", sides:"تەنشتێن پیتێ (رۆل)", back:"پشتا پیتێ (فۆم)", sideK:["لێڤ","ئەلەمنیۆم"], board:"رەنگێ تابلۆیێ ل پشت پیتان", led:"لایت", watt:"وات",
  modes:["شەڤ","رۆژ","دانانا لایتان"], mat:"کەرەستێن پێدڤی (نێزیکی)", textH:"بلندیا نڤیسینێ", textW:"پەهنیا وێ", leds:"لایت",
  faceM:"بۆ رویێ پیتان", backM:"بۆ پشتا پیتان", sideM:"بۆ تەنشتان", sheetU:"تەخت", pcsU:"دانە", mU:"مەتر", power:"کارەبا لایتان",
  matNote:"ئەڤ ژمارە نێزیکی نە: پیتەکا ب بلندیا 30 سم نێزیکی 15 لایتان دڤێت، و ترانسفۆرمەرەکا 400 وات بۆ هەر 300 لایتان (1.5 وات). د جێبەجێکرنێ دا هندەک کێم و زێدە دبن.",
  addMat:"کەرەستان زێدە بکە بۆ داخوازیا من", sendD:"دیزاینێ ب واتسئاپێ بۆ مە فرێکە", saveImg:"وێنەیێ تابلۆیێ پاشەکەفت بکە", added:"کەرەستە هاتنە زێدەکرن بۆ داخوازیا تە",
  small:"نڤیسین ل سەر ڤی قەباری بچویکە، بلندیا تابلۆیێ مەزن بکە یان نڤیسینێ کورت بکە.", na:"نوکە بەردەست نینە",
  dIntro:"سلاڤ، من تابلۆیا خۆ ل سەر مالپەڕێ هەوە دیزاین کر و من بها و جێبەجێکرن دڤێت:", dTxt:"نڤیسین", dSize:"قەبارە", dFont:"فۆنت", dLight:"رۆناهی", dFace:"روی", dSides:"تەنشت", dBack:"پشت",
  note:"ژ «تابلۆیا خۆ دیزاین بکە»", from:"ژ", share:"پارڤەکرن", dl:"داگرتنا وێنەی", madeOn:"هاتیە دیزاینکرن ل سەر مالپەڕێ", cvLabel:"پێشاندانا تابلۆیێ",
  styles:[["مۆدێرن"],["کوفی"],["ئەندازەیی"],["روقعە"],["نەرم"],["ستویر"]], boards:["رەش","خۆلەمێشی","سپی"]
}};
const sx = () => SDT[L];

/* ---------- الخطوط والألوان ---------- */
const STY = [
  { f:'"AR Bei","AR BS"', w:900 },   // عصري (خطوط الموقع نفسها)
  { f:'"S Kufi"', w:900 },           // كوفي: Noto Kufi Arabic + Montserrat
  { f:'"S Reem"', w:700 },           // هندسي: Reem Kufi + Righteous
  { f:'"S Ruqaa"', w:700 },          // رقعة: Aref Ruqaa + Playfair Display
  { f:'"S Marhey"', w:700 },         // ناعم: Marhey + Lobster
  { f:'"S Vazir"', w:900 }           // عريض: Vazirmatn + Anton
];
const fontOf = (si, px) => `${STY[si].w} ${px}px ${STY[si].f}, sans-serif`;
const BOARDC = ["#15181c", "#3c424a", "#eceeef"];
const LEDRGB = [[242, 248, 255], [255, 190, 100], [255, 40, 40]];
const TRIMD = [["#3a3a3a", "#0f0f0f"], ["#ffffff", "#c9ced2"], ["#f2f4f6", "#868d94"], ["#f6d873", "#a3741c"]];   // نهاراً: أعلى، أسفل
const TRIMN = [["#1c1c1c", "#060606"], ["#a9afb4", "#5c6166"], ["#a5acb3", "#3a4046"], ["#c9a24e", "#5e4515"]];   // ليلاً
const MARKC = { red:"#E4000F", blue:"#0090D0", yel:"#FDE01B", org:"#F08000" };

const hex2rgb = h => { h = String(h || "").replace("#", ""); return h.length < 6 ? [235, 240, 242] : [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const rgba = (c, a = 1) => `rgba(${c.map(v => Math.round(Math.max(0, Math.min(255, v)))).join(",")},${a})`;
const mixC = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const dirOf = s => { for (const ch of s) { if (/[A-Za-z]/.test(ch)) return "ltr"; if (/[\u0590-\u08FF]/.test(ch)) return "rtl"; } return "ltr"; };
const iso = v => "\u2068" + v + "\u2069";            // يعزل اتجاه النص (عربي/إنجليزي) داخل الجملة حتى ما يتلخبط الترتيب
const linesOf = s => String(s || "").split("\n").map(v => v.trim()).filter(Boolean).slice(0, 2);
function rrect(g, x, y, w, h, r){ r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

/* ---------- ترتيب النص على اللوحة (كل القياسات بالسنتيمتر) ---------- */
let MC = null;
function layoutText(st, txt){
  const ls = linesOf(txt); if (!ls.length) return [];
  const W = st.w, H = st.h, padX = Math.max(6, W * .05), padY = Math.max(4, H * .14), iw = W - 2 * padX, ih = H - 2 * padY;
  const R2 = .46, GAP = .22, g = MC || (MC = document.createElement("canvas").getContext("2d"));
  g.font = fontOf(st.font, 100); g.textAlign = "center";
  const ms = ls.map(s => { g.direction = dirOf(s); const m = g.measureText(s);
    return { s, dir: g.direction, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent, l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight }; });
  const two = ms.length > 1, h1 = two ? ih / (1 + GAP + R2) : ih;
  let k = ms.map((m, i) => h1 * (i ? R2 : 1) / Math.max(1, m.a + m.d));
  k = k.map((v, i) => Math.min(v, iw / Math.max(1, ms[i].l + ms[i].r)));          // كل سطر يصغر لحاله إذا أعرض من اللوحة
  if (two) k[1] = Math.min(k[1], (ms[0].a + ms[0].d) * k[0] * R2 / Math.max(1, ms[1].a + ms[1].d));   // السطر الثاني يبقى أصغر
  const hs = ms.map((m, i) => (m.a + m.d) * k[i]);
  let y = (H - hs.reduce((a, b) => a + b, 0) - (two ? GAP * hs[0] : 0)) / 2;
  return ms.map((m, i) => { const o = { s: m.s, dir: m.dir, fs: 100 * k[i], base: y + m.a * k[i], cx: W / 2 - (m.r - m.l) * k[i] / 2, w: (m.l + m.r) * k[i], h: hs[i], top: y };
    y += hs[i] + GAP * hs[0]; return o; });
}
function textAt(g, li, si, p, ox, oy, dx = 0, dy = 0, stroke = false){
  g.font = fontOf(si, li.fs * p); g.direction = li.dir; g.textAlign = "center"; g.textBaseline = "alphabetic";
  (stroke ? g.strokeText : g.fillText).call(g, li.s, ox + (li.cx + dx) * p, oy + (li.base + dy) * p);
}

/* ---------- تحليل الحروف: المساحة، المحيط، القطع، وأماكن الليت ---------- */
let AN_KEY = "", AN = null;
function analyze(st, lay){
  const key = JSON.stringify([lay.map(l => [l.s, l.fs, l.cx, l.base]), st.font, st.w, st.h, st.led]);
  if (key === AN_KEY && AN) return AN;
  const W = st.w, H = st.h, r = Math.min(3, Math.sqrt(500000 / (W * H)));
  const cw = Math.max(8, Math.ceil(W * r)), ch = Math.max(8, Math.ceil(H * r)), N = cw * ch;
  const c = document.createElement("canvas"); c.width = cw; c.height = ch;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.fillStyle = "#000"; lay.forEach(li => textAt(g, li, st.font, r, 0, 0));
  const px = g.getImageData(0, 0, cw, ch).data, M = new Uint8Array(N);
  let area = 0; for (let i = 0; i < N; i++) if (px[i * 4 + 3] > 110) { M[i] = 1; area++; }
  // المحيط (لطول البكرة)
  let ed = 0;
  for (let y = 0, i = 0; y < ch; y++) for (let x = 0; x < cw; x++, i++) if (M[i]) {
    if (!x || !M[i - 1]) ed++; if (x === cw - 1 || !M[i + 1]) ed++; if (!y || !M[i - cw]) ed++; if (y === ch - 1 || !M[i + cw]) ed++; }
  // البعد عن حافة الحرف (chamfer 3-4)
  const D = new Uint16Array(N);
  for (let i = 0; i < N; i++) D[i] = M[i] ? 65000 : 0;
  for (let y = 0, i = 0; y < ch; y++) for (let x = 0; x < cw; x++, i++) if (D[i]) {
    let v = D[i];
    v = Math.min(v, x ? D[i - 1] + 3 : 3);
    if (y) { v = Math.min(v, D[i - cw] + 3); if (x) v = Math.min(v, D[i - cw - 1] + 4); if (x < cw - 1) v = Math.min(v, D[i - cw + 1] + 4); } else v = Math.min(v, 3);
    D[i] = v; }
  for (let y = ch - 1, i = N - 1; y >= 0; y--) for (let x = cw - 1; x >= 0; x--, i--) if (D[i]) {
    let v = D[i];
    v = Math.min(v, x < cw - 1 ? D[i + 1] + 3 : 3);
    if (y < ch - 1) { v = Math.min(v, D[i + cw] + 3); if (x < cw - 1) v = Math.min(v, D[i + cw + 1] + 4); if (x) v = Math.min(v, D[i + cw - 1] + 4); } else v = Math.min(v, 3);
    D[i] = v; }
  // القطع المنفصلة (كل حرف أو نقطة قطعة)
  const lab = new Int32Array(N), stk = new Int32Array(N), comps = [];
  for (let i = 0; i < N; i++) if (M[i] && !lab[i]) {
    const id = comps.length + 1; let sp = 0, x0 = cw, y0 = ch, x1 = 0, y1 = 0, n = 0, bi = i, bd = 0;
    stk[sp++] = i; lab[i] = id;
    while (sp) { const j = stk[--sp], jx = j % cw, jy = (j - jx) / cw; n++;
      if (jx < x0) x0 = jx; if (jx > x1) x1 = jx; if (jy < y0) y0 = jy; if (jy > y1) y1 = jy;
      if (D[j] > bd) { bd = D[j]; bi = j; }
      if (jx > 0 && M[j - 1] && !lab[j - 1]) { lab[j - 1] = id; stk[sp++] = j - 1; }
      if (jx < cw - 1 && M[j + 1] && !lab[j + 1]) { lab[j + 1] = id; stk[sp++] = j + 1; }
      if (jy > 0 && M[j - cw] && !lab[j - cw]) { lab[j - cw] = id; stk[sp++] = j - cw; }
      if (jy < ch - 1 && M[j + cw] && !lab[j + cw]) { lab[j + cw] = id; stk[sp++] = j + cw; }
      if (jy > 0 && jx > 0 && M[j - cw - 1] && !lab[j - cw - 1]) { lab[j - cw - 1] = id; stk[sp++] = j - cw - 1; }
      if (jy > 0 && jx < cw - 1 && M[j - cw + 1] && !lab[j - cw + 1]) { lab[j - cw + 1] = id; stk[sp++] = j - cw + 1; }
      if (jy < ch - 1 && jx > 0 && M[j + cw - 1] && !lab[j + cw - 1]) { lab[j + cw - 1] = id; stk[sp++] = j + cw - 1; }
      if (jy < ch - 1 && jx < cw - 1 && M[j + cw + 1] && !lab[j + cw + 1]) { lab[j + cw + 1] = id; stk[sp++] = j + cw + 1; } }
    comps.push({ x0, y0, x1, y1, n, bi, pts: 0 }); }
  // توزيع الليت: نبدأ من وسط الخطوط (الأبعد عن الحافة) ونحط ليت إذا ما في ليت قريبة أقل من المسافة
  const sp = (st.led === 8 ? CALC.space8 : CALC.space6) * r, minD = Math.round((st.led === 8 ? CALC.edge8 : CALC.edge6) * r * 3);
  let maxD = 0; for (let i = 0; i < N; i++) if (D[i] > maxD) maxD = D[i];
  const stp = r >= 2 ? 2 : 1, cs = Math.max(1, Math.ceil(sp)), gw = Math.ceil(cw / cs) + 2, grid = new Map(), pts = [], sp2 = sp * sp;   // نفحص كل ثاني بكسل حتى تبقى سريعة
  const ridge = (x, y, i) => x > 0 && y > 0 && x < cw - 1 && y < ch - 1 && D[i] >= D[i - 1] && D[i] >= D[i + 1] && D[i] >= D[i - cw] && D[i] >= D[i + cw];   // وسط الخط
  const place = (lo, hi, mid) => {            // نمرّ على البكسلات من الأبعد عن الحافة للأقرب، ضمن البعد [lo, hi]
    const ok1 = (x, y, i) => D[i] >= lo && D[i] <= hi && (!mid || ridge(x, y, i)), step = mid ? 1 : stp;
    const cnt = new Int32Array(maxD + 2); let tot = 0;
    for (let y = 0; y < ch; y += step) for (let x = 0, i = y * cw; x < cw; x += step, i += step) if (ok1(x, y, i)) { cnt[D[i]]++; tot++; }
    const start = new Int32Array(maxD + 2); for (let d = hi, o = 0; d >= lo; d--) { start[d] = o; o += cnt[d]; }
    const order = new Int32Array(tot);
    for (let y = 0; y < ch; y += step) for (let x = 0, i = y * cw; x < cw; x += step, i += step) if (ok1(x, y, i)) order[start[D[i]]++] = i;
    for (let k = 0; k < tot; k++) { const i = order[k], x = i % cw, y = (i - x) / cw, gx = (x / cs | 0) + 1, gy = (y / cs | 0) + 1;
      let ok = true;
      for (let yy = gy - 1; yy <= gy + 1 && ok; yy++) for (let xx = gx - 1; xx <= gx + 1 && ok; xx++) { const cell = grid.get(yy * gw + xx); if (!cell) continue;
        for (let q = 0; q < cell.length; q += 2) { const dx = cell[q] - x, dy = cell[q + 1] - y; if (dx * dx + dy * dy < sp2) { ok = false; break; } } }
      if (!ok) continue;
      const ci = gy * gw + gx; let cell = grid.get(ci); if (!cell) grid.set(ci, cell = []); cell.push(x, y); pts.push(i); comps[lab[i] - 1].pts++; } };
  place(minD, maxD, false);                   // الخطوط العريضة
  if (minD > 3) place(Math.max(3, Math.round(minD * .45)), minD - 1, true);   // الخطوط الرفيعة (أرفع من الليت) تاخذ ليت على طول وسطها
  comps.forEach(cm => { if (!cm.pts && cm.n > (r * 1.2) ** 2) { pts.push(cm.bi); cm.pts++; } });   // قطعة صغيرة أو رفيعة: ليت وحدة
  // اتجاه كل ليت: مع أطول امتداد للخط
  const cap = Math.round(20 * r), DIRS = [[1, 0, 0], [1, 1, Math.PI / 4], [0, 1, Math.PI / 2], [-1, 1, Math.PI * 3 / 4]];
  const runLen = (x, y, dx, dy) => { let n = 0; for (const s of [-1, 1]) { let xx = x, yy = y, m = 0; while (m < cap) { xx += dx * s; yy += dy * s; if (xx < 0 || yy < 0 || xx >= cw || yy >= ch || !M[yy * cw + xx]) break; m++; } n += m; } return n * Math.hypot(dx, dy); };
  const P = pts.map(i => { const x = i % cw, y = (i - x) / cw; let best = -1, a = 0;
    DIRS.forEach(([dx, dy, ang]) => { const v = runLen(x, y, dx, dy); if (v > best + 1) { best = v; a = ang; } });
    return { x: x / r, y: y / r, a }; });
  AN_KEY = key;
  AN = { n: P.length, pts: P, area: area / (r * r), perim: ed / r * .9,
         comps: comps.map(cm => ({ w: (cm.x1 - cm.x0 + 1) / r, h: (cm.y1 - cm.y0 + 1) / r })) };
  return AN;
}

/* ---------- كم لوح (244×122) تحتاج القطع ---------- */
function packSheets(comps){
  const [SW, SH] = CALC.sheet, G = CALC.cutGap, items = [];
  comps.forEach(c => { let w = c.w + G, h = c.h + G;
    if (h > SH && w <= SH) [w, h] = [h, w];                      // نلفّ القطعة إذا تطلع هيچ
    if (w > SW || h > SH) { const nx = Math.ceil(w / SW), ny = Math.ceil(h / SH);   // أكبر من اللوح: تنقسم
      for (let i = 0; i < nx * ny; i++) items.push([w / nx, h / ny]); }
    else items.push([w, h]); });
  items.sort((a, b) => b[1] - a[1]);
  const sheets = [];
  for (const [w, h] of items) { let done = false;
    for (const s of sheets) { for (const sh of s.shelves) if (h <= sh.h && sh.x + w <= SW) { sh.x += w; done = true; break; }
      if (!done && s.used + h <= SH) { s.shelves.push({ h, x: w }); s.used += h; done = true; }
      if (done) break; }
    if (!done) sheets.push({ used: h, shelves: [{ h, x: w }] }); }
  return sheets.length;
}

/* ---------- المحوّلات: أكبر محوّلة متوفرة، والباقي بأصغر وحدة تكفي ---------- */
function psuPlan(watts){
  const av = [100, 200, 300, 400].filter(w => BY_ID["psu" + w] && !BY_ID["psu" + w].it.off);
  if (!av.length || watts <= 0) return [];
  const mx = Math.max(...av), out = {}; let rem = watts;
  while (rem > mx) { out[mx] = (out[mx] || 0) + 1; rem -= mx; }
  const pick = av.filter(w => w >= rem).sort((a, b) => a - b)[0] || mx; out[pick] = (out[pick] || 0) + 1;
  return Object.entries(out).map(([w, n]) => ({ w: +w, n })).sort((a, b) => b.w - a.w);
}

/* ---------- رسم المشهد: واجهة المحل واللوحة ---------- */
function litColor(face, led){
  if (!face) return mixC(led, [255, 255, 255], .45);
  const f = hex2rgb(face); let c = f.map((v, i) => v * led[i] / 255);
  const mx = Math.max(...c, 1); c = c.map(v => v * 255 / mx);
  return mixC(c, [255, 255, 255], f[0] + f[1] + f[2] > 700 ? .35 : .15);
}
function drawScene(cv, st, lay, an, mode, cssW, dpr, foot, maxCssH){
  const W = st.w, H = st.h, MX = Math.max(28, W * .075), TOP = Math.max(28, H * .32), GL = Math.min(170, Math.max(100, W * .2)), GR = 22;
  const SW = W + 2 * MX, SH = TOP + H + 12 + GL + GR;
  const p = Math.min(cssW * dpr / SW, maxCssH ? maxCssH * dpr / SH : 1e9), fh = foot ? Math.round(SW * p * .1) : 0;
  cv.width = Math.round(SW * p); cv.height = Math.round(SH * p) + fh;
  const g = cv.getContext("2d"), night = mode !== "day", ledMode = mode === "led", X = cv.width, Y = Math.round(SH * p);
  const led = LEDRGB[st.ledC] || LEDRGB[0], faceHex = (PLASTIC_COLORS[st.face] || PLASTIC_COLORS[0])[2], opaque = st.face === 1;
  const lit = litColor(faceHex, led), glow = opaque ? led : mixC(lit, led, .4);
  // الجدار
  let gr = g.createLinearGradient(0, 0, 0, Y);
  if (night) { gr.addColorStop(0, "#0a0e13"); gr.addColorStop(1, "#151b22"); } else { gr.addColorStop(0, "#c5cbd0"); gr.addColorStop(1, "#dde1e4"); }
  g.fillStyle = gr; g.fillRect(0, 0, X, Y);
  g.strokeStyle = night ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.07)"; g.lineWidth = Math.max(1, p * .5);
  for (let y = 40; y < SH - GR; y += 40) { g.beginPath(); g.moveTo(0, y * p); g.lineTo(X, y * p); g.stroke(); }
  const bx = MX * p, by = TOP * p, bw = W * p, bh = H * p, ox = bx, oy = by;
  // ضوء اللوحة على الجدار والأرض بالليل
  if (night && !ledMode) { const rg = g.createRadialGradient(bx + bw / 2, by + bh / 2, bh * .2, bx + bw / 2, by + bh / 2, Math.max(bw, bh) * .75);
    rg.addColorStop(0, rgba(glow, .16)); rg.addColorStop(1, rgba(glow, 0)); g.fillStyle = rg; g.fillRect(0, 0, X, Y); }
  // الواجهة الزجاجية
  const fy = (TOP + H + 12) * p, fhh = GL * p, fr = Math.max(2, 5 * p), panes = Math.max(2, Math.round(W / 150)), pw = (bw - fr * (panes + 1)) / panes;
  g.fillStyle = night ? "#1a1e23" : "#4b5158"; g.fillRect(bx, fy, bw, fhh);
  for (let i = 0; i < panes; i++) { const x = bx + fr + i * (pw + fr), y = fy + fr, h = fhh - fr * 2, gg = g.createLinearGradient(0, y, 0, y + h);
    if (night) { gg.addColorStop(0, "#1d242c"); gg.addColorStop(1, "#0b0e12"); } else { gg.addColorStop(0, "#a7bfd1"); gg.addColorStop(.55, "#d9e5ed"); gg.addColorStop(1, "#8ea5b5"); }
    g.fillStyle = gg; g.fillRect(x, y, pw, h);
    g.save(); g.beginPath(); g.rect(x, y, pw, h); g.clip();
    if (night) { const rg = g.createRadialGradient(x + pw / 2, y + h * .12, 0, x + pw / 2, y + h * .12, Math.max(pw, h) * .95);   // ضوء داخل المحل
      rg.addColorStop(0, "rgba(255,206,140,.55)"); rg.addColorStop(.45, "rgba(255,170,95,.2)"); rg.addColorStop(1, "rgba(255,170,95,0)"); g.fillStyle = rg; g.fillRect(x, y, pw, h);
      g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(x + pw * .1, y + h * .5, pw * .8, Math.max(1, 2 * p)); g.fillRect(x + pw * .1, y + h * .76, pw * .8, Math.max(1, 2 * p)); }
    g.translate(x, y); g.rotate(-.55); g.fillStyle = night ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.35)";           // انعكاس على الزجاج
    g.fillRect(-pw, h * .25, pw * 3, h * .1); g.fillRect(-pw, h * .5, pw * 3, h * .04); g.restore();
    if (i === Math.floor(panes / 2)) { g.fillStyle = night ? "#c9a24e" : "#9aa1a8"; g.fillRect(x + (panes % 2 ? pw * .5 : 0) - 2 * p, y + h * .45, 4 * p, h * .18); } }
  g.fillStyle = night ? "#06080b" : "#8d9195"; g.fillRect(0, (SH - GR) * p, X, GR * p);
  g.fillStyle = night ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.25)"; g.fillRect(0, (SH - GR) * p, X, Math.max(1, p));
  // اللوحة خلف الحروف
  const bc = hex2rgb(BOARDC[st.bg] || BOARDC[0]);
  if (!night) { g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 6 * p; g.shadowOffsetY = 3 * p; }
  g.fillStyle = rgba(night ? bc.map(v => v * (st.bg === 2 ? .38 : .55)) : bc); rrect(g, bx, by, bw, bh, Math.max(2, 1.5 * p)); g.fill();
  if (!night) g.restore();
  g.strokeStyle = night ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.14)"; g.lineWidth = Math.max(1, p * .6); rrect(g, bx, by, bw, bh, Math.max(2, 1.5 * p)); g.stroke();
  // الحروف
  const H1 = lay.length ? lay[0].h : H * .6, depth = st.side === "tape" ? 8 : 6, ddx = depth * .14, ddy = depth * .3;
  const trimC = (night ? TRIMN : TRIMD)[st.sideC] || TRIMD[0];
  const sides = () => { const steps = Math.min(12, Math.max(2, Math.ceil(Math.hypot(ddx, ddy) * p)));
    const tg = g.createLinearGradient(0, by, 0, by + bh); tg.addColorStop(0, trimC[0]); tg.addColorStop(1, trimC[1]); g.fillStyle = tg;
    for (let s = steps; s >= 1; s--) lay.forEach(li => textAt(g, li, st.font, p, ox, oy, ddx * s / steps, ddy * s / steps)); };
  if (ledMode) {
    g.fillStyle = "rgba(255,255,255,.07)"; lay.forEach(li => textAt(g, li, st.font, p, ox, oy));
    g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = Math.max(1, p * .5); g.lineJoin = "round"; lay.forEach(li => textAt(g, li, st.font, p, ox, oy, 0, 0, true));
    const Lm = (st.led === 8 ? 8 : 6) * p, Wm = (st.led === 8 ? 2.1 : 1.7) * p, chip = ["#f2b705", "#ff9a2e", "#ff3b3b"][st.ledC] || "#f2b705";
    an.pts.forEach(q => { g.save(); g.translate(ox + q.x * p, oy + q.y * p); g.rotate(q.a);
      g.fillStyle = "#eef1f3"; rrect(g, -Lm / 2, -Wm / 2, Lm, Wm, Wm * .35); g.fill();
      g.fillStyle = chip; for (const k of [-1, 0, 1]) { g.beginPath(); g.arc(k * Lm * .3, 0, Wm * .3, 0, 7); g.fill(); }
      g.restore(); });
  } else if (night) {
    g.save(); g.globalCompositeOperation = "lighter"; g.shadowColor = rgba(glow, opaque ? 1 : .6); g.shadowBlur = H1 * p * (opaque ? .3 : .5);
    g.fillStyle = rgba(glow, opaque ? .9 : .22); lay.forEach(li => textAt(g, li, st.font, p, ox, oy, opaque ? ddx : 0, opaque ? ddy : 0)); g.restore();
    sides();
    if (!opaque) { g.save(); g.shadowColor = rgba(glow, .95); g.shadowBlur = H1 * p * .16; g.fillStyle = rgba(lit); lay.forEach(li => textAt(g, li, st.font, p, ox, oy)); g.restore(); }
    const fg = g.createLinearGradient(0, by, 0, by + bh);
    if (opaque) { fg.addColorStop(0, "#1b1b1b"); fg.addColorStop(1, "#050505"); }
    else { fg.addColorStop(0, rgba(mixC(lit, [255, 255, 255], .3))); fg.addColorStop(1, rgba(lit)); }
    g.fillStyle = fg; lay.forEach(li => textAt(g, li, st.font, p, ox, oy));
  } else {
    g.save(); g.shadowColor = "rgba(0,0,0,.42)"; g.shadowBlur = depth * p * .6; g.shadowOffsetX = depth * p * .3; g.shadowOffsetY = depth * p * .55;
    g.fillStyle = trimC[1]; lay.forEach(li => textAt(g, li, st.font, p, ox, oy, ddx, ddy)); g.restore();
    sides();
    const fc = hex2rgb(faceHex), fg = g.createLinearGradient(0, by, 0, by + bh);
    fg.addColorStop(0, rgba(mixC(fc, [255, 255, 255], .18), faceHex ? 1 : .55)); fg.addColorStop(1, rgba(mixC(fc, [0, 0, 0], .06), faceHex ? 1 : .55));
    g.fillStyle = fg; lay.forEach(li => textAt(g, li, st.font, p, ox, oy));
  }
  // خطوط القياس (مثل المسطرة)
  const col = night ? "rgba(233,240,236,.8)" : "rgba(14,21,18,.72)", fpx = Math.max(11 * dpr, Math.min(20 * dpr, X * .026)), tk = Math.max(4, fpx * .45);
  g.strokeStyle = g.fillStyle = col; g.lineWidth = Math.max(1, dpr);
  const yT = by - Math.max(fpx * .9, TOP * p * .42);
  g.beginPath(); g.moveTo(bx, yT); g.lineTo(bx + bw, yT); g.moveTo(bx, yT - tk); g.lineTo(bx, yT + tk); g.moveTo(bx + bw, yT - tk); g.lineTo(bx + bw, yT + tk); g.stroke();
  const lab1 = `${fmt(W)} ${t().cm}`; g.font = `700 ${fpx}px "AR Plex", sans-serif`; g.direction = "rtl"; g.textAlign = "center"; g.textBaseline = "middle";
  const lw = g.measureText(lab1).width + fpx; g.fillStyle = night ? "#0c1015" : "#ccd1d5"; g.fillRect(bx + bw / 2 - lw / 2, yT - fpx * .7, lw, fpx * 1.4);
  g.fillStyle = col; g.fillText(lab1, bx + bw / 2, yT + fpx * .05);
  if (lay.length) { const L1 = lay[0], xs = bx + bw + MX * p * .5, y0 = oy + L1.top * p, y1 = y0 + L1.h * p, lab2 = `${fmt(L1.h)} ${t().cm}`;
    g.beginPath(); g.moveTo(xs, y0); g.lineTo(xs, y1); g.moveTo(xs - tk, y0); g.lineTo(xs + tk, y0); g.moveTo(xs - tk, y1); g.lineTo(xs + tk, y1); g.stroke();
    g.save(); g.translate(xs, (y0 + y1) / 2); g.rotate(-Math.PI / 2); g.textBaseline = "middle"; const lw2 = g.measureText(lab2).width + fpx * .8;
    if (lw2 < (y1 - y0) * 1.6) { g.fillStyle = night ? "#0c1015" : "#ccd1d5"; g.fillRect(-lw2 / 2, -fpx * .65, lw2, fpx * 1.3); g.fillStyle = col; g.fillText(lab2, 0, fpx * .05); }
    g.restore(); }
  if (ledMode && an) { const s = `${an.n} ${sx().leds}`; g.font = `700 ${fpx * 1.1}px "AR Plex", sans-serif`; g.textAlign = "right"; g.textBaseline = "top";
    const tw = g.measureText(s).width + fpx; g.fillStyle = "rgba(0,0,0,.55)"; rrect(g, X - tw - fpx * .6, (SH - GR) * p - fpx * 2.2, tw, fpx * 1.7, fpx * .4); g.fill();
    g.fillStyle = "#FDE01B"; g.fillText(s, X - fpx * 1.1, (SH - GR) * p - fpx * 2.0); }
  return { p, fh, Y, cssW: cv.width / dpr };
}
const fmt = v => String(Math.round(v));

/* ---------- الحالة ---------- */
const ST_DEF = { text: "", font: 0, w: 700, h: 120, ledC: 0, face: 0, side: "alu", sideC: 3, back: 10, bg: 0, led: 6, watt: 1.5, mode: "night" };
let ST = { ...ST_DEF };
try { Object.assign(ST, JSON.parse(store.get("studio") || "{}")); } catch(e) {}
const saveST = () => store.set("studio", JSON.stringify(ST));
const clampN = (v, a, b, d) => { v = +v; return v >= a && v <= b ? Math.round(v) : d; };
function sanitize(){
  ST.font = clampN(ST.font, 0, STY.length - 1, 0); ST.w = clampN(ST.w, 50, 3000, 700); ST.h = clampN(ST.h, 20, 600, 120);
  ST.ledC = clampN(ST.ledC, 0, LED_COLORS.length - 1, 0); ST.face = clampN(ST.face, 0, PLASTIC_COLORS.length - 1, 0);
  ST.side = ST.side === "tape" ? "tape" : "alu"; ST.sideC = clampN(ST.sideC, 0, TRIM_COLORS.length - 1, 3);
  ST.back = [10, 8, 6].includes(+ST.back) ? +ST.back : 10; ST.bg = clampN(ST.bg, 0, 2, 0); ST.led = +ST.led === 8 ? 8 : 6;
  ST.watt = +ST.watt === 1.8 ? 1.8 : 1.5; ST.mode = ["night", "day", "led"].includes(ST.mode) ? ST.mode : "night"; ST.text = String(ST.text || "").slice(0, 80);
}
sanitize();

/* ---------- الستايل ---------- */
function injectCSS(){
  if (document.getElementById("sdo-css")) return;
  const ar = "U+0600-06FF,U+0750-077F,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC", la = "U+0000-024F,U+2000-206F,U+20AC,U+2212";
  const ff = (n, a, b) => `@font-face{font-family:"${n}";src:url(assets/${a}) format("woff2");font-weight:100 900;font-display:swap;unicode-range:${ar}}
@font-face{font-family:"${n}";src:url(assets/${b}) format("woff2");font-weight:100 900;font-display:swap;unicode-range:${la}}`;
  const s = document.createElement("style"); s.id = "sdo-css";
  s.textContent = ff("S Kufi", "s-kufi-ar.woff2", "s-kufi-la.woff2") + ff("S Reem", "s-reem-ar.woff2", "s-reem-la.woff2") + ff("S Ruqaa", "s-ruqaa-ar.woff2", "s-ruqaa-la.woff2")
   + ff("S Marhey", "s-marhey-ar.woff2", "s-marhey-la.woff2") + ff("S Vazir", "s-vazir-ar.woff2", "s-vazir-la.woff2") + `
.sdo{display:grid;gap:14px;margin-top:14px}
.sdo-pv{position:sticky;top:calc(var(--bar) + var(--rule) + env(safe-area-inset-top,0px));z-index:5;margin:0 -16px;padding:8px 16px 10px;background:var(--mat);border-bottom:1px solid var(--line)}
.sdo-cv{position:relative;border-radius:14px;overflow:hidden;background:#0a0e13;box-shadow:0 10px 26px -14px rgba(0,0,0,.6)}
.sdo-cv canvas{display:block;max-width:100%;height:auto;margin:0 auto}
.sdo-bar{display:flex;gap:8px;align-items:center;margin-top:8px}
.sdo-bar .seg{flex:1}
.sdo-facts{margin-top:6px;color:var(--mut);font-size:13px;font-weight:700;text-align:center;min-height:1.6em}
.sdo-facts b{color:var(--ink);font:800 16px var(--fn);direction:ltr;unicode-bidi:isolate}
.sdo-ctl,.sdo-mat{background:var(--sheet);border:1px solid var(--line);border-radius:16px;padding:14px 12px;display:grid;gap:16px}
.sdo-g h2{font:700 13px var(--fb);color:var(--mut);margin:0 0 8px}
.sdo-ctl textarea{font:700 18px var(--fb);min-height:76px}
.sdo-fonts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.sdo-fonts button{min-height:52px;padding:4px 6px;border-radius:10px;border:1.5px solid var(--line);background:var(--sheet);font-size:20px;line-height:1.1;white-space:nowrap;overflow:hidden}
.sdo-fonts button[aria-pressed=true]{border-color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}
.sdo-pre{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.sdo-pre button{min-height:38px;padding:0 10px;border-radius:8px;border:1.5px solid var(--line);background:transparent;font:800 15px var(--fn);direction:ltr}
.sdo-pre button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:var(--sheet)}
.sdo-sw{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.sdo-sw button{position:relative;width:44px;height:44px;padding:0;border-radius:50%;border:2px solid var(--line);background:var(--c);box-shadow:inset 0 0 0 2px var(--sheet)}
.sdo-sw button[aria-pressed=true]{border-color:var(--ink);box-shadow:inset 0 0 0 3px var(--sheet),0 0 0 2px var(--ink)}
.sdo-sw button.tr{background:repeating-conic-gradient(#c9ced4 0 25%,#fff 0 50%) 0 0/12px 12px}
.sdo-sw .nm{font-size:13px;font-weight:700;color:var(--mut);margin-inline-start:4px}
.sdo-g .seg+.sdo-sw{margin-top:10px}
.sdo-mat h2{font-size:19px;display:flex;align-items:center;gap:8px}
.sdo-mat h2::before{content:"";width:12px;height:12px;border-radius:3px;background:var(--four)}
.mrow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;align-items:center;padding:10px 0;border-bottom:1px dashed var(--line)}
.mrow span{font-weight:700;font-size:15px}
.mrow b{font:800 28px/1 var(--fn);direction:ltr;text-align:left}
.mrow small{grid-column:1/-1;color:var(--mut);font-size:12px}
.mrow.off{opacity:.5}
.sdo-mat .full{margin-top:0}
.sdo-warn{padding:10px 12px;border-radius:10px;background:var(--soft);color:var(--red-l);font-weight:700;font-size:13px}
@media(min-width:900px){
  .sdo{grid-template-columns:minmax(0,1fr) 380px;grid-template-areas:"pv ctl" "pv mat";align-items:start}
  .sdo-pv{grid-area:pv;margin:0;padding:0;border:0;background:none;top:calc(var(--bar) + var(--rule) + 14px)}
  .sdo-ctl{grid-area:ctl}.sdo-mat{grid-area:mat}
}`;
  document.head.appendChild(s);
}

/* ---------- الصفحة ---------- */
const sw = (attr, i, on, css, label, extra = "") => `<button type="button" ${attr}="${i}" aria-pressed="${on}" aria-label="${esc(label)}" title="${esc(label)}" style="--c:${css}"${extra}></button>`;
function renderStudio(){
  injectCSS(); sanitize();
  const box = $("#studio"); if (!box) return;
  const fa = document.activeElement, keep = fa && fa.id === "stx" ? [fa.selectionStart, fa.selectionEnd] : null;
  const s = sx(), x = t(), seg = (id, items, cur) => `<div class="seg" id="${id}">${items.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(cur)}">${l}</button>`).join("")}</div>`;
  const nmc = z => nm([z[0], z[1]]);
  box.innerHTML = `<div class="sdo">
  <section class="sdo-pv" aria-label="${esc(s.cvLabel)}">
    <div class="sdo-cv"><canvas id="scv" role="img" aria-label="${esc(s.cvLabel)}"></canvas></div>
    <div class="sdo-bar">${seg("smode", [["night", s.modes[0]], ["day", s.modes[1]], ["led", s.modes[2]]], ST.mode)}</div>
    <p class="sdo-facts" id="sfacts" aria-live="polite"></p>
  </section>
  <section class="sdo-ctl">
    <label class="fld"><span>${s.txt}</span><textarea id="stx" rows="2" maxlength="80" dir="auto" placeholder="${esc(s.txtPh)}">${esc(ST.text)}</textarea><small class="hint">${s.txtHint}</small></label>
    <div class="sdo-g"><h2>${s.font}</h2><div class="sdo-fonts" id="sfont">${STY.map((z, i) => `<button type="button" data-v="${i}" aria-pressed="${i === ST.font}" style="font:${z.w} 20px ${esc(z.f)}">${s.styles[i][0]}</button>`).join("")}</div></div>
    <div class="sdo-g"><h2>${s.size}</h2><div class="two"><label class="fld"><span>${s.w}</span><input type="number" id="sw" inputmode="numeric" min="50" max="3000" value="${ST.w}" dir="ltr"></label><label class="fld"><span>${s.h}</span><input type="number" id="sh" inputmode="numeric" min="20" max="600" value="${ST.h}" dir="ltr"></label></div>
      <div class="sdo-pre" id="spre">${[[700, 120], [600, 100], [500, 100], [400, 80], [300, 60]].map(([a, b]) => `<button type="button" data-w="${a}" data-h="${b}" aria-pressed="${a === ST.w && b === ST.h}">${a}×${b}</button>`).join("")}</div></div>
    <div class="sdo-g"><h2>${s.light}</h2><div class="sdo-sw" id="sled">${LED_COLORS.map((z, i) => sw("data-v", i, i === ST.ledC, z[2], nmc(z))).join("")}<span class="nm" id="sledn">${nmc(LED_COLORS[ST.ledC])}</span></div></div>
    <div class="sdo-g"><h2>${s.face}</h2><div class="sdo-sw" id="sface">${PLASTIC_COLORS.map((z, i) => sw("data-v", i, i === ST.face, z[2] || "#fff", nmc(z), z[2] ? "" : ' class="tr"')).join("")}<span class="nm" id="sfacen">${nmc(PLASTIC_COLORS[ST.face])}</span></div></div>
    <div class="sdo-g"><h2>${s.sides}</h2>${seg("sside", [["tape", s.sideK[0] + " 8\u00a0" + t().cm], ["alu", s.sideK[1] + " 6\u00a0" + t().cm]], ST.side)}
      <div class="sdo-sw" id="strim">${TRIM_COLORS.map((z, i) => sw("data-v", i, i === ST.sideC, z[2], nmc(z))).join("")}<span class="nm" id="strimn">${nmc(TRIM_COLORS[ST.sideC])}</span></div></div>
    <div class="sdo-g"><h2>${s.back}</h2>${seg("sback", [10, 8, 6].map(v => [v, nm(BY_ID["foam" + v].it.spec.find(z => z.k === "thick").v).replace(" ", "\u00a0")]), ST.back)}</div>
    <div class="sdo-g"><h2>${s.board}</h2><div class="sdo-sw" id="sbg">${BOARDC.map((c, i) => sw("data-v", i, i === ST.bg, c, s.boards[i])).join("")}<span class="nm" id="sbgn">${s.boards[ST.bg]}</span></div></div>
    <div class="sdo-g"><h2>${s.led}</h2><div class="two">${seg("sledz", [[6, nm(BY_ID.led6.it.name)], [8, nm(BY_ID.led8.it.name)]], ST.led)}${seg("swatt", [[1.5, "1.5\u00a0" + s.watt], [1.8, "1.8\u00a0" + s.watt]], ST.watt)}</div></div>
  </section>
  <section class="sdo-mat" id="smat"></section>
</div>`;
  const on = (id, fn) => { const el = $("#" + id); if (el) el.onclick = e => { const b = e.target.closest("button"); if (b) fn(b); }; };
  const press = (id, b) => $$("#" + id + " button").forEach(z => z.setAttribute("aria-pressed", z === b));
  const set = (k, v, id, b, nmId, nmTxt) => { ST[k] = v; press(id, b); if (nmId) $("#" + nmId).textContent = nmTxt; saveST(); schedule(); };
  on("smode", b => set("mode", b.dataset.v, "smode", b));
  on("sfont", b => set("font", +b.dataset.v, "sfont", b));
  on("sled", b => set("ledC", +b.dataset.v, "sled", b, "sledn", nmc(LED_COLORS[+b.dataset.v])));
  on("sface", b => set("face", +b.dataset.v, "sface", b, "sfacen", nmc(PLASTIC_COLORS[+b.dataset.v])));
  on("sside", b => set("side", b.dataset.v, "sside", b));
  on("strim", b => set("sideC", +b.dataset.v, "strim", b, "strimn", nmc(TRIM_COLORS[+b.dataset.v])));
  on("sback", b => set("back", +b.dataset.v, "sback", b));
  on("sbg", b => set("bg", +b.dataset.v, "sbg", b, "sbgn", sx().boards[+b.dataset.v]));
  on("sledz", b => set("led", +b.dataset.v, "sledz", b));
  on("swatt", b => set("watt", +b.dataset.v, "swatt", b));
  on("spre", b => { ST.w = +b.dataset.w; ST.h = +b.dataset.h; $("#sw").value = ST.w; $("#sh").value = ST.h; press("spre", b); saveST(); schedule(); });
  const tx = $("#stx");
  tx.oninput = () => { const v = tx.value.split("\n").slice(0, 2).join("\n"); if (v !== tx.value) tx.value = v; ST.text = v; saveST(); schedule(); };
  const num = (id, k, a, b) => { const el = $("#" + id);
    el.oninput = () => { const v = +el.value; if (v >= a && v <= b) { ST[k] = Math.round(v); $$("#spre button").forEach(z => z.setAttribute("aria-pressed", +z.dataset.w === ST.w && +z.dataset.h === ST.h)); saveST(); schedule(); } };
    el.onchange = () => { el.value = ST[k]; }; };
  num("sw", "w", 50, 3000); num("sh", "h", 20, 600);
  if (keep) { tx.focus({ preventScroll: true }); try { tx.setSelectionRange(keep[0], keep[1]); } catch(e) {} }
  if (!window.__sdoRZ) { window.__sdoRZ = 1; addEventListener("resize", () => { if (VIEW === "studio") schedule(); }); }
  schedule();
}

let RAF = 0, LAST = null, SEQ = 0;
function schedule(){ cancelAnimationFrame(RAF); RAF = requestAnimationFrame(() => { drawStudio(); }); }
async function drawStudio(){
  const cv = $("#scv"); if (!cv) return;
  const s = sx(), empty = !ST.text.trim(), txt = empty ? s.txtPh : ST.text, my = ++SEQ;
  try { await document.fonts.load(fontOf(ST.font, 60), txt); } catch(e) {}
  if (my !== SEQ || !$("#scv")) return;                                  // رسمة أحدث بدأت، هاي قديمة
  const lay = layoutText(ST, txt), an = analyze(ST, lay);
  const dpr = Math.min(2, window.devicePixelRatio || 1), cssW = Math.max(240, cv.parentElement.clientWidth);
  const r = drawScene(cv, ST, lay, an, ST.mode, cssW, dpr, false, Math.max(170, Math.min(innerWidth >= 900 ? 560 : 330, innerHeight * .4)));
  cv.style.width = r.cssW + "px"; cv.parentElement.style.background = ST.mode === "day" ? "#c5cbd0" : "#0a0e13";
  cv.setAttribute("aria-label", `${s.cvLabel}: «${iso(txt.replace(/\n/g, " / "))}» · ${ST.w}×${ST.h} ${t().cm}`);
  LAST = { lay, an, empty };
  const L1 = lay[0] || { h: 0, w: 0 }, wMax = Math.max(0, ...lay.map(l => l.w));
  $("#sfacts").innerHTML = empty ? `${s.size}: <b>${ST.w}×${ST.h}</b>`
    : `${s.textH} <b>${fmt(L1.h)}</b> ${t().cm} · ${s.textW} <b>${fmt(wMax)}</b> ${t().cm} · <b>${an.n}</b> ${s.leds}`;
  renderMat();
}

/* ---------- المواد (بدون أسعار) ---------- */
function matList(){
  if (!LAST) return [];
  const { an } = LAST, s = sx(), nmc = z => nm([z[0], z[1]]);
  const need = an.n * ST.watt * CALC.psu, ps = psuPlan(need), sheets = packSheets(an.comps), trimM = Math.ceil(an.perim / 100 * CALC.trimExtra);
  const ledId = "led" + ST.led, rows = [];
  rows.push({ k: `${ledId}:${ST.ledC}`, id: ledId, l: `${nm(BY_ID[ledId].it.name)} · ${nmc(LED_COLORS[ST.ledC])} · ${ST.watt} ${s.watt}`, q: an.n, u: s.pcsU,
    sub: `${s.power}: ${fmt(an.n * ST.watt)} ${s.watt}` });
  ps.forEach(z => rows.push({ k: `psu${z.w}:-1`, id: "psu" + z.w, l: nm(BY_ID["psu" + z.w].it.name), q: z.n, u: s.pcsU }));
  rows.push({ k: `plastic:${ST.face}`, id: "plastic", l: `${nm(BY_ID.plastic.it.name)} ${nmc(PLASTIC_COLORS[ST.face])} ${s.faceM}`, q: sheets, u: s.sheetU });
  rows.push({ k: `foam${ST.back}:-1`, id: "foam" + ST.back, l: `${nm(BY_ID["foam" + ST.back].it.name)} ${s.backM}`, q: sheets, u: s.sheetU });
  rows.push({ k: `${ST.side}:${ST.sideC}`, id: ST.side, l: `${nm(BY_ID[ST.side].it.name)} ${nmc(TRIM_COLORS[ST.sideC])} ${s.sideM}`, q: trimM, u: s.mU });
  return rows.map(r => ({ ...r, off: !!(BY_ID[r.id].it.off || BY_ID[r.id].it.price == null) }));
}
function renderMat(){
  const box = $("#smat"); if (!box || !LAST) return;
  const s = sx(), rows = matList(), small = !LAST.empty && LAST.lay[0] && LAST.lay[0].h < 12;
  box.innerHTML = `<h2>${s.mat}</h2>${small ? `<p class="sdo-warn">${s.small}</p>` : ""}
    <div>${LAST.empty ? `<p class="hint">${s.txt}…</p>` : rows.map(r => `<div class="mrow${r.off ? " off" : ""}"><span>${esc(r.l)}</span><b>${r.q}</b><small>${r.u}${r.sub ? " · " + esc(r.sub) : ""}${r.off ? " · " + s.na : ""}</small></div>`).join("")}</div>
    <p class="hint">${s.matNote}</p>
    <button type="button" class="btn k full" id="sadd" style="--k:var(--ink);--t:var(--sheet)"${LAST.empty ? " disabled" : ""}>${I.plus}<span>${s.addMat}</span></button>
    ${LAST.empty ? "" : `<a class="btn wa full" id="ssend" target="_blank" rel="noopener" href="${esc(waLink(designMsg()))}">${I.wa}<span>${s.sendD}</span></a>
    <button type="button" class="btn full" id="ssave">${I.pics}<span>${s.saveImg}</span></button>`}`;
  $("#sadd").onclick = addMaterials;
  const sv2 = $("#ssave"); if (sv2) sv2.onclick = saveDesign;
}
function designMsg(){
  const s = sx(), nmc = z => nm([z[0], z[1]]), txt = ST.text.trim() || "—";
  return [s.dIntro, `${s.dTxt}: «${iso(txt.replace(/\n/g, " / "))}»`, `${s.dSize}: ${ST.w} × ${ST.h} ${t().cm}`, `${s.dFont}: ${s.styles[ST.font][0]}`,
    `${s.dLight}: ${nmc(LED_COLORS[ST.ledC])} · ${s.dFace}: ${nmc(PLASTIC_COLORS[ST.face])}`,
    `${s.dSides}: ${nm(BY_ID[ST.side].it.name)} ${nmc(TRIM_COLORS[ST.sideC])} · ${s.dBack}: ${nm(BY_ID["foam" + ST.back].it.name)}`].join("\n");
}
function addMaterials(){
  if (!LAST || LAST.empty) return;
  matList().forEach(r => { if (!r.off && r.q > 0 && parseKey(r.k)) setQty(r.k, Math.min(MAXQ, (CART[r.k] || 0) + r.q)); });
  setNote(`${sx().note}: «${iso(ST.text.trim().replace(/\n/g, " / "))}» · ${iso(ST.w + "×" + ST.h)} ${t().cm} · ${nm(BY_ID["led" + ST.led].it.name)} ${ST.watt} ${sx().watt}`);
  toast(sx().added);
  openDlg("cart", t().cart); renderCart();
}

/* ---------- حفظ صورة اللوحة ومشاركتها ---------- */
async function saveDesign(){
  if (!LAST) return;
  const cv = document.createElement("canvas"), r = drawScene(cv, ST, LAST.lay, LAST.an, ST.mode === "led" ? "night" : ST.mode, 1000, 1.6, true);
  await brandFooter(cv.getContext("2d"), 0, r.Y, cv.width, r.fh);
  const blob = await new Promise(res => cv.toBlob(res, "image/png"));
  showImage(blob, "ahmed-reklam-sign.png", t().navStudio, designMsg());
}
let IMG_URL = "";
const SHARE_I = sv(`<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/>`);
const DL_I = sv(`<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>`);
function showImage(blob, name, title, text){
  if (!blob) return;
  if (IMG_URL) URL.revokeObjectURL(IMG_URL);
  IMG_URL = URL.createObjectURL(blob);
  const s = sx(), file = new File([blob], name, { type: "image/png" }), canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  openDlg("img", title);
  $("#db").innerHTML = `<img class="wkv" src="${IMG_URL}" alt="${esc(title)}" style="background:transparent">
    ${canShare ? `<button type="button" class="btn k full" id="ishare" style="--k:var(--ink);--t:var(--sheet)">${SHARE_I}<span>${s.share}</span></button>` : ""}
    <a class="btn full" id="idl" href="${IMG_URL}" download="${esc(name)}">${DL_I}<span>${s.dl}</span></a>`;
  if (canShare) $("#ishare").onclick = async () => { try { await navigator.share({ files: [file], text: text || "" }); } catch(e) {} };
}

/* ---------- الشعار والشريط الملوّن بالكانفس ---------- */
let HUB = null;
function hubImg(){ if (!HUB) HUB = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = LOGO; }); return HUB; }
async function markCanvas(size, dark){
  const c = document.createElement("canvas"); c.width = c.height = size; const g = c.getContext("2d"), k = size / 312;
  g.setTransform(k, 0, 0, k, size / 2, size / 2); g.lineWidth = 36; g.lineCap = g.lineJoin = "round";
  ARMS.forEach(([pt, col]) => { g.strokeStyle = MARKC[col]; g.beginPath(); pt.split(" ").forEach((q, i) => { const [a, b] = q.split(",").map(Number); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.stroke(); });
  g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(0, 0, 56, 0, 7); g.fill(); g.globalCompositeOperation = "source-over";
  const im = await hubImg();
  if (im) { const h = document.createElement("canvas"); h.width = h.height = 208; const hg = h.getContext("2d"); hg.drawImage(im, 0, 0, 208, 208);
    hg.globalCompositeOperation = "source-in"; hg.fillStyle = dark ? "#ffffff" : "#0E1512"; hg.fillRect(0, 0, 208, 208); g.drawImage(h, -52, -52, 104, 104); }
  return c;
}
function fourBar(g, x, y, w, h){ ["#E4000F", "#0090D0", "#FDE01B", "#F08000"].forEach((c, i) => { g.fillStyle = c; g.fillRect(x + w - (i + 1) * w / 4, y, w / 4 + 1, h); }); }
async function brandFooter(g, x, y, w, h){
  if (!h) return;
  g.fillStyle = "#FBFCFB"; g.fillRect(x, y, w, h); fourBar(g, x, y, w, Math.max(3, h * .06));
  const m = await markCanvas(Math.round(h * .62), false), pad = h * .3;
  g.drawImage(m, x + w - pad - m.width, y + (h - m.height) / 2 + h * .03);
  g.fillStyle = "#0E1512"; g.textBaseline = "middle";
  g.font = `800 ${h * .3}px "AR BS","AR Plex",sans-serif`; g.direction = "ltr"; g.textAlign = "right"; g.fillText("AHMED REKLAM", x + w - pad * 1.5 - m.width, y + h * .42);
  g.font = `700 ${h * .17}px "AR Plex",sans-serif`; g.direction = "rtl"; g.fillStyle = "#56625C"; g.fillText(`${sx().madeOn} Ahmed Reklam`, x + w - pad * 1.5 - m.width, y + h * .74);
  g.font = `800 ${h * .34}px "AR BS","AR Plex",sans-serif`; g.direction = "ltr"; g.textAlign = "left"; g.fillStyle = "#0E1512"; g.fillText(SHOP.phoneShow, x + pad, y + h * .53);
}

/* ---------- صورة الأسعار ---------- */
// السعر: الرقم كبير والعملة (د.ع) صغيرة جنبه. draw=false للقياس فقط
function priceDraw(g, str, x, y, size, draw = true){
  const m = String(str).match(/^(.*\d)\s+(\D+)$/);
  g.direction = "ltr"; g.textAlign = "left"; g.font = `800 ${size}px "AR BS","AR Plex",sans-serif`;
  const n = m ? m[1] : String(str), w1 = g.measureText(n).width; if (draw) g.fillText(n, x, y);
  if (!m) return w1;
  const gap = size * .12; g.font = `700 ${Math.round(size * .42)}px "AR Plex",sans-serif`; g.direction = "rtl";
  if (draw) g.fillText(m[2], x + w1 + gap, y);
  return w1 + gap + g.measureText(m[2]).width;
}
function priceOf(it){
  const x = t(), s = sx();
  if (it.off) return { p: x.na, f: "", na: true };
  if (it.price == null) return { p: x.askP, f: "", na: true };
  if (it.colors && ownColors(it)) { const ps = it.colors.map((z, i) => cp(it, i)), mn = Math.min(...ps); return { p: money(mn), f: ps.some(v => v !== mn) ? s.from : "" }; }
  return { p: money(it.price), f: "" };
}
async function priceImage(){
  const x = t(), s = sx();
  toast(x.imgWait);
  try { await Promise.all(["400 30px 'AR Plex'", "700 30px 'AR Plex'", "800 30px 'AR Bei'", "800 30px 'AR BS'"].map(f => document.fonts.load(f, "ابت ێۆڤ AR $0.13 د.ع"))); } catch(e) {}
  // عمودين متوازنين، والصورة تطول إذا زادت المواد
  const cols = [[], []], cnt = [0, 0];
  CATS.forEach((c, i) => { const j = cnt[0] <= cnt[1] ? 0 : 1; cols[j].push(i); cnt[j] += c.items.length + 1.4; });
  const top = 492, pad = 36, gapC = 24, HD = 74, GAPS = 20, W = 1080;
  const need = j => cols[j].reduce((a, i) => a + CATS[i].items.length, 0), maxR = Math.max(need(0), need(1)), maxC = Math.max(cols[0].length, cols[1].length);
  const rowH = Math.max(58, Math.min(92, (1920 - 250 - top - maxC * (HD + GAPS + 10)) / maxR));
  const colH = j => cols[j].reduce((a, i) => a + HD + CATS[i].items.length * rowH + 10 + GAPS, 0);
  const H = Math.max(1920, Math.ceil(top + Math.max(colH(0), colH(1)) + 250)), colW = (W - pad * 2 - gapC) / 2;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const g = cv.getContext("2d");
  const INK = "#0E1512", MUT = "#56625C", SHEET = "#FBFCFB", LINE = "#D3D9D5";
  g.fillStyle = "#E6EAE7"; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(14,21,18,.06)"; g.lineWidth = 2;
  for (let v = 0; v <= W; v += 40) { g.beginPath(); g.moveTo(v, 0); g.lineTo(v, H); g.stroke(); }
  for (let v = 0; v <= H; v += 40) { g.beginPath(); g.moveTo(0, v); g.lineTo(W, v); g.stroke(); }
  fourBar(g, 0, 0, W, 14);
  const mk = await markCanvas(170, false); g.drawImage(mk, (W - 170) / 2, 52);
  g.textBaseline = "alphabetic"; g.textAlign = "center";
  g.direction = "ltr"; g.fillStyle = INK; g.font = `900 100px "AR BS",sans-serif`; g.fillText("AHMED REKLAM", W / 2, 318);
  g.direction = "rtl"; g.fillStyle = MUT; g.font = `800 38px "AR Bei","AR Plex",sans-serif`; g.fillText(x.tag, W / 2, 370);
  const [yy, mo, d] = (SHOP.updated || "").split("-"), pill = d ? `${x.priceList} · ${d}/${mo}/${yy}` : x.priceList;
  g.font = `700 32px "AR Plex",sans-serif`; const pw = g.measureText(pill).width + 64;
  g.fillStyle = INK; rrect(g, (W - pw) / 2, 398, pw, 62, 31); g.fill(); g.fillStyle = SHEET; g.fillText(pill, W / 2, 441);
  cols.forEach((list, j) => {
    let y = top; const x1 = W - pad - j * (colW + gapC), x0 = x1 - colW;
    list.forEach(ci => { const c = CATS[ci], k = c.color, kc = MARKC[k], hgt = HD + c.items.length * rowH + 10;
      g.save(); g.shadowColor = "rgba(0,0,0,.08)"; g.shadowBlur = 12; g.shadowOffsetY = 4; g.fillStyle = SHEET; rrect(g, x0, y, colW, hgt, 22); g.fill(); g.restore();
      g.strokeStyle = LINE; g.lineWidth = 2; rrect(g, x0, y, colW, hgt, 22); g.stroke();
      g.save(); rrect(g, x0, y, colW, hgt, 22); g.clip(); g.fillStyle = rgba(hex2rgb(kc), .1); g.fillRect(x0, y, colW, HD); g.fillStyle = LINE; g.fillRect(x0, y + HD, colW, 2); g.restore();
      g.fillStyle = k === "blue" ? "#0079B0" : kc; rrect(g, x1 - 22 - 46, y + 14, 46, 46, 10); g.fill();
      g.save(); g.translate(x1 - 22 - 46 + 4, y + 18); g.scale(38 / 24, 38 / 24); g.strokeStyle = c.text; g.lineWidth = 4.5; g.lineCap = g.lineJoin = "round";
      g.beginPath(); CH[k].split(" ").forEach((q, i) => { const [a, b] = q.split(",").map(Number); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.stroke(); g.restore();
      g.direction = "rtl"; g.textAlign = "right"; g.fillStyle = INK; g.font = `800 36px "AR Bei","AR Plex",sans-serif`; g.fillText(nm(c.name), x1 - 22 - 46 - 16, y + 50);
      let ry = y + HD;
      c.items.forEach((it, ii) => { const pr = priceOf(it), cy = ry + rowH / 2;
        if (ii) { g.fillStyle = LINE; g.fillRect(x0 + 18, ry, colW - 36, 1.5); }
        let used;
        if (pr.na) { g.fillStyle = MUT; g.font = `700 24px "AR Plex",sans-serif`; g.direction = "rtl"; g.textAlign = "left"; g.fillText(pr.p, x0 + 20, cy + 9); used = g.measureText(pr.p).width; }
        else { let ps = Math.round(rowH * .52); while (priceDraw(g, pr.p, 0, 0, ps, false) > colW * .44 && ps > 26) ps--;
          g.fillStyle = INK; used = priceDraw(g, pr.p, x0 + 20, cy + rowH * .18, ps);
          if (pr.f) { g.fillStyle = MUT; g.font = `700 22px "AR Plex",sans-serif`; g.direction = "rtl"; g.textAlign = "left"; g.fillText(pr.f, x0 + 30 + used, cy + rowH * .14); used += 14 + g.measureText(pr.f).width; } }
        g.direction = "rtl"; g.textAlign = "right"; g.fillStyle = it.off ? MUT : INK;
        let fs = Math.round(Math.min(32, rowH * .42)); g.font = `700 ${fs}px "AR Plex",sans-serif`;
        const maxW = Math.max(140, colW - 44 - used - 24); while (g.measureText(nm(it.name)).width > maxW && fs > 18) { fs--; g.font = `700 ${fs}px "AR Plex",sans-serif`; }
        g.fillText(nm(it.name), x1 - 22, cy + (rowH > 70 ? -2 : 4));
        if (rowH > 70) { g.fillStyle = MUT; g.font = `400 21px "AR Plex",sans-serif`; g.fillText(nm(it.unit), x1 - 22, cy + 28); }
        ry += rowH; });
      y += hgt + GAPS; });
  });
  // الفوتر
  g.direction = "rtl"; g.textAlign = "center"; g.fillStyle = MUT; g.font = `400 30px "AR Plex",sans-serif`; g.fillText(x.foot, W / 2, H - 196);
  g.direction = "ltr"; g.fillStyle = INK; g.font = `800 92px "AR BS",sans-serif`; g.fillText(SHOP.phoneShow, W / 2, H - 104);
  const nt = CUR === "iqd" ? x.noteIqd : x.note; let nfs = 24; g.direction = "rtl"; g.fillStyle = MUT; g.font = `400 ${nfs}px "AR Plex",sans-serif`;
  while (g.measureText(nt).width > W - 80 && nfs > 16) { nfs--; g.font = `400 ${nfs}px "AR Plex",sans-serif`; }
  g.fillText(nt, W / 2, H - 50);
  fourBar(g, 0, H - 14, W, 14);
  const blob = await new Promise(res => cv.toBlob(res, "image/png"));
  showImage(blob, `ahmed-reklam-${SHOP.updated || "prices"}.png`, x.priceImg, `${x.priceList} — Ahmed Reklam\n${location.origin}${location.pathname}`);
}

