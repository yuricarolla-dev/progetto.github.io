const campo = document.getElementById('campo');
const porta = document.getElementById('porta');
const mira = document.getElementById('mira');
const mirino = document.getElementById('mirino');
const portiere = document.getElementById('portiere');
const palla = document.getElementById('palla');
const attaccante = document.getElementById('attaccante');
const scritta = document.getElementById('scritta');
const messaggio = document.getElementById('messaggio');
const velo = document.getElementById('velo');

let modalita = 'allenamento';
let scelti = [];       // rigoristi scelti (1 o 2)
let portieri = [];     // portieri scelti nel 1 contro 1
let tiri = [[], []];   // esiti dei tiri per giocatore: true = gol
let turno = 0;         // indice di chi tira
let fase = 'attesa';   // 'tiro' | 'parata' | 'attesa'
let tiroScelto = null;
let speciale = null;   // colpo speciale armato: 'cucchiaio' | 'rovesciata' | 'super' | null
let superUsati = [0, 0];
let paradinheUsate = [0, 0];
let precisioniUsate = [0, 0];
let golSicuriUsati = [0, 0];
let sicuroAttivo = [false, false]; // una volta attivato, Cristian Moretti tira i 2 gol sicuri di fila
let passatiUsati = [0, 0];
let peperonciniUsati = [0, 0];
let cpu = [false, false];       // nel torneo un lato della partita può essere del computer
let prefissi = ['G1', 'G2'];    // etichette dei due lati (G1, G2, 🤖...)
let inTorneo = false;
let torneo = null;
let partitaTorneo = null;
let umaniTorneo = 1;
let rosa = [];           // rigoristi scelti all'inizio (per la rivincita, dopo le sostituzioni)
let ultimiEsiti = [null, null]; // ultimo esito di ciascun rigorista (per testa dura e concentrazione)
let ultimiTiri = [null, null];  // ultimo punto mirato da ciascun rigorista (per il leggi-mente)
let vittoriaIstantanea = null;  // giocatore che vince subito grazie alla parata delUgo Pellegrini
let tuffoPrevisto = null; // tuffo già deciso dal portiere (paradinha)
let incrocioUsato = [false, false];
let tiratoriCPU = [];      // Fai il portiere: un rigorista del computer per ogni tiro
let meteoPartita = 'sereno';
let ventoAttuale = 0;      // px di spostamento laterale del tiro
let mirinoTouch = null;    // telefono: il primo tocco mira, il secondo tira
let ultimoPuntatore = 'mouse';
let record = { allenamento: 0, oltranza: 0, portiere: 0 };
try { record = { ...record, ...JSON.parse(localStorage.getItem('rigori-record') || '{}') }; } catch (e) {}

// ---------- Disegni ----------
function svgGiocatore(g, diSpalle) {
  const testa = diSpalle
    ? `<circle cx="28" cy="12" r="10" fill="${g.capelli}"/>`
    : `<circle cx="28" cy="12" r="10" fill="${g.pelle}"/>
       <path d="M18 11 a10 10 0 0 1 20 0 z" fill="${g.capelli}"/>
       <circle cx="24" cy="14" r="1.5" fill="#222"/><circle cx="32" cy="14" r="1.5" fill="#222"/>`;
  return `<svg viewBox="0 0 56 90" width="56" height="90">
    <g class="gamba gamba-sx"><rect x="17" y="58" width="9" height="26" rx="4" fill="${g.pelle}"/><rect x="16" y="80" width="11" height="8" rx="3" fill="#111"/></g>
    <g class="gamba gamba-dx"><rect x="30" y="58" width="9" height="26" rx="4" fill="${g.pelle}"/><rect x="29" y="80" width="11" height="8" rx="3" fill="#111"/></g>
    <rect x="15" y="50" width="26" height="14" rx="3" fill="#fff"/>
    <rect x="6" y="24" width="8" height="24" rx="4" fill="${g.colore}"/>
    <rect x="42" y="24" width="8" height="24" rx="4" fill="${g.colore}"/>
    <rect x="13" y="22" width="30" height="32" rx="7" fill="${g.colore}"/>
    <text x="28" y="44" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff" font-family="Arial">${g.numero}</text>
    ${testa}
  </svg>`;
}

function svgPortiere(g) {
  const pelle = g.pelle || '#e0ac69';
  const capelli = g.capelli || '#222';
  return `<svg viewBox="0 0 64 80" width="64" height="80">
    <rect x="22" y="52" width="8" height="24" rx="4" fill="${pelle}"/>
    <rect x="34" y="52" width="8" height="24" rx="4" fill="${pelle}"/>
    <rect x="21" y="72" width="10" height="7" rx="3" fill="#111"/>
    <rect x="33" y="72" width="10" height="7" rx="3" fill="#111"/>
    <rect x="20" y="46" width="24" height="12" rx="3" fill="#222"/>
    <line x1="22" y1="27" x2="7" y2="11" stroke="${g.colore}" stroke-width="7" stroke-linecap="round"/>
    <line x1="42" y1="27" x2="57" y2="11" stroke="${g.colore}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="6" cy="9" r="6" fill="#fff" stroke="#888"/>
    <circle cx="58" cy="9" r="6" fill="#fff" stroke="#888"/>
    <rect x="19" y="22" width="26" height="28" rx="6" fill="${g.colore}"/>
    <text x="32" y="42" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff" stroke="#333" stroke-width="0.6" font-family="Arial">${g.numero}</text>
    <circle cx="32" cy="13" r="9" fill="${pelle}"/>
    <path d="M23 12 a9 9 0 0 1 18 0 z" fill="${capelli}"/>
    <circle cx="28.5" cy="15" r="1.4" fill="#222"/><circle cx="35.5" cy="15" r="1.4" fill="#222"/>
  </svg>`;
}

function barra(nome, valore) {
  return `<div class="stat"><span>${nome}</span><div class="barra"><div style="width:${valore}%"></div></div><span>${valore}</span></div>`;
}

// ---------- Schermate ----------
function mostraSchermata(id) {
  ['schermata-menu', 'schermata-setup', 'schermata-torneo', 'schermata-roster', 'schermata-gioco'].forEach(s => {
    document.getElementById(s).hidden = s !== id;
  });
}

const sceltaMeteo = document.getElementById('scelta-meteo');
const sceltaStadio = document.getElementById('scelta-stadio');
sceltaMeteo.innerHTML = Object.entries(METEO).map(([k, m]) => `<option value="${k}">${m.icona} ${m.nome}</option>`).join('')
  + '<option value="casuale">🎲 Casuale</option>';
sceltaStadio.innerHTML = Object.entries(STADI).map(([k, m]) => `<option value="${k}">${m.icona} ${m.nome}</option>`).join('');
try {
  sceltaMeteo.value = localStorage.getItem('rigori-meteo') || 'sereno';
  sceltaStadio.value = localStorage.getItem('rigori-stadio') || 'classico';
} catch (e) {}
if (!sceltaMeteo.value) sceltaMeteo.value = 'sereno';
if (!sceltaStadio.value) sceltaStadio.value = 'classico';
sceltaMeteo.onchange = () => { try { localStorage.setItem('rigori-meteo', sceltaMeteo.value); } catch (e) {} };
sceltaStadio.onchange = () => { try { localStorage.setItem('rigori-stadio', sceltaStadio.value); } catch (e) {} };

function applicaAmbiente() {
  const chiavi = Object.keys(METEO);
  meteoPartita = sceltaMeteo.value === 'casuale' ? chiavi[Math.floor(Math.random() * chiavi.length)] : sceltaMeteo.value;
  [...campo.classList].filter(c => c.startsWith('stadio-') || c.startsWith('meteo-')).forEach(c => campo.classList.remove(c));
  campo.classList.add('stadio-' + sceltaStadio.value, 'meteo-' + meteoPartita);
}

const bottoneAudio = document.getElementById('audio');
bottoneAudio.textContent = Suoni.attivo ? '🔊' : '🔇';
bottoneAudio.onclick = () => { bottoneAudio.textContent = Suoni.alterna() ? '🔊' : '🔇'; };

Object.entries(MODALITA).forEach(([chiave, m]) => {
  const carta = document.createElement('button');
  carta.className = 'carta';
  carta.innerHTML = `<div class="icona">${m.icona}</div><h3>${m.nome}</h3><p>${m.testo}</p>`;
  carta.onclick = () => {
    modalita = chiave;
    scelti = [];
    portieri = [];
    cpu = [false, false];
    prefissi = ['G1', 'G2'];
    inTorneo = false;
    if (chiave === 'torneo') apriSetupTorneo();
    else apriRoster();
  };
  document.getElementById('modalita').appendChild(carta);
});

