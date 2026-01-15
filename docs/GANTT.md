# Piano di Lavoro

Ecco il diagramma di Gantt del nostro progetto:

```mermaid
gantt
    title Progetto: Pokémon Battle Sim (Co-op Battle Focus)
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m
    
    section Setup Iniziale
    Setup Repo (Tutti)      :t1, 2025-12-27, 2d
    Studio API Esterne (Jerome)   :t2, 2025-12-27, 2d
    
    section Data Fetching
    Service Fetching Dati (Jerome):t3, 2025-12-29, 2d
    Struttura UI Base (Fra)       :t4, 2025-12-29, 2d
    
    %% PAUSA 31 Dic - 1 Gen %%

    section Battle System (Co-op Heavy)
    %% Jerome e Francesco lavorano insieme qui per molto tempo %%
    Battle Logic & Arena Pt.1 (Jerome+Fra) :crit, t5, 2026-01-02, 4d
    %% PAUSA 6 Gen %%
    Battle Logic & Arena Pt.2 (Jerome+Fra) :crit, t6, 2026-01-07, 12d

    section Diego (Shop & Docs)
    %% Inizia il 4 Gen, salta il 6 Gen %%
    Logica Negozio/Gacha (Diego)  :t7, 2026-01-04, 2d
    Implementazione UI Shop (Diego):t8, 2026-01-07, 5d
    Documentazione Tecnica (Diego):t9, 2026-01-13, 6d
    
    section Chiusura Progetto
    Integrazione Shop in Battle (Team):t10, 2026-01-20, 3d
    Final Polish & Deploy (Team)  :t11, 2026-01-23, 2d
