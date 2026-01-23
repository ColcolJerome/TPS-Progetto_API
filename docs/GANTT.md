# Piano di Lavoro

Ecco il diagramma di Gantt del nostro progetto:

<div class="mermaid">
gantt
    title Progetto: Pokemon Battle Sim
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m
    
    section Setup Iniziale
    Setup Repo (Tutti)      :t1, 2025-12-27, 2d
    Studio API Esterne (Jerome)   :t2, 2025-12-27, 2d
    
    section Data Fetching
    Service Fetching Dati (Jerome):t3, 2025-12-29, 2d
    Struttura UI Base (Fra)       :t4, 2025-12-29, 2d

    section Battle System
    Battle Logic e Arena Pt.1 (Jerome+Fra) :crit, t5, 2026-01-02, 4d
    Battle Logic e Arena Pt.2 (Jerome+Fra) :crit, t6, 2026-01-07, 12d

    section Diego (Shop e Docs)
    Logica Negozio Gacha (Diego)  :t7, 2026-01-04, 2d
    Implementazione UI Shop (Diego):t8, 2026-01-07, 5d
    Documentazione Tecnica (Diego):t9, 2026-01-13, 6d
    
    section Chiusura Progetto
    Integrazione Shop (Team):t10, 2026-01-20, 3d
    Final Polish e Deploy (Team)  :t11, 2026-01-23, 2d
</div>

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default'
  });
</script>