function cartaRigorista(g) {
  return `${svgGiocatore(g, false)}
    <h3>${g.nome}</h3>
    <div class="ruolo">#${g.numero} · ${g.ruolo}</div>
    ${barra('Precisione', g.precisione)}
    ${barra('Potenza', g.potenza)}
    ${g.precisione > 90 ? '<div class="ruolo">🎯 Cecchino: sbaglia pochissimo</div>' : ''}
    ${g.potenza > 90 ? '<div class="ruolo">💥 30% di tiro imparabile</div>' : ''}
    ${g.abilita ? `<div class="ruolo">${ABILITA[g.abilita]}</div>` : ''}
    ${g.abilita2 ? `<div class="ruolo">${ABILITA[g.abilita2]}</div>` : ''}
    ${g.abilita3 ? `<div class="ruolo">${ABILITA[g.abilita3]}</div>` : ''}`;
}

function cartaPortiere(p) {
  return `${svgPortiere(p)}
    <h3>${p.nome}</h3>
    <div class="ruolo">#${p.numero} · ${p.ruolo}</div>
    ${barra('Riflessi', p.riflessi)}
    ${barra('Presa', p.presa)}
    ${p.paraImparabili ? `<div class="ruolo">🦸 Para il ${p.paraImparabili * 100}% dei tiri imparabili</div>` : ''}
    ${p.abilita ? `<div class="ruolo">${ABILITA[p.abilita]}</div>` : ''}
    ${p.abilita2 ? `<div class="ruolo">${ABILITA[p.abilita2]}</div>` : ''}
    ${p.abilita3 ? `<div class="ruolo">${ABILITA[p.abilita3]}</div>` : ''}
    ${p.nascosta ? '<div class="ruolo">❓ Abilità nascosta: ???</div>' : ''}`;
}

// Nel 1 contro 1 ogni giocatore sceglie prima il rigorista e poi il portiere
function apriRoster() {
  // Nel 1 contro 1 e nel torneo ogni giocatore sceglie rigorista e portiere
  const conPortiere = modalita === 'sfida' || modalita === 'torneo';
  const totale = modalita === 'sfida' ? 2 : modalita === 'torneo' ? umaniTorneo : 1;
  const soloPortiere = modalita === 'portiere';
  const sceltaPortiere = soloPortiere || (conPortiere && portieri.length < scelti.length);
  const lista = sceltaPortiere ? PORTIERI : GIOCATORI;
  const numero = scelti.length + (sceltaPortiere ? 0 : 1);
  const chi = modalita === 'torneo' ? `Giocatore ${numero} di ${totale}` : `Giocatore ${numero}`;

  document.getElementById('titolo-roster').textContent = soloPortiere ? 'Scegli il tuo portiere 🧤' : !conPortiere
    ? 'Scegli il tuo rigorista'
    : sceltaPortiere
      ? `${chi}, scegli il tuo portiere 🧤`
      : `${chi}, scegli il tuo rigorista ⚽`;
  document.getElementById('nota-roster').textContent = sceltaPortiere
    ? 'Riflessi: arriva più lontano col tuffo. Presa: trattiene più palloni quando ci arriva.'
    : 'Precisione: meno tiri fuori quando miri vicino a pali e traversa. Potenza: tiri più difficili da parare.';

  const roster = document.getElementById('roster');
  roster.innerHTML = '';
  lista.forEach(g => {
    const carta = document.createElement('button');
    carta.className = 'carta';
    carta.innerHTML = sceltaPortiere ? cartaPortiere(g) : cartaRigorista(g);
    carta.onclick = () => {
      (sceltaPortiere ? portieri : scelti).push(g);
      const completo = soloPortiere ? portieri.length === 1 : !conPortiere || portieri.length === totale;
      if (!completo) apriRoster();
      else if (soloPortiere) avviaFaiIlPortiere();
      else if (modalita === 'torneo') creaTorneo();
      else {
        rosa = [...scelti];
        iniziaPartita();
      }
    };
    roster.appendChild(carta);
  });
  mostraSchermata('schermata-roster');
}

function avviaFaiIlPortiere() {
  portieri = [IL_MURO, portieri[0]];
  cpu = [true, false];
  prefissi = ['🤖', 'Tu ·'];
  rosa = [GIOCATORI[0]];
  iniziaPartita();
}

function nomeG(i) {
  return modalita === 'sfida' ? `${prefissi[i]} ${scelti[i].nome}` : scelti[i].nome;
}

function nomePortiere(i) {
  return `${prefissi[i]} ${portieri[i].nome}`;
}

function contesto() {
  const { width, height } = rettangolo(mira);
  const ultimo = ultimiEsiti[turno];
  return {
    width,
    height,
    // Ad oltranza il portiere del computer allunga la sua portata a ogni gol
    bonusPortata: modalita === 'oltranza' ? tiri[0].filter(Boolean).length * 4 : 0,
    decisivo: tiri[turno].length >= RIGORI_REGOLAMENTARI - 1,
    dopoErrore: ultimo !== null && !ESITI_GOL.includes(ultimo),
    dopoParata: ESITI_PARATA.includes(ultimo),
    primoTiro: tiri[turno].length === 0,
    tiroPrecedente: ultimiTiri[turno],
    tiriSubiti: tiri[turno].length,
    serieGol: serieFinale(tiri[turno]),
    incrocioDisponibile: !incrocioUsato[turno],
    haSbagliato: tiri[turno].includes(false),
    // Capitano: il portiere della squadra di chi tira ha appena parato
    bonusCapitano: modalita === 'sfida' && haAbilita(portieri[turno], 'capitano') && ESITI_PARATA.includes(ultimiEsiti[1 - turno]),
    meteo: meteoPartita,
  };
}

function handaGuarda() {
  return portiereSpettatore(portiereInCampo(), tiri[turno].length);
}

// Portieri che in questo tiro non scelgono il tuffo
function portiereNonSceglie() {
  return eSedia() || handaGuarda();
}

function tuffoAutomatico() {
  if (eSedia()) return tuffoSediaInPorta();
  const { width, height } = rettangolo(mira);
  return { x: width / 2, y: height * 0.75 };
}

function eSedia() {
  return portiereInCampo().abilita === 'sedia';
}

function sediaACaso() {
  return eSedia() && sediaSiButta(tiri[turno].length);
}

function tuffoSediaInPorta() {
  const { width, height } = rettangolo(mira);
  return tuffoSedia(width, height, sediaACaso());
}

function svgSedia() {
  return `<svg viewBox="0 0 64 80" width="64" height="80">
    <rect x="13" y="50" width="5" height="28" rx="2" fill="#5c3a1a"/>
    <rect x="46" y="50" width="5" height="28" rx="2" fill="#5c3a1a"/>
    <rect x="20" y="50" width="4" height="22" rx="2" fill="#6f4520"/>
    <rect x="40" y="50" width="4" height="22" rx="2" fill="#6f4520"/>
    <rect x="16" y="4" width="32" height="40" rx="4" fill="#8b5a2b" stroke="#5c3a1a" stroke-width="2"/>
    <rect x="21" y="10" width="22" height="4" rx="2" fill="#a0522d"/>
    <rect x="21" y="18" width="22" height="4" rx="2" fill="#a0522d"/>
    <circle cx="26" cy="30" r="2.2" fill="#222"/><circle cx="38" cy="30" r="2.2" fill="#222"/>
    <path d="M27 37 q5 3 10 0" stroke="#222" fill="none" stroke-width="1.5"/>
    <rect x="9" y="43" width="46" height="8" rx="2" fill="#a0522d" stroke="#5c3a1a" stroke-width="2"/>
    <g class="manina manina-sx">
      <line x1="17" y1="26" x2="5" y2="18" stroke="#5c3a1a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="4" cy="16" r="4" fill="#f1c27d" stroke="#c68642"/>
    </g>
    <g class="manina manina-dx">
      <line x1="47" y1="26" x2="59" y2="18" stroke="#5c3a1a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="16" r="4" fill="#f1c27d" stroke="#c68642"/>
    </g>
  </svg>`;
}

function portiereInCampo() {
  if (modalita === 'sfida') return portieri[1 - turno];
  if (modalita === 'portiere') return portieri[1];
  return IL_MURO;
}

