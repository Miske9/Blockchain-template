<script setup>
function spojiNovcanik() {
  console.log('novcanik')
}
</script>

<template>
  <div class="page">
    <header class="header">
      <a class="brand" href="#" aria-label="Harmonika — početna stranica">
        <span class="brand-icon" aria-hidden="true">≋</span>
        Harmonika<span class="brand-dot">.</span>
      </a>
      <a class="header-link" href="#o-instrumentu">Upoznaj instrument <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" /></svg></a>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> TRADICIJA U NOVOM RITMU</p>
          <h1 id="hero-title">Jedan instrument.<br />Tisuću <em>priča.</em></h1>
          <p class="intro">Neke melodije ne slušamo samo ušima.<br class="desktop-break" /> Osjetimo ih srcem. Upoznaj harmoniku.</p>
          <button class="wallet-button" type="button" @click="spojiNovcanik">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 8V5a2 2 0 0 0-2-2L5 6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h15V8H5a2 2 0 0 1 0-4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              <path d="M20 12h-5v5h5M17 14.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Spoji Novcanik
            <svg class="arrow-icon button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" /></svg>
          </button>
          <p class="button-note">Tvoja ulaznica u naš glazbeni svijet.</p>
        </div>

        <div class="hero-art">
          <span class="art-orbit" aria-hidden="true"></span>
          <span class="music-note note-one" aria-hidden="true">♪</span>
          <span class="music-note note-two" aria-hidden="true">♫</span>
          <svg class="art-spark" viewBox="0 0 50 50" fill="none" aria-hidden="true"><path d="M25 5v40M5 25h40M11 11l28 28M11 39l28-28" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
          <img class="accordion" src="/harmonika.svg" alt="Ilustracija crvene harmonike s klavijaturom, mijehom i basovskim gumbima" width="580" height="440" />
          <div class="art-caption">Mali orkestar. Veliko srce.</div>
          <span class="art-label">OD DAHA DO MELODIJE</span>
        </div>
      </section>

      <section id="o-instrumentu" class="about" aria-labelledby="about-title">
        <div class="about-heading">
          <p class="eyebrow">UPOZNAJ HARMONIKU</p>
          <h2 id="about-title">Glazba koja<br /><em>diše s tobom.</em></h2>
        </div>
        <div class="about-text">
          <p>Harmonika je instrument s tipkama ili gumbima i mijehom koji strujanjem zraka pokreće metalne jezičke. U njezinu se zvuku susreću toplina, snaga i cijeli mali orkestar.</p>
          <p>Desnom rukom sviraš melodiju, lijevom dodaješ basove i akorde, a širenjem i skupljanjem mijeha daješ glazbi dah. Od narodnih pjesama do tanga i jazza, harmonika uvijek pronalazi svoj ritam.</p>
        </div>
      </section>

      <section class="details" aria-label="Kako se svira harmonika">
        <article class="detail">
          <span class="detail-number">01 /</span>
          <h3>Melodija pod prstima</h3>
          <p>Tipke ili gumbi u desnoj ruci vode glavnu melodiju.</p>
        </article>
        <article class="detail">
          <span class="detail-number">02 /</span>
          <h3>Ritam u lijevoj ruci</h3>
          <p>Basovi i akordi stvaraju pratnju i drže ritam pjesme.</p>
        </article>
        <article class="detail">
          <span class="detail-number">03 /</span>
          <h3>Mijeh daje život</h3>
          <p>Pokretom mijeha oblikuješ jačinu i izražajnost zvuka.</p>
        </article>
      </section>
    </main>

    <footer class="footer">
      <span>Harmonika<span class="brand-dot">.</span></span>
      <p>Za sve koje glazba povezuje.</p>
      <span class="footer-signoff">S ljubavlju prema glazbi <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" /></svg></span>
    </footer>
  </div>
</template>
