# Øvelser vedrørende Banking Application.

Slutmålet ved denne øvelse, bliver jere Banking Application, som er beskrevet på canvas: https://cbscanvas.instructure.com/courses/11500/assignments/12356. De funktionelle krav (og obligatoriske) går på, at vi skal:

1. Kunne få balancen på en given kundes account
2. Vi skal kunne få en liste af accounts.

For at kunne løse ovenstående opgave, har vi brug for to ting:

1. En server, som kan håndtere forskellige endpoints. 
   * Et endpoint er et sted på serveren, som trigger en bestemt respons, og er typisk formatteret som addresse:port/api/endpoint/metode fx localhost:8000/api/accounts/. I dette tilfælde er der ikke en decideret metode, fordi vi "bare" ønsker at manipulere accounts. Det betyder, at vi sender vi HTTP-requests som sendes over TCP-protokollen, og som rammer et givent endpoint, som trigger en handling. En HTTP-request kan have fire forskellige metoder. 
     `GET` er jeres standard kald, som bruges med ex `curl` eller når i indtaster en adresse i jeres browser. Denne rammer blot et endpoint med en forventing om at få noget data retur. `POST` bruges til at sende data med i en request og bruges typisk i metoder som login (hvor man sender et brugernavn og et password med), opret ny bruger (navn, email, password osv.) og generelt hver gang man ønsker at tilføje noget til sin database. 
     `PUT` bruges på samme måde som `POST` men i stedet for at tilføje data, er `PUT` ment til at ændre allerede eksisterende data. 
     Til sidst har vi `DELETE` som sletter noget data i databasen. Der kan læses mere her: https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28 (hvor der faktisk også er inkluderet en `PATCH`metode). 
     Hvis dette skal relateres til endpoints, så betyder det, at når vi sender et HTTP request med metoden `GET`til eksempelvis `localhost:8000/accounts`, så forventer vi at få en liste af accounts tilbage. Hvis vi sender en `POST`til samme addresse, forventer vi, at der sendes noget data med, som der kan oprettes en ny account ud fra. 

2. En database som indeholder vores persistente data.

   * En database er "bare" en instans som indeholder en masse data. I vores tilfælde kommer vi til at bruge en mongodb database, fordi det er det, i har brugt i jeres grundlæggende programmering. Bemærk at de funktionelle krav til denne opgave siger "bare", at i skal kunne returnere balancen for et account og en liste af accounts. Dette kan løses uden en database, simpelthen ved fx at hardcode dataen (eller gemme den i en JSON-fil) og så returnere denne. Vi anbefaler dog, at i bruger en database, da dette højst sandsynligt kommer til at skulle bruges til jeres eksamensprojekt. 

Denne struktur betyder, at endpoints'ne er den del af serveren som er tilgængelige for omverdenen. Det er disse som omverdenen bruger til at kommunikere med serveren og manipulere dataen. Udover dette er serveren for det meste forbundet til noget data storage som fx en database. Forholdet kan illustreres således:

