// ═══ MODULELE CURSULUI ═══
// Fiecare modul: t = titlu, d = descriere, html = lecția, q = întrebări [întrebare, [variante], indexul răspunsului corect (de la 0), explicație]
// Modifici aici, apoi faci push pe main și site-ul se actualizează.
window.MODULES = [
{t:"Bun venit în echipă", d:"Cine suntem, cine e cine, cum ne purtăm în biserică", html:`
<p>Echipa noastră ajută la <b>concertele corului</b>, la <b>evenimentele pentru adolescenți</b> și la activitățile din biserică. Fără voluntari, aceste evenimente nu ar putea avea loc.</p>
<h3>Cine e cine</h3>
<ul>
<li><b>Coordonatorul echipei</b> – prima persoană la care mergi cu orice întrebare sau problemă.</li>
<li><b>Dirijorul</b> – conduce corul; are ultimul cuvânt pentru tot ce se întâmplă pe scenă.</li>
<li><b>Preotul / responsabilul bisericii</b> – decide cum se folosește spațiul bisericii.</li>
<li><b>Mentorul tău</b> – un voluntar cu experiență care te însoțește la primele evenimente.</li>
</ul>
<h3>Valorile noastre</h3>
<p>Respect, seriozitate, bucurie și slujire. Venim pentru oameni, nu pentru noi.</p>
<h3>Comportamentul în biserică</h3>
<ul>
<li>Ținută decentă, potrivită locului.</li>
<li>Vorbim încet, mai ales în timpul slujbei sau al repetițiilor.</li>
<li>Nu mutăm obiecte din biserică fără acordul responsabilului.</li>
</ul>`,
q:[
["Ai o problemă la un eveniment. Cui te adresezi întâi?",["Dirijorului","Coordonatorului echipei","Oricui e în apropiere","Nimănui, o rezolvi singur"],1,"Coordonatorul e mereu primul contact. El știe tot planul evenimentului."],
["Cine are ultimul cuvânt pe scenă în timpul concertului?",["Dirijorul","Voluntarul cel mai vechi","Publicul","Tehnicianul de sunet"],0,"Pe scenă decide dirijorul. Noi îl ajutăm, nu luăm decizii în locul lui."],
["Ce face mentorul?",["Îți dă note la curs","Te însoțește și te ajută la primele evenimente","Plătește cheltuielile","Conduce corul"],1,"Mentorul e un voluntar cu experiență care te ajută să înveți din mers."],
["Care dintre acestea NU este o valoare a echipei?",["Respect","Seriozitate","Fiecare face ce vrea","Slujire"],2,"Lucrăm împreună, după un plan comun."],
["Vrei să muți o masă din biserică pentru o activitate. Ce faci?",["O muți, oricum o pui la loc","Ceri mai întâi acordul responsabilului bisericii","Rogi un adolescent să o mute","Renunți la activitate"],1,"Spațiul bisericii îl gestionează preotul sau responsabilul. Întrebăm înainte."]
]},
{t:"Drepturi și obligații", d:"Ce spune Legea voluntariatului nr. 78/2014", html:`
<p>În România, voluntariatul este reglementat de <b>Legea nr. 78/2014</b>. Mai jos e un rezumat pe înțelesul tuturor.</p>
<h3>Contractul de voluntariat</h3>
<p>Se încheie <b>în scris</b>, între tine și organizație. Spune ce activități faci, pe ce perioadă și care sunt drepturile și obligațiile fiecăruia.</p>
<h3>Drepturile tale</h3>
<ul>
<li>Să fii informat despre activitate și despre riscurile ei.</li>
<li>Să lucrezi în condiții de siguranță.</li>
<li>Să fii tratat cu respect și să îți spui părerea.</li>
<li>Să primești <b>certificat de voluntariat</b>, care arată ce ai făcut și ce ai învățat. E util la CV.</li>
</ul>
<h3>Obligațiile tale</h3>
<ul>
<li>Respecți programul și regulile echipei.</li>
<li>Păstrezi <b>confidențialitatea</b> informațiilor despre oameni, mai ales despre minori.</li>
<li>Ai grijă de bunurile organizației și ale bisericii.</li>
<li>Anunți din timp dacă nu poți veni.</li>
</ul>
<div class="tip">Orele de voluntariat se notează în fișa de prezență. Ele apar apoi în certificatul tău.</div>
<p class="small">Textul complet al legii: legislatie.just.ro (caută „Legea 78/2014”).</p>`,
q:[
["Ce lege reglementează voluntariatul în România?",["Legea 78/2014","Codul muncii","Legea 1/2011","Nu există o lege"],0,"Legea nr. 78/2014 privind reglementarea activității de voluntariat."],
["Cum se încheie contractul de voluntariat?",["Verbal, prin strângere de mână","Pe WhatsApp","În scris","Nu e nevoie de contract"],2,"Legea cere contract scris."],
["Ce document confirmă ce ai făcut ca voluntar?",["Diploma de bacalaureat","Certificatul de voluntariat","Carnetul de cor","Biletul de concert"],1,"Certificatul de voluntariat descrie activitatea și competențele tale."],
["Nu poți ajunge la eveniment. Ce faci?",["Nu spui nimic","Anunți coordonatorul cât mai din timp","Trimiți un prieten în locul tău fără să spui","Anunți după eveniment"],1,"Un anunț din timp îi lasă coordonatorului timp să te înlocuiască."],
["Ai aflat ceva personal despre un adolescent din grup. Ce faci?",["Povestești celorlalți voluntari","Postezi pe grup","Păstrezi confidențialitatea; dacă e un risc pentru el, spui doar coordonatorului","Îi spui părinților altui copil"],2,"Confidențialitatea e o obligație. Excepția: siguranța copilului, și atunci vorbești doar cu coordonatorul."]
]},
{t:"Siguranța adolescenților", d:"Reguli de protecție a minorilor", html:`
<p>Adolescenții sunt <b>minori</b>. Părinții ni-i încredințează și au încredere că sunt în siguranță cu noi. Regulile de mai jos te protejează și pe tine.</p>
<h3>Regula celor doi adulți</h3>
<p>Nu rămâi <b>niciodată singur cu un minor</b> într-un spațiu închis sau izolat. Dacă trebuie să vorbiți separat, stați într-un loc vizibil, cu ușa deschisă, cu alt adult în apropiere.</p>
<h3>Comunicarea online</h3>
<ul>
<li>Doar în <b>grupurile oficiale</b>, unde e și coordonatorul.</li>
<li>Fără conversații private cu minorii pe rețelele personale.</li>
<li>Mesaje la ore normale, cu limbaj potrivit.</li>
</ul>
<h3>Contact fizic și fotografii</h3>
<ul>
<li>Doar contact adecvat (un high-five, o bătaie pe umăr). Respecți limitele fiecăruia.</li>
<li>Fotografiile cu minori se fac și se folosesc <b>doar cu acordul scris al părinților</b> și doar pe canalele oficiale. Nu le postezi pe conturile tale.</li>
</ul>
<h3>Dacă un tânăr îți spune ceva grav</h3>
<ul>
<li>Asculți calm, fără să judeci.</li>
<li><b>Nu promiți că păstrezi secretul.</b> Spune-i că trebuie să ceri ajutor pentru el.</li>
<li>Nu investighezi singur. Anunți <b>imediat coordonatorul</b>.</li>
<li>Pericol imediat: suni la <b>112</b>. Telefonul Copilului: <b>116 111</b>.</li>
</ul>
<div class="tip">La final, tinerii pleacă doar cu părinții sau cu acordul acestora.</div>`,
q:[
["Un adolescent vrea să vorbească cu tine singur, într-o sală goală. Ce faci?",["Închizi ușa, să aveți liniște","Vorbiți într-un loc vizibil, cu ușa deschisă și alt adult în apropiere","Refuzi să vorbești cu el","Îl trimiți acasă"],1,"Îl asculți, dar respecți regula celor doi adulți."],
["Un adolescent îți scrie în privat pe Instagram. Ce faci?",["Continui discuția în privat","Îl blochezi fără explicații","Răspunzi scurt, muți discuția pe grupul oficial și anunți coordonatorul","Îi dai numărul tău personal"],2,"Comunicarea cu minorii se face doar pe canalele oficiale."],
["Un tânăr îți spune că e lovit acasă și te roagă să nu spui nimănui. Ce faci?",["Promiți că nu spui","Mergi la el acasă să verifici","Asculți calm, îi spui că trebuie să ceri ajutor și anunți imediat coordonatorul","Îi spui să uite"],2,"Nu promiți secretul și nu investighezi singur. Coordonatorul știe pașii următori."],
["Poți posta pe contul tău poze cu adolescenții de la eveniment?",["Da, dacă ies bine","Da, dacă nu le pui numele","Nu. Pozele se folosesc doar cu acordul părinților, pe canalele oficiale","Da, dacă sunt de acord tinerii"],2,"Pentru minori contează acordul scris al părinților."],
["Care e numărul unic de urgență în România?",["911","112","116 111","999"],1,"112 pentru urgențe. 116 111 e Telefonul Copilului, pentru sfat și sprijin."]
]},
{t:"Concertele corului", d:"Înainte, în timpul și după concert", html:`
<h3>Înainte</h3>
<ul>
<li>Vii la ora stabilită de coordonator, de obicei cu o oră înainte.</li>
<li>Afli care e rolul tău: primirea publicului, sala, zona corului sau garderoba.</li>
<li>Aranjezi scaunele, programele și indicatoarele.</li>
<li>Verifici că <b>ieșirile de urgență sunt libere</b>. Ele rămân libere tot concertul.</li>
</ul>
<h3>În timpul concertului</h3>
<ul>
<li>Primești oamenii cu un zâmbet și îi ajuți să găsească loc.</li>
<li>Ajuți persoanele în vârstă sau cu dizabilități; le oferi locuri ușor accesibile.</li>
<li>Cât corul cântă, <b>nu te miști prin sală</b>. Te miști doar între piese.</li>
<li>Spectatorii întârziați intră <b>între piese</b>.</li>
<li>Telefonul stă pe silențios. Îl folosești doar pentru coordonare sau urgențe.</li>
<li>Dacă cineva se simte rău: păstrezi calmul, anunți coordonatorul, suni la 112 dacă e grav.</li>
</ul>
<h3>După</h3>
<ul>
<li>Ajuți la strâns și verifici sala după obiecte uitate.</li>
<li>Lași biserica așa cum ai găsit-o.</li>
<li>La final, un scurt feedback cu echipa: ce a mers, ce facem mai bine.</li>
</ul>`,
q:[
["Când lași să intre un spectator întârziat?",["Imediat, oricând","Între piese","Doar la pauză","Niciodată"],1,"Așa nu deranjăm corul și publicul în timpul unei piese."],
["Ce e adevărat despre ieșirile de urgență?",["Pot fi folosite pentru scaune în plus","Rămân libere tot timpul","Se închid cu cheia în timpul concertului","Contează doar la evenimentele mari"],1,"În caz de urgență, fiecare secundă contează."],
["Unde e telefonul tău în timpul concertului?",["Pe sonor, să auzi mesajele","Pe silențios, folosit doar pentru coordonare sau urgențe","Filmezi tot concertul","Îl lași acasă"],1,"Suntem acolo pentru public și pentru cor."],
["O doamnă în vârstă nu găsește loc. Ce faci?",["Îi spui să stea în picioare","O conduci la un loc liber, ușor accesibil","O trimiți la coordonator","O așezi lângă ieșirea de urgență, pe culoar"],1,"Ajuți direct și nu blochezi culoarele sau ieșirile."],
["Ce fac voluntarii după concert?",["Pleacă primii","Ajută la strâns și verifică sala după obiecte uitate","Fac poze cu corul","Nimic, s-a terminat"],1,"Treaba se termină când sala e în ordine."]
]},
{t:"Evenimentele pentru tineri", d:"Atmosferă, activități, disciplină", html:`
<h3>Pregătirea</h3>
<ul>
<li>Știi programul și activitățile înainte să vină tinerii.</li>
<li>Pregătești materialele din timp.</li>
<li>Lista participanților, acordurile și contactele părinților le are <b>coordonatorul</b>. Sunt date confidențiale.</li>
</ul>
<h3>Atmosfera</h3>
<ul>
<li>Îi saluți pe nume. Învață numele cât mai repede.</li>
<li>Fii atent la cei timizi sau noi. Nimeni nu rămâne pe dinafară.</li>
<li>Tu ești un model: limbaj, comportament, punctualitate.</li>
</ul>
<h3>Jocuri și activități</h3>
<ul>
<li>Explici scurt și clar, apoi arăți un exemplu.</li>
<li>Dacă un joc nu merge, îl adaptezi sau treci la altceva.</li>
</ul>
<h3>Disciplina și conflictele</h3>
<ul>
<li>Regulile se spun la început.</li>
<li>Corectezi calm, <b>fără să umilești pe nimeni în public</b>. Vorbiți separat, dar într-un loc vizibil.</li>
<li>Într-un conflict între tineri: îi separi, asculți ambele părți, căutați o soluție. Cazurile grele merg la coordonator.</li>
</ul>`,
q:[
["Un tânăr nou stă singur într-un colț. Ce faci?",["Îl lași în pace","Îl inviți cu blândețe și îl prezinți altor tineri","Îi spui că trebuie să participe","Anunți părinții"],1,"Un gest mic îl ajută să se simtă primit."],
["Un tânăr deranjează activitatea. Ce faci?",["Îl cerți în fața tuturor","Îi vorbești calm, separat, fără să-l umilești","Îl ignori până la final","Îl trimiți afară singur"],1,"Respectul rămâne și când corectăm. Discuția separată are loc tot într-un loc vizibil."],
["Doi tineri se ceartă urât. Ce faci?",["Îi lași să rezolve singuri","Îi separi, asculți ambele părți și chemi coordonatorul dacă e nevoie","Iei partea celui care are dreptate","Oprești tot evenimentul"],1,"Calmul tău îi ajută să se calmeze."],
["Un joc nu merge deloc. Ce faci?",["Insiști până la final","Îl adaptezi sau treci la altă activitate","Te superi pe tineri","Lași tinerii pe telefoane"],1,"Planul te ajută, dar te adaptezi la grup."],
["Cine păstrează datele de contact ale părinților?",["Fiecare voluntar, pe telefon","Coordonatorul","Tinerii între ei","Sunt puse pe grupul echipei"],1,"Sunt date personale ale minorilor. Le păstrează coordonatorul."]
]},
{t:"Comunicare și echipă", d:"Ascultare, mesaje clare, punctualitate, feedback", html:`
<h3>Ascultarea activă</h3>
<ul>
<li>Privești persoana și nu o întrerupi.</li>
<li>Repeți pe scurt ce ai înțeles: „Deci ai nevoie de…”.</li>
</ul>
<h3>Mesaje clare în grupul echipei</h3>
<p>Un mesaj bun spune <b>cine, ce, când și unde</b>. Exemplu: „Ana și Mihai: aranjați scaunele în sala mare, sâmbătă la 17:00.”</p>
<h3>Punctualitate</h3>
<ul>
<li>Vii la timp. Dacă întârzii, anunți.</li>
<li>Dacă nu poți veni, anunți cu cel puțin 24 de ore înainte, când se poate.</li>
</ul>
<h3>Când nu știi</h3>
<p>Spui sincer: „Nu știu, dar aflu și revin.” E mai bine decât să inventezi un răspuns.</p>
<h3>Feedback</h3>
<ul>
<li>Spui ce a mers bine și ce se poate îmbunătăți.</li>
<li>Vorbești despre fapte, nu despre persoană.</li>
<li>Problemele le spui direct coordonatorului. Nu bârfim.</li>
</ul>`,
q:[
["Care mesaj e cel mai clar?",["„Cineva să facă ceva cu scaunele”","„Ana și Mihai: aranjați scaunele în sala mare, sâmbătă la 17:00”","„Scaune!!!”","„Vedem sâmbătă”"],1,"Spune cine, ce, când și unde."],
["Un spectator te întreabă ceva și nu știi răspunsul. Ce spui?",["Inventezi ceva","„Nu e treaba mea”","„Nu știu, dar aflu și revin”","Nu răspunzi"],2,"Sinceritatea construiește încredere."],
["Cu cât timp înainte anunți, ideal, că nu poți veni?",["Cu 5 minute înainte","Cu cel puțin 24 de ore înainte, când se poate","După eveniment","Nu e nevoie"],1,"Așa coordonatorul are timp să găsească pe altcineva."],
["Cum dai un feedback bun?",["Critici persoana","Vorbești despre fapte: ce a mers și ce se poate îmbunătăți","Spui doar ce a fost rău","Vorbești pe la spate"],1,"Feedbackul e despre fapte, nu despre om."],
["Un coleg voluntar întârzie mereu. Ce faci?",["Te plângi celorlalți","Vorbești cu el sau cu coordonatorul, direct și calm","Postezi pe grup","Nu mai vii nici tu la timp"],1,"Problemele se rezolvă direct, fără bârfă."]
]},
{t:"Urgențe și prim ajutor", d:"112, leșin, evacuare – noțiuni de bază", html:`
<p>Nu trebuie să fii medic. Trebuie să știi ce faci în primele minute.</p>
<h3>Înainte de eveniment</h3>
<ul>
<li>Știi unde sunt <b>trusa de prim ajutor</b>, stingătorul și ieșirile de urgență.</li>
<li>Coordonatorul știe dinainte, din fișa completată de părinți, ce alergii sau probleme de sănătate au tinerii.</li>
</ul>
<h3>Apelul la 112</h3>
<ul>
<li>Spui întâi <b>unde ești</b> (adresa bisericii) și <b>ce s-a întâmplat</b>.</li>
<li>Apoi: câte persoane sunt afectate și în ce stare.</li>
<li>Nu închizi primul. Urmezi indicațiile operatorului.</li>
</ul>
<h3>Leșinul</h3>
<p>Culci persoana pe spate și îi ridici picioarele. Îi asiguri aer. Dacă nu își revine repede, suni la 112.</p>
<h3>Persoană inconștientă</h3>
<ul>
<li>Dacă respiră: o pui în <b>poziția laterală de siguranță</b> și suni la 112.</li>
<li>Dacă nu respiră: suni imediat la 112. Operatorul te ghidează.</li>
</ul>
<h3>Evacuarea</h3>
<ul>
<li>Calm. Conduci oamenii spre ieșiri.</li>
<li>Cu tinerii mergi la <b>punctul de adunare</b> și îi numeri.</li>
</ul>
<div class="tip">Îți recomandăm un curs de prim ajutor la Crucea Roșie Română, filiala Timiș.</div>`,
q:[
["Ce spui primul când suni la 112?",["Numele tău complet","Unde ești și ce s-a întâmplat","Ce vârstă are persoana","Că e grav, apoi închizi"],1,"Locul și situația ajung cel mai repede ajutorul la tine."],
["Cineva leșină în timpul concertului. Ce faci?",["Îi dai apă cât timp e inconștient","Îl culci pe spate, îi ridici picioarele; dacă nu își revine repede, suni la 112","Îl ridici în picioare","Aștepți finalul concertului"],1,"Nu dai nimic de băut unei persoane inconștiente."],
["Persoana e inconștientă, dar respiră. Ce faci?",["O lași cum e","O pui în poziția laterală de siguranță și suni la 112","O scuturi tare","O duci singur la spital"],1,"Poziția laterală ține căile respiratorii libere."],
["Se dă alarma de incendiu în timpul unui eveniment pentru tineri. Ce faci?",["Strângi lucrurile întâi","Îi conduci calm la punctul de adunare și îi numeri","Îi lași să iasă cum vor","Verifici dacă e alarmă falsă"],1,"Numărătoarea îți arată dacă lipsește cineva."],
["Cine trebuie să știe dinainte de alergiile tinerilor?",["Nimeni","Coordonatorul, din fișa completată de părinți","Doar tinerii","Ceilalți participanți"],1,"Informația de sănătate se adună dinainte și e confidențială."]
]}
];

