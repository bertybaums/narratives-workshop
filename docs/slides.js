/* Narratives workshop deck: NARC grids, guess pads, model tables, tallies, timers.
   Edit WORKSHOP below to change the invite code or links in one place. */
(function () {
  'use strict';

  var WORKSHOP = window.WORKSHOP || {};

  /* --- Fill [data-config] text from WORKSHOP (invite code, dates, URLs) --- */
  document.querySelectorAll('[data-config]').forEach(function (el) {
    var v = WORKSHOP[el.dataset.config];
    if (v == null) return;
    if (el.tagName === 'A') {
      el.href = v;
      if (!el.dataset.keepText) el.textContent = v.replace(/^https?:\/\//, '').replace(/\/$/, '');
    } else {
      el.textContent = v;
    }
  });

  /* --- NARC grids: <div class="narc-grid" data-grid="[[0,1],[1,0]]"> --- */
  var PALETTE = window.NARC_PALETTE || {};
  var NAMES = window.NARC_COLOR_NAMES || {};

  function describe(rows) {
    // Short text equivalent: "5 by 5. red at row 2 col 2; ..." (non-black cells only)
    var out = [];
    rows.forEach(function (row, r) {
      row.forEach(function (v, c) {
        if (v) out.push((NAMES[v] || 'color ' + v) + ' at row ' + (r + 1) + ' column ' + (c + 1));
      });
    });
    return rows.length + ' by ' + rows[0].length + ' grid. ' + (out.length ? out.join('; ') : 'all black');
  }

  document.querySelectorAll('.narc-grid[data-grid]').forEach(function (el) {
    var rows = JSON.parse(el.dataset.grid);
    el.style.gridTemplateColumns = 'repeat(' + rows[0].length + ', var(--cell))';
    rows.forEach(function (row) {
      row.forEach(function (v) {
        var cell = document.createElement('span');
        cell.className = 'narc-cell';
        cell.style.background = PALETTE[v] || '#000000';
        el.appendChild(cell);
      });
    });
    el.setAttribute('role', 'img');
    var label = el.getAttribute('aria-label');
    el.setAttribute('aria-label', (label ? label + '. ' : '') + describe(rows));
  });

  /* --- Guess pads: paint the hidden grid, then check it ---
     <div class="guess-pad" id="hunt-pad" data-rows="5" data-cols="5" data-answer="[[...]]"></div>
     <div class="guess-tools" data-pad="hunt-pad" data-palette="0,2,3,4" data-copy='[[...]]'></div> */
  document.querySelectorAll('.guess-pad').forEach(function (pad) {
    var rows = Number(pad.dataset.rows), cols = Number(pad.dataset.cols);
    var answer = JSON.parse(pad.dataset.answer);
    var tools = document.querySelector('.guess-tools[data-pad="' + pad.id + '"]');
    var palette = (tools.dataset.palette || '0').split(',').map(Number);
    var current = palette[1] != null ? palette[1] : palette[0];
    var state = [];
    var cells = [];

    pad.style.gridTemplateColumns = 'repeat(' + cols + ', var(--cell))';
    pad.setAttribute('role', 'group');
    pad.setAttribute('aria-label', 'Your guess for the hidden grid, ' + rows + ' by ' + cols);

    function paint(r, c, v) {
      state[r][c] = v;
      cells[r][c].style.background = PALETTE[v];
      cells[r][c].setAttribute('aria-label', 'Row ' + (r + 1) + ' column ' + (c + 1) + ', ' + (NAMES[v] || v));
    }

    for (var r = 0; r < rows; r++) {
      state.push([]);
      cells.push([]);
      for (var c = 0; c < cols; c++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'guess-cell';
        (function (r, c) {
          b.addEventListener('click', function () {
            pad.classList.add('touched');
            paint(r, c, state[r][c] === current ? 0 : current);
            result.textContent = '';
            result.className = 'guess-result';
          });
        })(r, c);
        pad.appendChild(b);
        cells[r].push(b);
        state[r].push(0);
      }
    }
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) paint(r, c, 0);

    var q = document.createElement('span');
    q.className = 'guess-q';
    q.setAttribute('aria-hidden', 'true');
    q.textContent = '?';
    pad.appendChild(q);

    // Palette swatches
    palette.forEach(function (v) {
      var s = document.createElement('button');
      s.type = 'button';
      s.className = 'swatch';
      s.style.background = PALETTE[v];
      s.title = 'Paint ' + (NAMES[v] || v);
      s.setAttribute('aria-label', 'Paint ' + (NAMES[v] || v));
      s.setAttribute('aria-pressed', String(v === current));
      s.addEventListener('click', function () {
        current = v;
        tools.querySelectorAll('.swatch').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        s.setAttribute('aria-pressed', 'true');
      });
      tools.appendChild(s);
    });

    function btn(text, fn) {
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'tool-btn';
      x.textContent = text;
      x.addEventListener('click', fn);
      tools.appendChild(x);
      return x;
    }

    if (tools.dataset.copy) {
      var copyFrom = JSON.parse(tools.dataset.copy);
      btn(tools.dataset.copyLabel || 'Start from the last grid', function () {
        pad.classList.add('touched');
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) paint(r, c, copyFrom[r][c]);
        result.textContent = '';
        result.className = 'guess-result';
      });
    }
    btn('Clear', function () {
      pad.classList.remove('touched');
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) paint(r, c, 0);
      result.textContent = '';
      result.className = 'guess-result';
    });
    btn('Check', function () {
      var off = 0;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if (state[r][c] !== answer[r][c]) off++;
      result.textContent = off === 0 ? 'Exactly right' : off + (off === 1 ? ' cell' : ' cells') + ' off';
      result.className = 'guess-result ' + (off === 0 ? 'ok' : 'off');
    });

    var result = document.createElement('p');
    result.className = 'guess-result';
    result.setAttribute('aria-live', 'polite');
    tools.appendChild(result);
  });

  /* --- Model results tables: <div class="results" data-puzzle="hunt"></div> --- */
  var RESULTS = window.NARC_RESULTS || {};
  var MODELS = window.NARC_MODELS || {};

  function mark(v) {
    if (v === 1) return '<span class="yes">&#10003;<span class="sr-only"> solved</span></span>';
    if (v === 0) return '<span class="no">&times;<span class="sr-only"> not solved</span></span>';
    return '<span class="na">not run</span>';
  }

  function ofThree(v) {
    if (v == null) return '<span class="na" aria-hidden="true">&ndash;</span><span class="sr-only">not run</span>';
    if (v === 'untested') return '<span class="na">not tested</span>';
    return String(v);
  }

  document.querySelectorAll('.results[data-puzzle]').forEach(function (box) {
    var data = RESULTS[box.dataset.puzzle];
    if (!data) return;
    var html = '<table class="results-table"><caption>' + data.caption + '</caption><thead><tr>' +
      '<th scope="col">Model</th><th scope="col">Grids only</th><th scope="col">Story only</th>' +
      '<th scope="col">Grids + story</th><th scope="col">Shuffled grids<br>(solved of 3)</th>' +
      '<th scope="col">Key words only<br>(solved of 3)</th></tr></thead><tbody>';
    data.rows.forEach(function (row) {
      var m = MODELS[row[0]] || {};
      var tags = '';
      if (row[0] === WORKSHOP.narrateModel) tags += '<span class="row-tag narrate">Narrate</span>';
      if (m.closed) tags += '<span class="row-tag closed">commercial</span>';
      if (m.withdrawn) tags += '<span class="row-tag gone">retired</span>';
      html += '<tr' + (row[0] === WORKSHOP.narrateModel ? ' class="flag-row"' : '') + '>' +
        '<th scope="row">' + row[0] + tags + '<span class="maker">' + (m.maker || '') + '</span></th>' +
        '<td>' + mark(row[1]) + '</td><td>' + mark(row[2]) + '</td><td>' + mark(row[3]) + '</td>' +
        '<td>' + ofThree(row[4]) + '</td><td>' + ofThree(row[5]) + '</td></tr>';
    });
    html += '</tbody></table>';
    box.innerHTML = html;
  });

  /* --- Flip cards --- */
  document.querySelectorAll('.flip-card').forEach(function (card) {
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', function () {
      var on = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(on));
    });
  });

  /* --- Toggle compare --- */
  document.querySelectorAll('.toggle-compare').forEach(function (comp) {
    comp.querySelectorAll('.toggle-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        comp.querySelectorAll('.toggle-btn').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        comp.querySelectorAll('.toggle-panel').forEach(function (p) { p.classList.remove('active'); });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        var t = comp.querySelector('.toggle-panel[data-panel="' + b.dataset.panel + '"]');
        if (t) t.classList.add('active');
      });
    });
  });

  /* --- Narrative cards: click to reveal whether the model solved it --- */
  document.querySelectorAll('.narr-grid').forEach(function (grid) {
    grid.querySelectorAll('.narr-card').forEach(function (card) {
      card.addEventListener('click', function () { card.classList.toggle('revealed'); });
    });
    var all = grid.parentElement.querySelector('.narr-reveal-all');
    if (all) {
      all.addEventListener('click', function () {
        var cards = grid.querySelectorAll('.narr-card');
        var anyHidden = Array.prototype.some.call(cards, function (c) { return !c.classList.contains('revealed'); });
        cards.forEach(function (c) { c.classList.toggle('revealed', anyHidden); });
        all.textContent = anyHidden ? 'Hide results' : 'Reveal all';
      });
    }
  });

  /* --- Room tally: click adds a hand, shift-click removes one --- */
  var TALLY_COLORS = ['#191919', '#f1b300', '#5b7fa6', '#8a8a8a', '#c8553d', '#2e7d4f', '#7a5c99', '#d9b26f', '#cfcfcf'];
  var TALLY_TEXT = ['#fff', '#191919', '#fff', '#fff', '#fff', '#fff', '#fff', '#191919', '#191919'];

  document.querySelectorAll('.tally').forEach(function (tally) {
    var buttons = tally.querySelectorAll('.tally-btn');
    var bar = tally.querySelector('.tally-bar');
    tally.querySelector('.tally-buttons').style.setProperty('--n', buttons.length);

    function render() {
      var total = 0;
      buttons.forEach(function (b) { total += Number(b.dataset.n || 0); });
      bar.innerHTML = '';
      buttons.forEach(function (b, i) {
        var n = Number(b.dataset.n || 0);
        b.querySelector('.tally-n').textContent = n;
        b.style.borderBottom = '5px solid ' + TALLY_COLORS[i % TALLY_COLORS.length];
        if (!n) return;
        var seg = document.createElement('span');
        seg.className = 'tally-seg';
        seg.style.flexGrow = n;
        seg.style.background = TALLY_COLORS[i % TALLY_COLORS.length];
        seg.style.color = TALLY_TEXT[i % TALLY_TEXT.length];
        seg.textContent = n;
        seg.title = b.dataset.label || '';
        bar.appendChild(seg);
      });
      bar.classList.toggle('empty', total === 0);
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function (e) {
        var n = Number(b.dataset.n || 0);
        b.dataset.n = e.shiftKey ? Math.max(0, n - 1) : n + 1;
        render();
      });
    });

    var reset = tally.querySelector('.tally-reset');
    if (reset) reset.addEventListener('click', function () { buttons.forEach(function (b) { b.dataset.n = 0; }); render(); });
    render();
  });

  /* --- Timers: <div class="timer" data-minutes="12"></div> --- */
  document.querySelectorAll('.timer[data-minutes]').forEach(function (t) {
    var total = Math.round(Number(t.dataset.minutes) * 60);
    var left = total, tick = null;
    t.innerHTML = '<p class="timer-digits" role="timer" aria-live="off"></p><div class="timer-controls"></div>';
    var digits = t.querySelector('.timer-digits');
    var controls = t.querySelector('.timer-controls');

    function show() {
      var m = Math.floor(left / 60), s = left % 60;
      digits.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      t.classList.toggle('low', left > 0 && left <= 60);
      t.classList.toggle('done', left === 0);
    }

    function control(text, fn) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tool-btn';
      b.textContent = text;
      b.addEventListener('click', fn);
      controls.appendChild(b);
      return b;
    }

    var startBtn = control('Start', function () {
      if (tick) { clearInterval(tick); tick = null; startBtn.textContent = 'Resume'; return; }
      if (left === 0) left = total;
      startBtn.textContent = 'Pause';
      tick = setInterval(function () {
        left = Math.max(0, left - 1);
        show();
        if (left === 0) { clearInterval(tick); tick = null; startBtn.textContent = 'Start'; }
      }, 1000);
    });
    control('+1 min', function () { left += 60; show(); });
    control('Reset', function () {
      if (tick) { clearInterval(tick); tick = null; }
      left = total;
      startBtn.textContent = 'Start';
      show();
    });
    show();
  });

  /* --- Sort cards: click to cycle through the three choices, then back to unsorted --- */
  var SORT_STATES = [
    { key: '', label: 'Click to sort' },
    { key: 'keep', label: 'Keep it human' },
    { key: 'friction', label: 'Use it, with friction' },
    { key: 'hand', label: 'Hand it off' }
  ];
  document.querySelectorAll('.sort-grid').forEach(function (grid) {
    var cards = grid.querySelectorAll('.sort-card');
    function set(card, i) {
      card.dataset.i = String(i);
      card.dataset.state = SORT_STATES[i].key;
      card.querySelector('.sort-state').textContent = SORT_STATES[i].label;
    }
    cards.forEach(function (card) {
      set(card, 0);
      card.addEventListener('click', function () {
        set(card, (Number(card.dataset.i) + 1) % SORT_STATES.length);
      });
    });
    var reset = grid.parentElement.querySelector('.sort-reset');
    if (reset) reset.addEventListener('click', function () {
      cards.forEach(function (card) { set(card, 0); });
    });
  });

  /* --- Capture board: typed notes kept in this browser only --- */
  document.querySelectorAll('.board[data-store]').forEach(function (board) {
    var key = 'narratives-workshop:' + board.dataset.store;
    var cells = board.querySelectorAll('td[contenteditable]');
    try {
      var saved = JSON.parse(localStorage.getItem(key) || '[]');
      cells.forEach(function (c, i) { if (saved[i]) c.textContent = saved[i]; });
    } catch (e) { /* storage unavailable: the board still works, it just won't persist */ }
    board.addEventListener('input', function () {
      try {
        localStorage.setItem(key, JSON.stringify(Array.prototype.map.call(cells, function (c) { return c.textContent; })));
      } catch (e) { /* ignore */ }
    });
    var clear = board.parentElement.querySelector('.board-clear');
    if (clear) clear.addEventListener('click', function () {
      cells.forEach(function (c) { c.textContent = ''; });
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    });
  });
})();