// ---------- Partita ----------
function iniziaPartita() {
  tiri = [[], []];
  superUsati = [0, 0];
  paradinheUsate = [0, 0];
  precisioniUsate = [0, 0];
  golSicuriUsati = [0, 0];
  sicuroAttivo = [false, false];
  passatiUsati = [0, 0];
  peperonciniUsati = [0, 0];
  scelti = [...rosa];
  ultimiEsiti = [null, null];
  ultimiTiri = [null, null];
  vittoriaIstantanea = null;
  incrocioUsato = [false, false];
  if (modalita === 'portiere') {
    tiratoriCPU = mescola(GIOCATORI).slice(0, TIRI_FAI_IL_PORTIERE);
    scelti = [tiratoriCPU[0]];
  }
  applicaAmbiente();
  turno = 0;
  document.getElementById('finale').hidden = true;
  mostraSchermata('schermata-gioco');
  if (modalita === 'sfida') testaOCroce();
  else nuovoTurno();
}

// Testa o croce: G1 sceglie, chi vince tira per primo
function testaOCroce() {
  attaccante.innerHTML = svgGiocatore(scelti[0], true);
  portiere.innerHTML = svgPortiere(portieri[1]);
  reset();
  aggiornaInfo();
  fase = 'attesa';
  aggiornaBottoni();
  messaggio.textContent = '';
  const sorteggio = document.getElementById('sorteggio');
  const moneta = document.getElementById('moneta');
  const via = document.getElementById('sorteggio-via');
  const scelte = document.getElementById('sorteggio-scelte');
  const sceglie = cpu[0] ? 1 : 0;
  document.getElementById('sorteggio-testo').textContent = `${nomeG(sceglie)}, scegli: testa o croce?`;
  moneta.textContent = '🪙';
  moneta.classList.remove('lancia');
  scelte.hidden = false;
  via.hidden = true;
  sorteggio.hidden = false;

  scelte.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      scelte.hidden = true;
      const scelta = b.dataset.faccia;
      const uscita = Math.random() < 0.5 ? 'testa' : 'croce';
      document.getElementById('sorteggio-testo').textContent = `${nomeG(sceglie)} sceglie ${scelta}...`;
      Suoni.moneta();
      void moneta.offsetWidth;
      moneta.classList.add('lancia');
      setTimeout(() => {
        turno = scelta === uscita ? sceglie : 1 - sceglie;
        moneta.textContent = uscita === 'testa' ? 'T' : 'C';
        document.getElementById('sorteggio-testo').textContent =
          `Esce ${uscita.toUpperCase()}! Tira per primo ${nomeG(turno)}`;
        via.hidden = false;
      }, 1300);
    };
  });
  via.onclick = () => {
    sorteggio.hidden = true;
    nuovoTurno();
  };
}

function nuovoTurno() {
  let cambio = '';
  if (modalita === 'portiere') {
    // Ogni rigore lo tira un rigorista diverso del computer
    scelti[0] = tiratoriCPU[tiri[0].length];
    sicuroAttivo[0] = false;
    golSicuriUsati[0] = 0;
  }
  if (scelti[turno].abilita === 'golSicuro' && golSicuriUsati[turno] >= GOL_SICURI_PER_PARTITA) {
    cambio = `🔄 Cambio: esce ${scelti[turno].nome}, entra ${SOSTITUTO.nome}`;
    scelti[turno] = SOSTITUTO;
  }
  const tiratore = scelti[turno];
  attaccante.innerHTML = svgGiocatore(tiratore, true);
  portiere.innerHTML = eSedia() ? svgSedia() : svgPortiere(portiereInCampo());
  reset();
  if (sicuroInCorso()) speciale = 'sicuro';
  if (eSedia() && !sediaACaso()) portiere.classList.remove('attesa');
  if (haAbilita(portiereInCampo(), 'balletto')) portiere.classList.add('balla');
  const vento = document.getElementById('vento');
  ventoAttuale = meteoPartita === 'vento' ? Math.round((Math.random() - 0.5) * 50) : 0;
  vento.hidden = meteoPartita !== 'vento';
  vento.textContent = `💨 ${ventoAttuale < 0 ? '⬅️' : '➡️'} ${Math.abs(ventoAttuale)}`;
  aggiornaInfo();
  const avvisi = () => {
    if (eSedia()) messaggio.textContent += sediaACaso() ? ' · 🎲 Ugo Pellegrini si butta a caso!' : ' · 🪑 La sedia non si muove: para solo se la colpisci';
    if (handaGuarda()) messaggio.textContent += ` · 👀 ${portiereInCampo().nome} questo lo guarda e basta`;
    if (sicuroInCorso()) messaggio.textContent += ` · 🐐 Gol sicuro ${golSicuriUsati[turno] + 1}/${GOL_SICURI_PER_PARTITA}: questo entra di sicuro`;
    if (haAbilita(tiratore, 'inFiamme') && serieFinale(tiri[turno]) >= 2) messaggio.textContent += ' · 🔥 In fiamme!';
    if (haAbilita(tiratore, 'paura') && tiri[turno].includes(false)) messaggio.textContent += ' · 😰 Ha paura: tira debole';
    if (cambio) messaggio.textContent = cambio + ' · ' + messaggio.textContent;
  };
  // Studio del portiere: dopo una parata subita, vede in anticipo il tuffo
  const studio = () => {
    if (haAbilita(tiratore, 'studioPortiere') && ESITI_PARATA.includes(ultimiEsiti[turno])) rivelaTuffo('🧠 Studio del portiere');
  };

  if ((modalita === 'sfida' && cpu[turno]) || modalita === 'portiere') {
    // Tira il computer: ha già mirato, il giocatore sceglie solo il tuffo
    fase = 'attesa';
    const tiro = tiroCPU();
    if (portiereNonSceglie()) {
      messaggio.textContent = `🤖 Tira ${nomeG(turno)}`;
      avvisi();
      setTimeout(() => esegui(tiro, tuffoAutomatico()), 700);
    } else {
      tiroScelto = tiro;
      fase = 'parata';
      messaggio.textContent = `🤖 ${nomeG(turno)} ha mirato. ${nomePortiere(1 - turno)}: dove ti tuffi?`;
      avvisiPortiere(tiro);
      avvisi();
    }
  } else if (modalita === 'sfida' && cpu[1 - turno]) {
    // Contro il portiere del computer non serve nascondere la mira
    fase = 'tiro';
    messaggio.textContent = `${nomeG(turno)}: clicca dove vuoi tirare`;
    avvisi();
    studio();
  } else if (modalita === 'sfida') {
    fase = 'attesa';
    mostraVelo(`⚽ Tira ${nomeG(turno)}`, `${prefissi[1 - turno]}, non guardare!`, () => {
      fase = 'tiro';
      messaggio.textContent = `${nomeG(turno)}: clicca dove vuoi tirare`;
      avvisi();
      aggiornaBottoni();
      studio();
    });
  } else {
    fase = 'tiro';
    messaggio.textContent = 'Clicca un punto della porta per tirare!';
    avvisi();
    studio();
  }
  aggiornaBottoni();
}

function mostraVelo(titolo, testo, poi) {
  document.getElementById('velo-titolo').textContent = titolo;
  document.getElementById('velo-testo').textContent = testo;
  velo.hidden = false;
  document.getElementById('velo-pronto').onclick = () => {
    velo.hidden = true;
    poi();
  };
}

function sicuroInCorso() {
  return sicuroAttivo[turno] && golSicuriUsati[turno] < GOL_SICURI_PER_PARTITA;
}

