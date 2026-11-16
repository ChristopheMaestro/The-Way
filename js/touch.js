'use strict';
/* ===================== TOUCH: on-screen controls for phones and tablets ===================== */
/* Feeds the same Input.down / Input.hit tables the keyboard uses, so every scene works unchanged.
   Shown only on touch devices (or with ?touch=1). Hold-and-slide on the pad to change direction. */
(function () {
  const q = new URLSearchParams(location.search);
  const isTouch = q.get('touch') === '1' || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) ||
    (window.matchMedia && matchMedia('(pointer:coarse)').matches);
  const want = isTouch && q.get('touch') !== '0';

  const css = document.createElement('style');
  css.textContent = `
    html,body{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;overscroll-behavior:none}
    #tc{position:fixed;left:0;right:0;bottom:0;height:0;z-index:10;pointer-events:none;
        padding-bottom:env(safe-area-inset-bottom);font-family:sans-serif}
    #tc *{box-sizing:border-box;touch-action:none}
    #tc .pad{position:fixed;left:max(14px,env(safe-area-inset-left));bottom:calc(18px + env(safe-area-inset-bottom));
        width:min(46vmin,210px);height:min(46vmin,210px);border-radius:50%;pointer-events:auto;opacity:.4;
        background:radial-gradient(circle,rgba(255,255,255,.05) 0 28%,rgba(255,255,255,.14) 29% 100%);
        border:2px solid rgba(255,255,255,.35)}
    #tc .pad i{position:absolute;width:34%;height:34%;display:flex;align-items:center;justify-content:center;
        color:rgba(255,255,255,.75);font-style:normal;font-size:min(7vmin,30px);transition:background .06s;border-radius:50%}
    #tc .pad i.on{background:rgba(255,255,255,.35)}
    #tc .pad .u{left:33%;top:2%}#tc .pad .d{left:33%;bottom:2%}#tc .pad .l{left:2%;top:33%}#tc .pad .r{right:2%;top:33%}
    #tc .btn{position:fixed;pointer-events:auto;border-radius:50%;display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:bold;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.4);
        transition:background .06s}
    #tc .btn.on{background:rgba(255,255,255,.45)}
    #tc .a{right:max(14px,env(safe-area-inset-right));bottom:calc(34px + env(safe-area-inset-bottom));
        width:min(20vmin,92px);height:min(20vmin,92px);font-size:min(8vmin,36px)}
    #tc .b{right:calc(max(14px,env(safe-area-inset-right)) + min(22vmin,100px));bottom:calc(14px + env(safe-area-inset-bottom));
        width:min(16vmin,74px);height:min(16vmin,74px);font-size:min(6.5vmin,28px)}
    #tc .m{right:calc(max(14px,env(safe-area-inset-right)) + min(4vmin,18px));bottom:calc(34px + min(24vmin,110px) + env(safe-area-inset-bottom));
        width:max(48px,min(13vmin,56px));height:max(48px,min(13vmin,56px));font-size:22px}
    #tc{opacity:.9}
    @media (min-aspect-ratio:3/2) and (max-height:520px){ #tc .pad{width:min(50vh,190px);height:min(50vh,190px)} }
  `;
  document.head.appendChild(css);

  const root = document.createElement('div'); root.id = 'tc';
  root.innerHTML =
    '<div class="pad"><i class="u">▲</i><i class="d">▼</i><i class="l">◀</i><i class="r">▶</i></div>' +
    '<div class="btn a" data-k="ok">Z</div><div class="btn b" data-k="cancel">X</div>' +
    '<div class="btn m" data-k="menu">☰</div>';
  document.body.appendChild(root);
  window.TouchUI = { get on() { return root.style.display !== 'none'; }, toggle() { root.style.display = this.on ? 'none' : ''; try { localStorage.setItem('theway_touch', this.on ? '1' : '0'); } catch (e) {} } };
  let saved = null; try { saved = localStorage.getItem('theway_touch'); } catch (e) {}
  if (saved === '1' || (saved !== '0' && want)) root.style.display = ''; else root.style.display = 'none';

  const press = (k, on) => {
    if (on) { if (!Input.down[k]) Input.hit[k] = true; Input.down[k] = true; } else Input.down[k] = false;
  };

  // action buttons (multi-touch safe: one pointer per button)
  root.querySelectorAll('.btn').forEach(b => {
    const k = b.dataset.k, ids = new Set();
    const set = () => { b.classList.toggle('on', ids.size > 0); press(k, ids.size > 0); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); ids.add(e.pointerId); Sound.unlock(); set(); });
    const up = e => { ids.delete(e.pointerId); set(); };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
  });

  // direction pad: angle of the finger from the pad centre picks up to two directions
  const pad = root.querySelector('.pad'), arrows = { up: pad.querySelector('.u'), down: pad.querySelector('.d'), left: pad.querySelector('.l'), right: pad.querySelector('.r') };
  let padId = null; const clampPx = (v, a, b) => Math.max(a, Math.min(b, v));
  const setDirs = d => { for (const k of ['up', 'down', 'left', 'right']) { press(k, !!d[k]); arrows[k].classList.toggle('on', !!d[k]); } };
  const aim = e => {
    const r = pad.getBoundingClientRect(), dx = e.clientX - (pad._cx ?? r.left + r.width / 2), dy = e.clientY - (pad._cy ?? r.top + r.height / 2);
    const dead = r.width * 0.12, d = {};
    if (Math.hypot(dx, dy) < dead) return setDirs(d);
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax > ay * 0.45) d[dx > 0 ? 'right' : 'left'] = true;
    if (ay > ax * 0.45) d[dy > 0 ? 'down' : 'up'] = true;
    setDirs(d);
  };
  // floating stick: touch anywhere on the left part of the screen, the pad appears under the thumb
  const zone = pad;
  zone.addEventListener('pointerdown', e => {
    if (padId !== null) return; e.preventDefault(); padId = e.pointerId; zone.setPointerCapture(e.pointerId); Sound.unlock();
    aim(e);
  });
  zone.addEventListener('pointermove', e => { if (e.pointerId === padId) aim(e); });
  const padUp = e => { if (e.pointerId === padId) { padId = null; setDirs({}); } };
  zone.addEventListener('pointerup', padUp); zone.addEventListener('pointercancel', padUp); zone.addEventListener('lostpointercapture', padUp);

  // no pinch / double-tap zoom, no context menu, no rubber-band scroll
  ['gesturestart', 'gesturechange'].forEach(t => document.addEventListener(t, e => e.preventDefault()));
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  addEventListener('blur', () => setDirs({}));
})();