![](https://i.imgur.com/aVhW3sA.jpeg)

1. Der sendes en HTTP-request til endpointet. Fx `curl localhost:8080/accounts`. Ved denne komando sendes der en `GET` request. Serveren modtager `GET` requesten på `/accounts` og kalder den dertilhørende kode.
2. Denne kode querier databasen og beder om alle accounts, der ligger i denne.
3. Databasen returnere en liste med accounts til serveren
4. Disse sendes retur til klienten (fx jeres terminal, hvis i har brugt curl) i et format som er tilladt over TCP. Fx en JSON-string.

Nederst ser i et eksempel på en HTTP-post request. Her er metoden sat til `POST`, og der er tilføjet et ekstra felt kaldet `body`. Body indeholder den data, der sendes af sted til serveren. Så når serveren modtager dette på samme endpoint `localhost:8080/accounts`, køres der en anden metode, fordi det er en `POST`request, og det registrere serveren. Serveren beder derfor databasen om at oprette en ny account. Databasen svarer serveren tilbage med en success eller en failure, og serveren returnere denne til klienten. Bemærk at i denne øvelse, kommer i kun til at skulle bruge `GET`-requests, som i kan kalde direkte fra jeres terminal. Senere lærer vi jer, hvordan i laver eksempelvis en `POST`-request. 

## 1. Server / Express / API opgaver

Som i har lært i jeres undervisning, er en "Network Socket", blot et stykke software, som står for at sende eller modtage data over internettet. I express teminologien er dette et andet udtryk for et endpoint. I mappen `1_express_api`er der sat et projekt op. Følgende opgaver går på at udforske API'et og indeholder ingen kode:

1. Kør applikationen gennem `node app.js`.

2. Find ud af, hvordan i får returneret "*Welcome to the banking app*". Hvilket endpoint skal i ramme? I kan bruge curl eller gøre det direkte i browseren.

3. Hvordan får i returneret "*This is the GET endpoint on accounts*"? 

4. Lav et nyt endpoint, som kan tage imod et parameter direkte i addressen. Dette skal implementeres i `accounts.js`på linje 27. Hint: Implementer det på samme måde som et almindeligt GET endpoint, men hvor i kan trække et id ud af adressen. Se https://expressjs.com/en/api.html#req for dokumentation. Når endpointet rammes, skal der udskrives "*Here we should get the account with id: <id'et som er sendt med i adressen>*"

5. Optional: Der ligger et post endpoint i `accounts.js`. Hvordan kan i ramme dette? Og hvad skal sendes med? Jeg foreslår at i undersøger programmer postman, sender en post request gennem det, hvor i sætter bodyen til noget ala det her: 

   ```json
   {
       "name": "Navn",
       "balance": 2000
   }
   ```

   

## 2. DB opsætning

### Mac

0. Denne manuel følger denne guide: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
1. Åbent en terminal
2. Skriv `brew tap mongodb/brew`
3. Skriv `brew install mongodb-community@4.4`
4. Hvis du får en fejl med `ChecksumMismatchError: SHA256 mismatch`, så prøv at følg denne guide: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#troubleshooting-checksumerror
5. Kør `brew services start mongodb/brew/mongodb-community`
6. Verify at mongodb kører: `ps aux | grep -v grep | grep mongod` skal outputte en linje.
7. Mongo er nu initialiseret, og kan accesses ved at skrive mongo.
8. Alternativt til punkt 7, foreslår jeg at bruge en GUI-klient. Jeg foreslår Compass, som kan installeres her fra: https://www.mongodb.com/try/download/compass eller med brew cask (hvis i bruger det) på `brew cask install mongodb-compass`.

### Windows

0. Jeg har desværre ikke har mulighed for at teste på windows, så følg denne guide: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/.
1. Når det hele er instaleret, kan i bruge mongodb gennem terminal, ellers foreslår jeg, at i kan hente Compass her: https://www.mongodb.com/try/download/compass

### Fælles

1. Når i åbner compass, kan i trykke på `Fill in connection fields individually`, og så bør i bare kunne connecte med standard indstillinger ved at trykke `connect`

2. Tryk `create database`og giv jeres database et navn. Fx `Banking`og jeres første collection et navn fx `accounts`

3. Åben databasen, og åben jeres collection.

4. Tryk `Add data`og tilføj noget demo data. Dette kan gøres gennem en json-file i `import file`eller i kan selv copy-paste noget json ind, når i vælger `insert document`. I forhold til, hvordan dataen skal struktureres, foreslår jeg et fornavn, et efternavn, en balance og en filial fx 

   ```json
   {
            "firstName":"Morten",
            "lastName":"Laursen",
            "balance":10000,
            "branch": "CBS Banking branch 1"
   },
   ```

   . **Det er bare vigtigt, at alle jeres accounts er struktureret ens** 

## 3. DB-opgaver

1. Når i har indsat nogle dokumenter, skal vi til at kode. Det resterende i database opgaven foregår i `1_database`mappen.
2. Åbn `db.js`og skriv din egen korrekte mongo url på linje 10. 
3. Åbn `account.js` og færdiggør jeres skema. Bemærk at det skal følge samme struktur, som i har lavet under "Fælles" punkt 4. 
4. Hvis alt er lavet korrekt, bør i kunne køre index.js, og få udskrevet jeres accounts. 
5. Optional: Leg lidt rundt med Mongoose. Dokumentationen kan findes her: https://mongoosejs.com/docs/index.html, og hvis i vil kigge på queries, skal i gå ind under model API → Model
   1. Hvordan vil i finde en account med et bestemt navn?
   2. Hvordan vil i finde en account med et bestemt id?
   3. Hvordan vil i redigere et eksisterende account?
   4. Hvordan vil i oprette en ny account?

## 4. Aflevering

I `3_handin_template`skal i lave jeres aflevering. Her sætter vi de to øvelser sammen, så ledes at i ved at ramme forskellige endpoints kan hente og redigere data i jeres database. 
Igen: aflveringen ligger her på canvas: https://cbscanvas.instructure.com/courses/11500/assignments/12356

1. Hvis I har lavet database opgaverne korrekt, kan i overskrive `3_handin_template/models/account.js`med indholdet i har i `2_database/accounts.js`.
2. Lige så, hvis i har lavet express opgaverne korrekt, kan i overskrive `3_handin_template/routes/accounts.js`med indholdet i `1_express_api/routes/accounts.js`. 
3. Nu skal i fortsat redigere i `3_handin_template/routes/accounts.js`så i kan løse de to funktionelle krav: 
   1. Kunne få balancen på en given kundes account
   2. Vi skal kunne få en liste af accounts.
4. Optional: Kan i lave et endpoint, der tilføjer en account til jeres database?

**VIGTIGT! EFTERSOM DENNE AFLEVERING ARBEJDER MED DATABASER, OG I ALLE SAMMEN MULIGVIS HAR FORSKELLIGE DATASTRUKTURE OG DATABASER, VIL VI BEDE JER VEDLÆGGE EN FILM, HVOR I DEMONSTRERE AT DE TO FUNKTIONELLE KRAV ER LØST. PÅ MAC KAN MAN TRYKKE `CMD + SHIFT + 5`OG VÆLGE OPTAG. PÅ WINDOWS HAR JEG DESVÆRRE IKKE HAFT MULIGHED FOR AT TESTE EN LØSNING, MEN DETTE KUNNE VÆRE EN MULIGHED: https://www.lifewire.com/record-your-screen-on-windows-10-5071102. HVIS IKKE, SÅ ER JEG SIKKER PÅ, I SELV KAN LØSE DET.**

