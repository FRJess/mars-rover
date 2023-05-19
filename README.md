# Mars Rover

L'applicazione è visibile sulla pagina [Mars Rover](https://frjess.github.io/mars-rover/).

Le dimensioni della mappa, il numero e la posizione degli ostacoli ed i commandi inviati al Rover possono essere modificati in [input.txt](input.txt) seguendo questo modello:

- Grid (keyword da inserire)
- Size 5 5 (numero di colonne e di righe)
- Obstacle 2 0 (keyword con la posizione dell'ostacolo, ripetere per quanti ostacoli vogliamo sulla griglia)
- Obstacle 0 3
- Obstacle 3 2
- Commands (keyword)
- RFF (ogni riga coincide ad una riga di commandi che il rover dovrà effettuare)
- RF
- LFRFFLFFFLL

Commandi: 
- ` F ` -> Far muovere il rover di una casella nella direzione verso cui è rivolto
- ` B ` -> Far muovere il rover di una casella nella direzione opposta a quella verso cui è rivolto
- ` L ` -> Far ruotare di 90 gradi il rover verso destra
- ` R ` -> Far ruotare di 90 gradi il rover verso destra