function aggiornaBottoni() {
  const abilita = scelti[turno] && scelti[turno].abilita;
  const cucchiaio = document.getElementById('btn-cucchiaio');
  const rovesciata = document.getElementById('btn-rovesciata');
  cucchiaio.hidden = fase !== 'tiro';
  cucchiaio.textContent = haAbilita(scelti[turno], 'cucchiaioLibero') ? '🥄 Cucchiaio direzionabile' : '🥄 Tira il cucchiaio';
  cucchiaio.classList.toggle('armato', speciale === 'cucchiaio');
  rovesciata.hidden = fase !== 'tiro' || abilita !== 'rovesciata';
  rovesciata.classList.toggle('armato', speciale === 'rovesciata');
  const superBtn = document.getElementById('btn-super');
  const cariche = scelti[turno] ? superDisponibili(turno) : 0;
  superBtn.hidden = fase !== 'tiro' || cariche < 1;
  superBtn.textContent = abilita === 'rovesciata'
    ? `⚡🤸 Super rovesciata (x${cariche})`
    : `⚡ Tiro potente e preciso (x${cariche})`;
  const paradinha = document.getElementById('btn-paradinha');
  const paradinheRimaste = PARADINHE_PER_PARTITA - paradinheUsate[turno];
  paradinha.hidden = fase !== 'tiro' || abilita !== 'paradinha' || paradinheRimaste < 1 || tuffoPrevisto !== null;
  paradinha.textContent = `👀 Paradinha (x${paradinheRimaste})`;
  const precisione = document.getElementById('btn-precisione');
  const precisioniRimaste = TIRI_PRECISIONE_PER_PARTITA - precisioniUsate[turno];
  precisione.hidden = fase !== 'tiro' || abilita !== 'precisione' || precisioniRimaste < 1;
  precisione.textContent = `🎯 Tiro di precisione (x${precisioniRimaste})`;
  precisione.classList.toggle('armato', speciale === 'precisione');
  const sicuro = document.getElementById('btn-sicuro');
  const sicuriRimasti = GOL_SICURI_PER_PARTITA - golSicuriUsati[turno];
  sicuro.hidden = fase !== 'tiro' || abilita !== 'golSicuro' || sicuriRimasti < 1;
  sicuro.textContent = sicuroInCorso()
    ? `🐐 Gol sicuro attivo (${golSicuriUsati[turno] + 1}/${GOL_SICURI_PER_PARTITA})`
    : `🐐 Gol sicuro (x${sicuriRimasti})`;
  sicuro.disabled = sicuroInCorso();
  sicuro.classList.toggle('armato', speciale === 'sicuro');
  const passato = document.getElementById('btn-passato');
  const passatiRimasti = RIGORI_PASSATI_PER_PARTITA - passatiUsati[turno];
  passato.hidden = fase !== 'tiro' || !haAbilita(scelti[turno], 'rigorePassato') || passatiRimasti < 1;
  passato.textContent = `🤝 Rigore passato (x${passatiRimasti})`;
  const peperoncino = document.getElementById('btn-peperoncino');
  const peperonciniRimasti = PEPERONCINI_PER_PARTITA - peperonciniUsati[turno];
  peperoncino.hidden = fase !== 'tiro' || !haAbilita(scelti[turno], 'peperoncino') || peperonciniRimasti < 1;
  peperoncino.textContent = `🌶️ Peperoncino calabrese (x${peperonciniRimasti})`;
  peperoncino.classList.toggle('armato', speciale === 'peperoncino');
  superBtn.classList.toggle('armato', speciale === 'super');
  // Gol sicuro in corso: niente altri colpi speciali finché non ha tirato entrambi i rigori
  if (sicuroInCorso() && fase === 'tiro') {
    [cucchiaio, rovesciata, superBtn, paradinha, precisione, passato, peperoncino].forEach(b => { b.hidden = true; });
  }
  document.getElementById('btn-centro').hidden = fase !== 'parata' && fase !== 'parataPrima';
}

// Arma (o disarma) un colpo speciale: il tiro parte al prossimo clic sulla porta
function armaSpeciale(tipo) {
  speciale = speciale === tipo ? null : tipo;
  messaggio.textContent = speciale === 'cucchiaio' ? '🥄 Clicca dove vuoi mettere il cucchiaio'
    : speciale === 'rovesciata' ? '🤸 Clicca dove vuoi tirare in rovesciata'
    : speciale === 'super' ? '⚡ Clicca dove vuoi scagliare il super tiro'
    : speciale === 'precisione' ? '🎯 Clicca il punto esatto: non andrà fuori'
    : speciale === 'sicuro' ? '🐐 Clicca dove vuoi segnare: questo entra di sicuro'
    : speciale === 'peperoncino' ? '🌶️ Clicca dove vuoi scagliare il pallone infuocato'
    : 'Clicca un punto della porta per tirare!';
  aggiornaBottoni();
}

function superDisponibili(i) {
  return Math.floor(tiri[i].filter(Boolean).length / golPerSuper(scelti[i])) - superUsati[i];
}

function aggiornaInfo() {
  const info = document.getElementById('info');
  const pallini = (lista, minimo) => {
    let s = '';
    for (let i = 0; i < Math.max(minimo, lista.length); i++) {
      s += lista[i] === undefined ? '⚪' : lista[i] ? '✅' : '❌';
    }
    return s;
  };
  const golDi = i => tiri[i].filter(Boolean).length;

  if (modalita === 'sfida') {
    const lunghezza = Math.max(RIGORI_REGOLAMENTARI, tiri[0].length, tiri[1].length);
    const righe = [0, 1].map(i => `
      <div class="riga-g ${i === turno ? 'attivo' : ''}">
        <span class="nome-g" style="border-color:${scelti[i].colore}">${nomeG(i)} · 🧤 ${portieri[i].nome}</span>
        <span class="pallini">${pallini(tiri[i], lunghezza)}</span>
        <b>${golDi(i)}</b>${superDisponibili(i) > 0 ? ` ⚡${superDisponibili(i)}` : ''}
      </div>`).join('');
    const aOltranza = tiri[0].length >= RIGORI_REGOLAMENTARI && tiri[1].length >= RIGORI_REGOLAMENTARI && vincitore() === null;
    info.innerHTML = righe + (aOltranza ? '<div class="oltranza">🔥 Rigori ad oltranza!</div>' : '');
  } else if (modalita === 'allenamento') {
    info.innerHTML = `${nomeG(0)} · Gol: ${golDi(0)} su ${tiri[0].length} · 🏆 Record: ${record.allenamento}${superDisponibili(0) > 0 ? ` · ⚡${superDisponibili(0)}` : ''}
      <div class="pallini">${pallini(tiri[0], RIGORI_REGOLAMENTARI)}</div>`;
  } else if (modalita === 'portiere') {
    const parate = tiri[0].filter(x => !x).length;
    info.innerHTML = `🧤 ${portieri[1].nome} · Parate: ${parate} su ${tiri[0].length} · 🏆 Record: ${record.portiere}
      <div class="pallini">${pallini(tiri[0].map(x => !x), TIRI_FAI_IL_PORTIERE)}</div>
      <div class="nota">Tira: 🤖 ${scelti[0].nome}</div>`;
  } else {
    info.innerHTML = `${nomeG(0)} · Serie: ${golDi(0)} · 🏆 Record: ${record.oltranza}${superDisponibili(0) > 0 ? ` · ⚡${superDisponibili(0)}` : ''}
      <div class="pallini">${'⚽'.repeat(Math.min(golDi(0), 15))}${golDi(0) > 15 ? '…' : ''}</div>`;
  }
}

// Restituisce 0 o 1 se c'è un vincitore nel 1 contro 1, altrimenti null
function vincitore() {
  return vincitoreDi(tiri, vittoriaIstantanea);
}


// ---------- Mira ----------
function rettangolo(el) {
  const c = campo.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    left: r.left - c.left, right: r.right - c.left,
    top: r.top - c.top, bottom: r.bottom - c.top,
    width: r.width, height: r.height,
  };
}

