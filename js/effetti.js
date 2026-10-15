// Suoni sintetizzati con Web Audio (nessun file esterno) ed effetti grafici del campo

const Suoni = (() => {
  let ctx = null;
  let attivo = true;
  try { attivo = localStorage.getItem('rigori-audio') !== 'off'; } catch (e) {}

  function audio() {
    if (!attivo) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tono(freq, durata, tipo = 'sine', volume = 0.2, ritardo = 0, freqFinale = null) {
    const a = audio();
    if (!a) return;
    const t0 = a.currentTime + ritardo;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqFinale) osc.frequency.exponentialRampToValueAtTime(freqFinale, t0 + durata);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + durata);
    osc.connect(gain).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + durata + 0.05);
  }

  function rumore(durata, volume = 0.3, frequenza = 1000, ritardo = 0, attacco = 0.005, filtro = 'lowpass') {
    const a = audio();
    if (!a) return;
    const t0 = a.currentTime + ritardo;
    const campioni = Math.floor(a.sampleRate * durata);
    const buffer = a.createBuffer(1, campioni, a.sampleRate);
    const dati = buffer.getChannelData(0);
    for (let i = 0; i < campioni; i++) dati[i] = Math.random() * 2 - 1;
    const sorgente = a.createBufferSource();
    sorgente.buffer = buffer;
    const f = a.createBiquadFilter();
    f.type = filtro;
    f.frequency.value = frequenza;
    const gain = a.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + attacco);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + durata);
    sorgente.connect(f).connect(gain).connect(a.destination);
    sorgente.start(t0);
    sorgente.stop(t0 + durata);
  }

  return {
    get attivo() { return attivo; },
    alterna() {
      attivo = !attivo;
      try { localStorage.setItem('rigori-audio', attivo ? 'on' : 'off'); } catch (e) {}
      return attivo;
    },
    fischio() { tono(2600, 0.15, 'sine', 0.1); tono(2600, 0.3, 'sine', 0.1, 0.2); },
    calcio() { rumore(0.1, 0.5, 400); tono(130, 0.12, 'sine', 0.35, 0, 60); },
    rete() { rumore(0.4, 0.25, 3000, 0, 0.02, 'bandpass'); },
    boato() { rumore(1.8, 0.3, 900, 0.05, 0.35); },
    delusione() { rumore(0.9, 0.18, 500, 0, 0.1); tono(320, 0.6, 'sawtooth', 0.03, 0.1, 160); },
    vento() { rumore(1.2, 0.35, 500, 0, 0.25, 'bandpass'); rumore(0.9, 0.2, 1500, 0.2, 0.2, 'bandpass'); },
    palo() { tono(880, 0.6, 'triangle', 0.22); tono(1320, 0.4, 'triangle', 0.1); },
    parata() { rumore(0.15, 0.4, 700); tono(90, 0.15, 'sine', 0.3); },
    saltoMortale() { tono(200, 0.25, 'sawtooth', 0.08, 0, 260); tono(260, 0.9, 'sawtooth', 0.08, 0.25, 520); },
    moneta() { tono(1800, 0.08, 'square', 0.05); tono(2400, 0.3, 'triangle', 0.07, 0.08); },
  };
})();

// Coriandoli che cadono sul campo quando si segna
function coriandoli(contenitore) {
  const colori = ['#ffeb3b', '#ff5252', '#4caf50', '#40c4ff', '#e040fb', '#fff'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('span');
    c.className = 'coriandolo';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colori[i % colori.length];
    c.style.animationDelay = Math.random() * 0.4 + 's';
    c.style.animationDuration = 1.2 + Math.random() * 0.8 + 's';
    contenitore.appendChild(c);
    setTimeout(() => c.remove(), 2600);
  }
}