function puntoMira(e) {
  const r = mira.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function inCampo(p) {
  const m = rettangolo(mira);
  return { x: m.left + p.x, y: m.top + p.y };
}


mira.addEventListener('mousemove', e => {
  if (!['tiro', 'parata', 'parataPrima'].includes(fase)) return;
  mostraMirino(puntoMira(e));
});

function mostraMirino(p) {
  mirino.hidden = false;
  mirino.style.left = p.x + 'px';
  mirino.style.top = p.y + 'px';
  if (fase === 'parata' || fase === 'parataPrima') {
    mirino.className = 'guanto';
    mirino.textContent = '🧤';
  } else {
    const r = rischioBordo(p, rettangolo(mira).width);
    mirino.className = '';
    mirino.textContent = { cucchiaio: '🥄', rovesciata: '🤸', super: '⚡', precisione: '🎯', sicuro: '🐐', peperoncino: '🌶️' }[speciale] || '';
    mirino.style.borderColor = mirino.style.color = r === 0 ? '#4caf50' : r < 0.5 ? '#ffeb3b' : '#ff5252';
  }
}
mira.addEventListener('mouseleave', () => { if (ultimoPuntatore !== 'touch') mirino.hidden = true; });
mira.addEventListener('pointerdown', e => { ultimoPuntatore = e.pointerType; });

mira.addEventListener('click', e => {
  const p = puntoMira(e);
  if (!['tiro', 'parata', 'parataPrima'].includes(fase)) return;
  // Sul telefono non c'è il passaggio del mouse: primo tocco mostra il mirino, secondo tocco conferma
  if (ultimoPuntatore === 'touch') {
    const vicino = mirinoTouch && Math.hypot(p.x - mirinoTouch.x, p.y - mirinoTouch.y) < 30;
    if (!vicino) {
      mirinoTouch = p;
      mostraMirino(p);
      messaggio.textContent = '👆 Tocca di nuovo lo stesso punto per confermare';
      return;
    }
    mirinoTouch = null;
  }
  if (fase === 'tiro') {
    // Andrea Martini tira il super tiro in rovesciata
    const rovesciata = speciale === 'rovesciata' || (speciale === 'super' && scelti[turno].abilita === 'rovesciata');
    tiroDeciso({ ...p, cucchiaio: speciale === 'cucchiaio', rovesciata, super: speciale === 'super', mirato: speciale === 'precisione', sicuro: speciale === 'sicuro', piccante: speciale === 'peperoncino' });
  }
  else if (fase === 'parata' || fase === 'parataPrima') tuffoDeciso(p);
});

document.getElementById('btn-cucchiaio').onclick = () => {
  // Lorenzo Gatti e Federico Lombardi scelgono dove metterlo, gli altri lo tirano sempre centrale
  if (haAbilita(scelti[turno], 'cucchiaioLibero')) return armaSpeciale('cucchiaio');
  const { width, height } = rettangolo(mira);
  tiroDeciso({ x: width / 2, y: height * 0.35, cucchiaio: true });
};
document.getElementById('btn-rovesciata').onclick = () => armaSpeciale('rovesciata');
document.getElementById('btn-super').onclick = () => armaSpeciale('super');
document.getElementById('btn-precisione').onclick = () => armaSpeciale('precisione');
// Una volta attivato non si può annullare: vale per i 2 rigori successivi, poi entra il sostituto
document.getElementById('btn-sicuro').onclick = () => {
  if (sicuroAttivo[turno]) return;
  sicuroAttivo[turno] = true;
  speciale = 'sicuro';
  messaggio.textContent = `🐐 Gol sicuro attivato: i prossimi ${GOL_SICURI_PER_PARTITA} rigori entrano di sicuro! Clicca dove tirare`;
  aggiornaBottoni();
};
// Non serve mirare: dove tira il compagno lo decide il tuffo del portiere
document.getElementById('btn-peperoncino').onclick = () => armaSpeciale('peperoncino');
document.getElementById('btn-passato').onclick = () => {
  const { width, height } = rettangolo(mira);
  tiroDeciso({ x: width / 2, y: height / 2, passato: true });
};

// Paradinha: il portiere si tuffa per primo e chi tira vede dove
document.getElementById('btn-paradinha').onclick = () => {
  if (fase !== 'tiro') return;
  paradinheUsate[turno]++;
  rivelaTuffo('👀 Paradinha');
};

// Il portiere sceglie il tuffo per primo e chi tira lo vede (paradinha, studio del portiere)
function rivelaTuffo(motivo) {
  if (modalita === 'sfida' && portiereNonSceglie()) {
    mostraFantasma(tuffoAutomatico(), motivo);
  } else if (modalita === 'sfida' && cpu[1 - turno]) {
    mostraFantasma(tuffoCPUInPorta(null), motivo);
  } else if (modalita === 'sfida') {
    fase = 'attesa';
    aggiornaBottoni();
    mostraVelo(`🧤 Para ${nomePortiere(1 - turno)}`, `${motivo} di ${nomeG(turno)}: ${prefissi[turno]}, non guardare!`, () => {
      fase = 'parataPrima';
      messaggio.textContent = `${nomePortiere(1 - turno)}: tuffati per primo!`;
      aggiornaBottoni();
    });
  } else {
    mostraFantasma(tuffoCPUInPorta(null), motivo);
  }
}

function mostraFantasma(p, motivo = '👀') {
  tuffoPrevisto = p;
  const fantasma = document.getElementById('fantasma');
  fantasma.textContent = '🧤';
  fantasma.style.left = p.x + 'px';
  fantasma.style.top = p.y + 'px';
  fantasma.hidden = false;
  fase = 'tiro';
  messaggio.textContent = `${motivo}: il portiere si butta lì, tira dall'altra parte!`;
  aggiornaBottoni();
}
document.getElementById('btn-centro').onclick = () => {
  const { width, height } = rettangolo(mira);
  tuffoDeciso({ x: width / 2, y: height * 0.75 });
};

// Il portiere del computer usa intuito e studio del rigorista se li ha
function tuffoCPUInPorta(tiro) {
  const { width, height } = rettangolo(mira);
  return tuffoIntelligente(width, height, portiereInCampo(), tiro, ultimiTiri[turno]);
}

function tiroDeciso(tiro) {
  if (fase !== 'tiro') return;
  fase = 'attesa';
  mirino.hidden = true;
  aggiornaBottoni();
  if (modalita === 'sfida' && tuffoPrevisto) {
    esegui(tiro, tuffoPrevisto);
  } else if (modalita === 'sfida' && portiereNonSceglie()) {
    esegui(tiro, tuffoAutomatico());
  } else if (modalita === 'sfida' && cpu[1 - turno]) {
    esegui(tiro, tuffoCPUInPorta(tiro));
  } else if (modalita === 'sfida') {
    tiroScelto = tiro;
    mostraVelo(`🧤 Para ${nomePortiere(1 - turno)}`, `${prefissi[turno]}, non guardare!`, () => {
      fase = 'parata';
      messaggio.textContent = `${nomePortiere(1 - turno)}: clicca dove vuoi tuffarti`;
      avvisiPortiere(tiro);
      aggiornaBottoni();
    });
  } else {
    esegui(tiro, tuffoPrevisto || tuffoCPUInPorta(tiro));
  }
}

// Suggerimenti per il portiere umano: intuito e studio del rigorista
function avvisiPortiere(tiro) {
  const numero1 = portiereInCampo();
  if (numero1.abilita === 'intuito' && Math.random() < PROB_INTUITO) {
    const { width } = rettangolo(mira);
    const lato = tiro.x < width / 3 ? 'a sinistra' : tiro.x > width * 2 / 3 ? 'a destra' : 'centrale';
    messaggio.textContent += ` · 🕷️ Intuito: tirerà ${lato}!`;
  }
  const precedente = ultimiTiri[turno];
  if (haAbilita(numero1, 'studiaRigorista') && precedente) {
    const fantasma = document.getElementById('fantasma');
    fantasma.textContent = '📒';
    fantasma.style.left = precedente.x + 'px';
    fantasma.style.top = precedente.y + 'px';
    fantasma.hidden = false;
    messaggio.textContent += ' · 📒 Qui aveva tirato l\'ultima volta';
  }
}

// Il computer mira a caso e usa le abilità quando può
function tiroCPU() {
  const g = scelti[turno];
  const { width, height } = rettangolo(mira);
  const tiro = { x: width * (0.08 + Math.random() * 0.84), y: height * (0.12 + Math.random() * 0.83) };
  if (g.abilita === 'golSicuro' && golSicuriUsati[turno] < GOL_SICURI_PER_PARTITA) {
    sicuroAttivo[turno] = true;
    tiro.sicuro = true;
  } else if (superDisponibili(turno) > 0) {
    tiro.super = true;
    if (g.abilita === 'rovesciata') tiro.rovesciata = true;
  } else if (g.abilita === 'precisione' && precisioniUsate[turno] < TIRI_PRECISIONE_PER_PARTITA) {
    tiro.mirato = true;
  } else if (haAbilita(g, 'peperoncino') && peperonciniUsati[turno] < PEPERONCINI_PER_PARTITA && Math.random() < 0.5) {
    tiro.piccante = true;
  } else if (haAbilita(g, 'rigorePassato') && passatiUsati[turno] < RIGORI_PASSATI_PER_PARTITA && Math.random() < 0.3) {
    tiro.passato = true;
  }
  return tiro;
}

function tuffoDeciso(p) {
  if (fase === 'parataPrima') {
    // Paradinha nel 1 contro 1: ora chi tira vede il tuffo
    fase = 'attesa';
    mirino.hidden = true;
    aggiornaBottoni();
    mostraVelo(`⚽ Tira ${nomeG(turno)}`, `${prefissi[1 - turno]}, non guardare!`, () => mostraFantasma(p, '👀 Tuffo scelto'));
    return;
  }
  if (fase !== 'parata') return;
  fase = 'attesa';
  mirino.hidden = true;
  aggiornaBottoni();
  esegui(tiroScelto, p);
}


// ---------- Esito ----------

// ---------- Animazioni ----------
function muoviPalla(x, y, scala) {
  palla.style.left = x + 'px';
  palla.style.top = y + 'px';
  palla.style.transform = `translate(-50%, -50%) scale(${scala})`;
}

function tuffoPortiere(p) {
  portiere.classList.remove('attesa', 'balla');
  const { width, height } = rettangolo(mira);
  const c = inCampo(p);
  const lato = (p.x - width / 2) / (width / 2); // -1 sinistra, +1 destra
  const altezza = p.y / height;                 // 0 traversa, 1 terra
  let top = c.y - 40;
  let angolo = 0;
  let extra = '';
  if (Math.abs(lato) < 0.22) {
    if (altezza > 0.65) { top = 104; extra = ' scaleY(0.85)'; }
    else top = Math.min(c.y - 25, 100);
  } else {
    angolo = Math.sign(lato) * (45 + 40 * altezza);
  }
  portiere.style.left = c.x + 'px';
  portiere.style.top = top + 'px';
  portiere.style.transform = `translateX(-50%) rotate(${angolo}deg)${extra}`;
}

function esegui(tiro, tuffo) {
  // Peperoncino: prima lo mangia (fumo dalle orecchie), poi tira
  if (tiro.piccante && !tiro.mangiato) {
    porta.classList.add('bloccata');
    attaccante.classList.add('mangia');
    messaggio.textContent = `🌶️ ${scelti[turno].nome} mangia un peperoncino calabrese...`;
    Suoni.palo();
    setTimeout(() => esegui({ ...tiro, mangiato: true }, tuffo), 1100);
    return;
  }
  porta.classList.add('bloccata');
  messaggio.textContent = '';
  mirinoTouch = null;
  Suoni.fischio();
  const tiratore = scelti[turno];
  // Il vento sposta il tiro di lato (non il gol sicuro né il rigore passato)
  if (meteoPartita === 'vento' && !tiro.sicuro && !tiro.passato) tiro = { ...tiro, x: tiro.x + ventoAttuale };
  tiro = effettoMeteo(tiro, meteoPartita, rettangolo(mira).height);
  const ctx = contesto();
  const esito = calcolaEsito(tiro, tuffo, tiratore, portiereInCampo(), ctx);
  if (haAbilita(tiratore, 'incrocio') && ctx.incrocioDisponibile && zonaIncrocio(tiro, ctx.width)) incrocioUsato[turno] = true;
  if (tiro.passato) {
    // Il compagno tira dalla parte opposta al tuffo, oppure addosso al portiere rimasto al centro
    const { width, height } = rettangolo(mira);
    const bersaglio = esito === 'parato'
      ? { x: tuffo.x, y: tuffo.y }
      : { x: tuffo.x < width / 2 ? width * 0.8 : width * 0.2, y: height * 0.7 };
    tiro = { ...tiro, ...bersaglio };
    passatiUsati[turno]++;
  }
  ultimiEsiti[turno] = esito;
  ultimiTiri[turno] = { x: tiro.x, y: tiro.y };
  const sedia = portiereInCampo().abilita === 'sedia';
  if (sedia && esito === 'parato' && (modalita === 'sfida' || modalita === 'portiere')) vittoriaIstantanea = 1 - turno;
  const normale = !tiro.cucchiaio && !tiro.super && !tiro.mirato && !tiro.rovesciata;
  let durata = tiro.cucchiaio ? 1100 : tiro.super ? 300 : tiro.mirato ? 650 : 500;
  if (normale && meteoPartita === 'pioggia') durata = 380;
  if (normale && meteoPartita === 'neve') durata = 650;
  if (tiro.basso) durata = 900;
  if (tiro.portatoVia) durata = 950;
  palla.classList.toggle('rotola', Boolean(tiro.basso));
  palla.classList.toggle('lenta', tiro.cucchiaio);
  if (tiro.super) superUsati[turno]++;
  if (tiro.piccante) peperonciniUsati[turno]++;
  if (tiro.mirato) precisioniUsate[turno]++;
  if (tiro.sicuro) golSicuriUsati[turno]++;

  // Rincorsa
  attaccante.classList.add('corre');
  attaccante.style.left = 'calc(50% - 38px)';
  attaccante.style.top = '262px';

  // Rigore passato: tocco di lato, il compagno arriva di corsa e tira
  const compagno = document.getElementById('compagno');
  if (tiro.passato) {
    compagno.innerHTML = svgGiocatore({ ...tiratore, numero: 9, capelli: '#2b1d0e' }, true);
    compagno.hidden = false;
    setTimeout(() => {
      attaccante.classList.remove('corre');
      attaccante.classList.add('calcia');
      palla.classList.add('gira');
      muoviPalla(campo.clientWidth / 2 + 55, 335, 1);
      compagno.classList.add('corre');
      compagno.style.left = 'calc(50% + 40px)';
      compagno.style.top = '252px';
    }, 550);
  }

  // Rovesciata: si alza la palla con un tocco, poi salta all'indietro e calcia al culmine
  if (tiro.rovesciata) {
    setTimeout(() => {
      attaccante.classList.remove('corre');
      attaccante.classList.add('calcia');
      palla.classList.add('gira', 'palleggio');
      muoviPalla(campo.clientWidth / 2, 215, 1.25);
    }, 550);
    setTimeout(() => {
      attaccante.classList.remove('calcia');
      attaccante.classList.add('rovescia');
    }, 1000);
  }

  setTimeout(() => {
    Suoni.calcio();
    attaccante.classList.remove('corre');
    if (tiro.passato) {
      compagno.classList.remove('corre');
      compagno.classList.add('calcia');
    } else if (!tiro.rovesciata) {
      attaccante.classList.add('calcia');
    }
    palla.classList.remove('palleggio');
    palla.classList.add('gira');
    palla.classList.toggle('super', tiro.super);
    palla.classList.toggle('effetto', tiratore.abilita === 'effetto' && !tiro.cucchiaio && !tiro.super);
    palla.classList.toggle('giro', Boolean(tiro.mirato));
    palla.classList.toggle('fuoco', haAbilita(tiratore, 'inFiamme') && ctx.serieGol >= 2);
    palla.classList.toggle('infuocato', Boolean(tiro.piccante));
    palla.classList.toggle('foglia', normale && haAbilita(tiratore, 'fogliaMorta') && tiro.y < ctx.height / 3);
    document.getElementById('fantasma').hidden = true;
    // Nel miracolo il portiere vola dove va la palla, qualunque tuffo avesse scelto
    if (esito === 'guardato') {
      // Luka Horvat resta fermo e segue il pallone con lo sguardo
      portiere.classList.remove('attesa');
      portiere.style.setProperty('--verso', tiro.x < rettangolo(mira).width / 2 ? -1 : 1);
      portiere.classList.add('guarda');
    } else if (esito === 'laser') {
      tuffoPortiere(tiro);
      portiere.classList.add('laser');
    } else if (!eSedia() || sediaACaso()) {
      tuffoPortiere(esito === 'miracolo' ? tiro : tuffo);
    }

    const b = inCampo(tiro);
    const g = rettangolo(mira);
    const sinistra = tiro.x < g.width / 2;
    let testo;

    switch (esito) {
      case 'passato':
        muoviPalla(b.x, b.y, 0.65);
        testo = '🤝 GOL! Rigore passato!';
        break;
      case 'sicuro':
        muoviPalla(b.x, b.y, 0.65);
        testo = '🐐 GOL SICURO!';
        break;
      case 'guardato':
        muoviPalla(b.x, b.y, 0.65);
        testo = `👀 ${portiereInCampo().nome} lo guarda entrare...`;
        break;
      case 'laser': {
        muoviPalla(b.x, b.y, 0.65);
        const verso = sinistra ? -1 : 1;
        setTimeout(() => muoviPalla(b.x + verso * 70, b.y + 110, 0.85), durata - 50);
        testo = '🧱 SARACINESCA!';
        break;
      }
      case 'super':
        muoviPalla(b.x, b.y, 0.65);
        testo = tiro.rovesciata ? '⚡🤸 SUPER ROVESCIATA!' : '⚡ SUPER TIRO! Imparabile!';
        break;
      case 'paloGol': {
        const xPalo = sinistra ? g.left + 3 : g.right - 3;
        muoviPalla(xPalo, b.y, 0.6);
        setTimeout(() => muoviPalla(xPalo + (sinistra ? 35 : -35), b.y + 8, 0.6), durata);
        testo = '🍀 Palo e gol!';
        break;
      }
      case 'traversaGol':
        muoviPalla(b.x, g.top + 3, 0.6);
        setTimeout(() => muoviPalla(b.x, g.top + 30, 0.6), durata);
        testo = '🍀 Traversa e gol!';
        break;
      case 'imparabile':
        muoviPalla(b.x, b.y, 0.65);
        testo = '💥 GOL! Imparabile!';
        break;
      case 'gol': {
        muoviPalla(b.x, b.y, 0.65);
        const distanza = Math.hypot(tiro.x - tuffo.x, tiro.y - tuffo.y);
        testo = tiro.piccante ? '🌶️🔥 PALLONE INFUOCATO!'
          : tiro.mirato ? '🎯 GOL! Precisione chirurgica!'
          : tiro.rovesciata ? '🤸 GOL IN ROVESCIATA!'
          : tiro.cucchiaio ? 'GOL! Che cucchiaio!'
          : distanza < 45 ? 'GOL! Che botta!' : 'GOOOL!';
        break;
      }
      case 'parato':
      case 'ribattuta':
      case 'miracolo': {
        muoviPalla(b.x, b.y, 0.65);
        const verso = sinistra ? -1 : 1;
        setTimeout(() => muoviPalla(b.x + verso * 70, b.y + 110, 0.85), durata - 50);
        testo = esito === 'miracolo' ? `🦸 MIRACOLO di ${portiereInCampo().nome}!`
          : esito === 'ribattuta' ? `🔄 Ribattuta di ${portiereInCampo().nome}!`
          : tiro.cucchiaio ? 'Parato! Cucchiaio letto!' : 'Parato!';
        break;
      }
      case 'traversa':
        muoviPalla(b.x, g.top - 3, 0.6);
        setTimeout(() => muoviPalla(b.x + (Math.random() - 0.5) * 120, g.top - 60, 0.5), durata);
        testo = 'Traversa!';
        break;
      case 'alta':
        muoviPalla(b.x, g.top - 30, 0.55);
        testo = 'Alta!';
        break;
      case 'palo': {
        const xPalo = sinistra ? g.left - 3 : g.right + 3;
        muoviPalla(xPalo, b.y, 0.6);
        setTimeout(() => muoviPalla(xPalo + (sinistra ? -50 : 50), b.y + 130, 0.8), durata);
        testo = 'Palo!';
        break;
      }
      case 'portatoVia': {
        // Raffica: il pallone parte verso la porta, poi il vento lo spazza fuori dal campo
        const verso = ventoAttuale < 0 ? -1 : ventoAttuale > 0 ? 1 : (Math.random() < 0.5 ? -1 : 1);
        const partenza = { x: campo.clientWidth / 2, y: 330 };
        muoviPalla((partenza.x + b.x) / 2, (partenza.y + b.y) / 2 + 40, 0.85);
        setTimeout(() => {
          campo.classList.add(verso < 0 ? 'raffica-sx' : 'raffica-dx');
          Suoni.vento();
          muoviPalla(verso < 0 ? -60 : campo.clientWidth + 60, b.y + 40, 0.5);
        }, 280);
        testo = '🌪️ RAFFICA! Il vento si porta via il pallone!';
        break;
      }
      case 'fuori':
        muoviPalla(sinistra ? g.left - 35 : g.right + 35, b.y, 0.55);
        testo = 'Fuori!';
        break;
    }

    const segnato = ESITI_GOL.includes(esito);
    if (tiro.super && esito === 'parato') testo = `🧤 ${portiereInCampo().nome} ferma il super tiro!`;
    if (tiro.mirato && esito === 'parato') testo = `🎯🧤 ${portiereInCampo().nome} legge il tiro!`;
    if (tiro.passato && esito === 'parato') testo = '🧤 Non ci è cascato!';
    if (tiro.piccante && ESITI_PARATA.includes(esito)) testo = '🧯 Spento! Parato il pallone infuocato!';
    if (tiro.basso) {
      testo = '❄️ ' + testo;
      messaggio.textContent = '❄️ La neve ha frenato il pallone: è rimasto basso';
    }
    if (vittoriaIstantanea !== null) testo = '🪑 LA SEDIA HA PARATO!';
    // I gol speciali si rivedono al rallentatore
    const golSpeciale = segnato && (tiro.super || tiro.sicuro || tiro.rovesciata || tiro.mirato || tiro.cucchiaio
      || tiro.passato || tiro.piccante || ['imparabile', 'paloGol', 'traversaGol'].includes(esito));
    const replayInfo = golSpeciale ? { x: b.x, y: b.y } : null;
    setTimeout(() => mostraEsito(segnato, testo, esito, replayInfo), durata + 50);
  }, tiro.rovesciata ? 1310 : tiro.passato ? 1020 : 550);
}

const ESULTANZE = { saltoMortale: 'esulta-saltoMortale', capriola: 'esulta-capriola', aereo: 'esulta-aereo', giro: 'esulta-giro' };

function mostraEsito(segnato, testo, esito, replayInfo) {
  tiri[turno].push(segnato);
  if (segnato) {
    porta.classList.add('trema');
    attaccante.classList.add(ESULTANZE[scelti[turno].esultanza] || 'esulta');
    document.getElementById('pubblico').classList.add('esulta');
    coriandoli(campo);
    Suoni.rete();
    Suoni.boato();
    if (scelti[turno].esultanza === 'saltoMortale') Suoni.saltoMortale();
  } else if (ESITI_PARATA.includes(esito)) {
    Suoni.parata();
    Suoni.delusione();
    if (eSedia()) portiere.classList.add('salta-sedia');
  } else if (esito === 'palo' || esito === 'traversa') {
    Suoni.palo();
  } else {
    Suoni.delusione();
  }
  scritta.textContent = testo;
  scritta.className = 'pop ' + (segnato ? 'verde' : 'rossa');
  aggiornaInfo();
  if (replayInfo) setTimeout(() => replay(replayInfo, prossimo), 1300);
  else setTimeout(prossimo, 1600);
}

// Rivede il tiro al rallentatore
function replay(info, poi) {
  campo.classList.add('replay');
  palla.classList.add('fermo');
  palla.classList.remove('lenta', 'giro', 'super', 'effetto', 'foglia', 'palleggio');
  palla.style.left = '';
  palla.style.top = '';
  palla.style.transform = '';
  void palla.offsetWidth;
  palla.classList.remove('fermo');
  palla.classList.add('rallentatore', 'gira');
  setTimeout(() => muoviPalla(info.x, info.y, 0.65), 50);
  setTimeout(() => {
    campo.classList.remove('replay');
    palla.classList.remove('rallentatore');
    poi();
  }, 2100);
}

function prossimo() {
  if (modalita === 'allenamento' && tiri[0].length >= RIGORI_REGOLAMENTARI) return fine();
  if (modalita === 'oltranza' && !tiri[0][tiri[0].length - 1]) return fine();
  if (modalita === 'portiere' && (tiri[0].length >= TIRI_FAI_IL_PORTIERE || vittoriaIstantanea !== null)) return fine();
  if (modalita === 'sfida') {
    if (vincitore() !== null) return fine();
    turno = 1 - turno;
  }
  nuovoTurno();
}

function reset() {
  const compagno = document.getElementById('compagno');
  const animati = [attaccante, palla, portiere, compagno];
  compagno.hidden = true;
  compagno.classList.remove('corre', 'calcia');
  animati.forEach(el => {
    el.classList.add('fermo');
    el.style.left = '';
    el.style.top = '';
    el.style.transform = '';
  });
  attaccante.classList.remove('corre', 'calcia', 'esulta', 'rovescia', 'mangia', ...Object.values(ESULTANZE));
  speciale = null;
  mirinoTouch = null;
  palla.classList.remove('gira', 'lenta', 'palleggio', 'super', 'effetto', 'giro', 'fuoco', 'foglia', 'rallentatore', 'infuocato', 'rotola');
  campo.classList.remove('replay', 'raffica-sx', 'raffica-dx');
  document.getElementById('pubblico').classList.remove('esulta');
  tuffoPrevisto = null;
  document.getElementById('fantasma').hidden = true;
  porta.classList.remove('trema', 'bloccata');
  portiere.classList.remove('guarda', 'laser', 'salta-sedia', 'balla');
  portiere.classList.add('attesa');
  mirino.hidden = true;
  velo.hidden = true;
  scritta.className = '';
  scritta.textContent = '';
  void campo.offsetWidth; // applica le posizioni iniziali senza transizione
  animati.forEach(el => el.classList.remove('fermo'));
}

function salvaRecord(chiave, valore) {
  if (valore <= record[chiave]) return false;
  record[chiave] = valore;
  try { localStorage.setItem('rigori-record', JSON.stringify(record)); } catch (e) {}
  return true;
}

function fine() {
  fase = 'attesa';
  aggiornaBottoni();
  const gol = tiri.map(t => t.filter(Boolean).length);

  if (modalita === 'sfida') {
    const v = vincitore();
    const dopoOltranza = tiri[0].length > RIGORI_REGOLAMENTARI;
    scritta.textContent = `🏆 Vince ${scelti[v].nome}!`;
    scritta.className = 'pop verde';
    messaggio.textContent = vittoriaIstantanea !== null
      ? `🪑 Abilità nascosta! Ugo Pellegrini ha parato: ${nomeG(v)} vince la partita!`
      : `${nomeG(v)} vince ${gol[v]}-${gol[1 - v]}${dopoOltranza ? ' ai rigori ad oltranza' : ''}!`;
  } else if (modalita === 'allenamento') {
    const giudizi = ['Serve allenamento...', 'Serve allenamento...', 'Si può fare di meglio.', 'Niente male!', 'Bomber vero!', 'Perfetto! Infallibile!'];
    const nuovo = salvaRecord('allenamento', gol[0]);
    messaggio.textContent = `Fine! ${gol[0]} su ${RIGORI_REGOLAMENTARI}. ${giudizi[gol[0]]}${nuovo ? ' 🏆 Nuovo record!' : ''}`;
  } else if (modalita === 'portiere') {
    const parate = tiri[0].filter(x => !x).length;
    const nuovo = salvaRecord('portiere', parate);
    messaggio.textContent = vittoriaIstantanea !== null
      ? '🪑 La Sedia ha parato: hai vinto subito!'
      : `Hai parato ${parate} rigori su ${tiri[0].length}!${nuovo ? ' 🏆 Nuovo record!' : ''}`;
  } else {
    const nuovo = salvaRecord('oltranza', gol[0]);
    messaggio.textContent = `Serie finita: ${gol[0]} gol di fila!${nuovo ? ' 🏆 Nuovo record!' : ''}`;
  }
  aggiornaInfo();
  document.getElementById('finale').hidden = false;
  document.getElementById('btn-ancora').hidden = inTorneo;
  document.getElementById('btn-tabellone').hidden = !inTorneo;
  if (inTorneo) {
    const v = vincitore();
    partitaTorneo.vincitore = v === 0 ? partitaTorneo.a : partitaTorneo.b;
    partitaTorneo.gol = gol;
    partitaTorneo.istantanea = vittoriaIstantanea !== null;
  }
}

// ================= Torneo =================
function apriSetupTorneo() {
  const squadre = document.getElementById('torneo-squadre');
  const umani = document.getElementById('torneo-umani');
  const aggiorna = () => {
    const n = Number(squadre.value);
    const prima = Number(umani.value) || 1;
    umani.innerHTML = '';
    for (let i = 1; i <= n; i++) {
      umani.innerHTML += `<option value="${i}">${i === 1 ? '1 (tu contro il computer)' : i}</option>`;
    }
    umani.value = String(Math.min(prima, n));
  };
  squadre.onchange = aggiorna;
  aggiorna();
  document.getElementById('torneo-avanti').onclick = () => {
    umaniTorneo = Number(umani.value);
    scelti = [];
    portieri = [];
    apriRoster();
  };
  mostraSchermata('schermata-setup');
}


function creaTorneo() {
  const numSquadre = Number(document.getElementById('torneo-squadre').value);
  const squadre = scelti.map((g, i) => ({ prefisso: `G${i + 1}`, rigorista: g, portiere: portieri[i], cpu: false }));
  // Il computer prende prima i giocatori non ancora scelti
  const rigoristiLiberi = mescola(GIOCATORI.filter(g => !scelti.includes(g)));
  const portieriLiberi = mescola(PORTIERI.filter(p => !portieri.includes(p)));
  for (let k = 1; squadre.length < numSquadre; k++) {
    squadre.push({
      prefisso: `🤖${k}`,
      rigorista: rigoristiLiberi.pop() || GIOCATORI[Math.floor(Math.random() * GIOCATORI.length)],
      portiere: portieriLiberi.pop() || PORTIERI[Math.floor(Math.random() * PORTIERI.length)],
      cpu: true,
    });
  }
  const ordine = mescola(squadre.map((_, i) => i));
  const primoTurno = [];
  for (let i = 0; i < ordine.length; i += 2) primoTurno.push({ a: ordine[i], b: ordine[i + 1], vincitore: null, gol: null });
  torneo = { squadre, turni: [primoTurno] };
  mostraTorneo();
}

function nomeTurno(numPartite) {
  return numPartite === 1 ? 'Finale' : numPartite === 2 ? 'Semifinali' : 'Quarti di finale';
}


// Simula le partite tra computer e, a turno finito, crea quello successivo
function avanzaTorneo() {
  for (;;) {
    const attuale = torneo.turni[torneo.turni.length - 1];
    attuale.forEach(m => {
      if (m.vincitore !== null || !torneo.squadre[m.a].cpu || !torneo.squadre[m.b].cpu) return;
      const meteo = sceltaMeteo.value === 'casuale' ? 'sereno' : sceltaMeteo.value;
      const r = simulaPartita(torneo.squadre[m.a], torneo.squadre[m.b], meteo);
      m.vincitore = r.vincitore === 0 ? m.a : m.b;
      m.gol = r.gol;
      m.istantanea = r.istantanea;
    });
    if (attuale.some(m => m.vincitore === null) || attuale.length === 1) return;
    const prossimo = [];
    for (let i = 0; i < attuale.length; i += 2) {
      prossimo.push({ a: attuale[i].vincitore, b: attuale[i + 1].vincitore, vincitore: null, gol: null });
    }
    torneo.turni.push(prossimo);
  }
}

function etichettaSquadra(sq) {
  return `${sq.prefisso} ${sq.rigorista.nome}<small>🧤 ${sq.portiere.nome}</small>`;
}

function mostraTorneo() {
  avanzaTorneo();
  inTorneo = true;
  const prossima = torneo.turni[torneo.turni.length - 1].find(m => m.vincitore === null) || null;
  const numPrimo = torneo.turni[0].length;

  let html = '';
  for (let r = 0, n = numPrimo; n >= 1; r++, n /= 2) {
    const partite = torneo.turni[r] || Array.from({ length: n }, () => null);
    html += `<div class="turno-torneo"><h3>${nomeTurno(n)}</h3>`;
    partite.forEach(m => {
      if (!m) {
        html += '<div class="partita-torneo"><div class="squadra-torneo">da decidere</div><div class="squadra-torneo">da decidere</div></div>';
        return;
      }
      const riga = (idx, gol) => {
        const stato = m.vincitore === null ? '' : m.vincitore === idx ? 'vince' : 'perde';
        return `<div class="squadra-torneo ${stato}"><span>${etichettaSquadra(torneo.squadre[idx])}</span><b>${gol ?? ''}</b></div>`;
      };
      html += `<div class="partita-torneo ${m === prossima ? 'prossima' : ''}">
        ${riga(m.a, m.gol ? m.gol[0] : null)}${riga(m.b, m.gol ? m.gol[1] : null)}
        ${m.istantanea ? '<small>🪑 decisa dalla Sedia</small>' : ''}</div>`;
    });
    html += '</div>';
  }
  document.getElementById('tabellone').innerHTML = html;

  const finale = torneo.turni[torneo.turni.length - 1];
  const campione = finale.length === 1 && finale[0].vincitore !== null ? torneo.squadre[finale[0].vincitore] : null;
  const gioca = document.getElementById('torneo-gioca');
  const msg = document.getElementById('torneo-messaggio');
  if (campione) {
    document.getElementById('torneo-titolo').textContent = '🏆 Torneo concluso';
    msg.textContent = `🏆 Campione: ${campione.prefisso} ${campione.rigorista.nome} con 🧤 ${campione.portiere.nome}!`;
    gioca.hidden = true;
  } else {
    const A = torneo.squadre[prossima.a];
    const B = torneo.squadre[prossima.b];
    document.getElementById('torneo-titolo').textContent = `🏆 ${nomeTurno(finale.length)}`;
    msg.textContent = `Prossima partita: ${A.prefisso} ${A.rigorista.nome} contro ${B.prefisso} ${B.rigorista.nome}`;
    gioca.hidden = false;
    gioca.onclick = () => giocaPartitaTorneo(prossima);
  }
  mostraSchermata('schermata-torneo');
}

function giocaPartitaTorneo(m) {
  const A = torneo.squadre[m.a];
  const B = torneo.squadre[m.b];
  partitaTorneo = m;
  modalita = 'sfida';
  rosa = [A.rigorista, B.rigorista];
  portieri = [A.portiere, B.portiere];
  cpu = [A.cpu, B.cpu];
  prefissi = [A.prefisso, B.prefisso];
  iniziaPartita();
}

document.getElementById('btn-tabellone').onclick = mostraTorneo;
