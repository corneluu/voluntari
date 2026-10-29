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
]},
{t:"Copil pierdut", d:"Ce faci când un copil sau o persoană vulnerabilă se rătăcește", html:`
<p>La concertele de Crăciun și de Paște vin multe familii. Un copil pierdut sau o persoană în vârstă confuză sunt situații care chiar se întâmplă.</p>
<h3>Înainte de eveniment</h3>
<ul>
<li>Coordonatorul stabilește <b>un singur punct pentru persoane pierdute</b> (de exemplu masa de informații).</li>
<li>Toți voluntarii știu unde este acest punct.</li>
</ul>
<h3>Ai găsit un copil singur</h3>
<ul>
<li>Rămâi calm și vorbește-i liniștit, la nivelul ochilor lui.</li>
<li>Îl duci la punctul stabilit și anunți imediat coordonatorul și ceilalți voluntari.</li>
<li><b>Nu rămâi singur cu copilul.</b> E nevoie de încă un adult lângă voi.</li>
<li>Nu ieși cu copilul din clădire și nu îl duci niciodată la o mașină.</li>
<li>La anunțuri <b>nu spui numele copilului</b>. Spui doar: „Părintele unui copil este rugat să vină la masa de informații.”</li>
</ul>
<h3>Când vine adultul</h3>
<ul>
<li>Verifici că e chiar părintele: întrebi cum îl cheamă pe copil și urmărești cum reacționează copilul.</li>
<li>Notezi ora găsirii, ora predării și numele adultului. Un al doilea voluntar e martor.</li>
</ul>
<h3>Un părinte îți spune că și-a pierdut copilul</h3>
<ul>
<li>Iei repede descrierea: vârstă, haine, unde a fost văzut ultima dată.</li>
<li>Anunți coordonatorul. Voluntarii supraveghează ieșirile și caută prin clădire.</li>
<li>Dacă nu e găsit repede, suni la <b>112</b>.</li>
</ul>
<div class="tip">La fel procedezi cu o persoană în vârstă confuză sau cu o persoană cu dizabilități care s-a rătăcit.</div>`,
q:[
["Ai găsit un copil singur, care plânge. Ce faci?",["Îl duci la mașina ta, să stea la căldură","Îl duci la punctul pentru persoane pierdute, cu încă un adult lângă voi, și anunți coordonatorul","Îl lași acolo, părinții vin sigur","Ieși cu el afară să-i cauți părinții"],1,"Punctul stabilit, doi adulți și coordonatorul anunțat."],
["Cum faci anunțul la microfon?",["Spui numele complet al copilului","Descrii copilul și spui unde stă","„Părintele unui copil este rugat să vină la masa de informații”","Nu faci niciun anunț"],2,"Numele copilului nu se anunță public."],
["Un adult spune că e tatăl copilului. Ce faci înainte să i-l dai?",["I-l dai imediat","Îl întrebi cum îl cheamă pe copil și urmărești reacția copilului","Ceri buletinul și faci poză","Îl trimiți la poliție"],1,"O verificare scurtă îl protejează pe copil."],
["Ce notezi după predarea copilului?",["Nimic","Ora găsirii, ora predării și numele adultului, cu un martor","Doar numele copilului, pe grupul echipei","Adresa părinților"],1,"O notă scurtă, cu martor, te protejează și pe tine."],
["Un copil raportat dispărut nu e găsit repede. Ce faci?",["Mai aștepți o oră","Suni la 112","Postezi pe Facebook","Închei evenimentul"],1,"Când un copil lipsește, nu se așteaptă."]
]},
{t:"Foc și aglomerație", d:"Lumânări, capacitatea bisericii și ieșirile la sărbători", html:`
<p>Noaptea de Înviere și concertele de Crăciun înseamnă biserici pline și sute de lumânări aprinse. Este cel mai mare risc de incendiu din an.</p>
<h3>Lumânările</h3>
<ul>
<li>Lumânările aprinse stau departe de haine, păr, robele corului, icoane, perdele și partituri.</li>
<li>Fii atent la copiii care țin lumânări.</li>
<li>Regulile se spun la început și se repetă la final.</li>
<li>După eveniment verifici că <b>nicio lumânare nu a rămas aprinsă</b> nesupravegheată.</li>
</ul>
<h3>Câți oameni intră</h3>
<ul>
<li>Nu lași să intre mai mulți oameni decât permite clădirea. Biserica trebuie să poată fi evacuată.</li>
<li><b>Culoarele și ieșirile rămân libere</b>, chiar dacă unii se supără.</li>
</ul>
<h3>Fluxul de oameni</h3>
<ul>
<li>Intrarea și ieșirea, separate când se poate.</li>
<li>Câte un voluntar la fiecare ieșire.</li>
<li>Voluntari în punctele înguste: uși, trepte, locul unde se aprind lumânările.</li>
</ul>
<h3>Stingătorul</h3>
<p>Știi unde e stingătorul și verifici înainte că există. Inspectoratul pentru Situații de Urgență (ISU) verifică bisericile mai ales înainte de Paște.</p>
<div class="tip">Incendiu: dai alarma, suni la 112, conduci oamenii calm spre ieșiri. Stingi doar un foc mic, și doar dacă ai ieșirea în spate.</div>`,
q:[
["O fetiță ține lumânarea aprinsă aproape de părul fetei din față. Ce faci?",["Nimic, e treaba părinților","Te apropii calm și o ajuți să țină lumânarea mai departe","Îi stingi lumânarea fără o vorbă","Strigi la ea"],1,"Calm, imediat și fără panică."],
["Biserica e plină, dar oamenii vor să stea pe culoar. Ce faci?",["Îi lași, e sărbătoare","Le explici politicos că culoarele trebuie să rămână libere pentru siguranță","Aduci scaune pe culoar","Închizi o ușă de ieșire ca să faci loc"],1,"Culoarele libere salvează vieți la o evacuare."],
["Ce verifici la finalul evenimentului?",["Doar banii din cutie","Că nicio lumânare nu a rămas aprinsă","Că s-au stins luminile din curte","Nimic"],1,"Multe incendii pornesc după ce lumea pleacă."],
["Unde pui voluntari în timpul slujbei de Înviere?",["Toți în față, lângă cor","La ieșiri și în punctele înguste: uși, trepte, locul unde se aprind lumânările","Afară, la parcare","Nicăieri, e slujbă"],1,"Acolo se adună oamenii și acolo apar problemele."],
["Izbucnește un incendiu mare. Ce faci primul?",["Încerci să-l stingi singur","Dai alarma, suni la 112 și conduci oamenii spre ieșiri","Strângi lucrurile corului","Filmezi"],1,"Oamenii întâi. Un foc mare îl sting pompierii."]
]},
{t:"Primul ajutor psihologic", d:"Privește, Ascultă, Conectează: cum ajuți un om în suferință", html:`
<p>La concerte vin și oameni în doliu, iar la orice eveniment cineva poate primi o veste rea sau poate fi speriat după un incident. Organizația Mondială a Sănătății folosește un model simplu în trei pași.</p>
<h3>1. Privește</h3>
<ul>
<li>Ce s-a întâmplat? E cineva în pericol sau rănit?</li>
<li>Are omul nevoie de ceva practic: apă, un scaun, un telefon?</li>
<li>Cum reacționează: plânge, tremură, e confuz?</li>
</ul>
<h3>2. Ascultă</h3>
<ul>
<li>Spune cine ești: „Sunt voluntar aici. Te pot ajuta cu ceva?”</li>
<li>Ascultă cu toată atenția și acceptă ce simte, fără să judeci.</li>
<li>Întreabă de ce are nevoie și ce îl îngrijorează.</li>
</ul>
<h3>3. Conectează</h3>
<ul>
<li>Ajută-l să ia legătura cu familia sau prietenii.</li>
<li>Leagă-l de ajutor practic: preotul, un transport acasă, un medic.</li>
<li>Ajută-l să își rezolve singur problemele. Nu le preiei tu pe toate.</li>
</ul>
<h3>Ce nu faci</h3>
<ul>
<li>Nu insiști să povestească ce s-a întâmplat.</li>
<li>Nu promiți ce nu poți face.</li>
<li>Nu faci pe psihologul. Rămâi lângă el până vine cineva care îl poate ajuta.</li>
</ul>
<div class="tip">Uneori ajutorul înseamnă doar o pătură, un loc liniștit sau un telefon dat unei rude.</div>`,
q:[
["Care sunt cei trei pași ai primului ajutor psihologic?",["Fugi, strigă, sună","Privește, ascultă, conectează","Întreabă, notează, raportează","Calmează, consolează, pleacă"],1,"Modelul OMS: Privește, Ascultă, Conectează."],
["O doamnă plânge în curtea bisericii după o slujbă de pomenire. Cum începi?",["„Nu mai plânge, totul va fi bine”","„Sunt voluntar aici. Te pot ajuta cu ceva?”","O întrebi ce s-a întâmplat exact","O lași în pace"],1,"Te prezinți și îi oferi ajutor, fără să forțezi nimic."],
["Ce înseamnă pasul „Conectează”?",["Îi dai numărul tău personal","O ajuți să ia legătura cu familia, preotul sau alt ajutor practic","O adaugi pe grupul echipei","Îi faci o poză"],1,"Îl legi de oamenii și ajutorul de care are nevoie."],
["Ce NU faci?",["Oferi apă","Rămâi lângă ea până vine cineva","Insiști să povestească tot ce s-a întâmplat","Asculți"],2,"Omul povestește doar dacă vrea."],
["Un adolescent e speriat după ce a văzut un accident. Ce ajută cel mai mult?",["Îi explici în detaliu ce s-a întâmplat","Un loc liniștit, un adult calm lângă el și anunțarea părinților","Îl lași singur să se liniștească","Îi spui că nu a fost nimic grav"],1,"Siguranță, calm și legătura cu familia."]
]},
{t:"Sănătatea emoțională a adolescenților", d:"Semne de alarmă și unde ceri ajutor", html:`
<p>Îi vezi pe tineri în fiecare săptămână. Poți fi primul adult care observă că ceva nu e în regulă.</p>
<h3>Semne de alarmă (după UNICEF)</h3>
<p>Contează mai ales când durează câteva săptămâni:</p>
<ul>
<li>tristețe sau retragere de la ceilalți mai mult de două săptămâni;</li>
<li>vorbește despre autovătămare sau sinucidere, ori se rănește;</li>
<li>frică sau panică bruscă și puternică;</li>
<li>bătăi sau dorința de a-i răni pe alții;</li>
<li>schimbări mari la mâncare, sau sport excesiv;</li>
<li>griji care îl împiedică să-și trăiască viața de zi cu zi;</li>
<li>alcool sau droguri;</li>
<li>schimbări mari de dispoziție sau de personalitate.</li>
</ul>
<h3>Ce faci</h3>
<ul>
<li>Îi arăți că ești acolo și că îl asculți. Nu judeci și nu minimalizezi („lasă, trece”).</li>
<li><b>Nu pui diagnostice.</b> Spui ce ai observat coordonatorului, ca la orice problemă de siguranță.</li>
<li>Nu promiți că păstrezi secretul.</li>
<li>Dacă tânărul e în pericol (vorbește că vrea să-și facă rău), acționezi imediat: nu îl lași singur, anunți coordonatorul, suni la <b>112</b> dacă pericolul e acum.</li>
</ul>
<h3>Numere utile</h3>
<ul>
<li><b>112</b> – pericol imediat.</li>
<li><b>116 111</b> – Telefonul Copilului, gratuit, pentru copii și adolescenți.</li>
</ul>`,
q:[
["Un tânăr din grup e retras și trist de aproape o lună. Ce faci?",["Nimic, e adolescent","Îi arăți că ești acolo să-l asculți și spui coordonatorului ce ai observat","Îi spui ce boală crezi că are","Le spui celorlalți tineri"],1,"Observi, asculți și dai mai departe pe calea stabilită. Nu pui diagnostice."],
["Un tânăr îți spune că se gândește să-și facă rău. Ce faci?",["Promiți că nu spui nimănui","Îi spui că exagerează","Nu îl lași singur, anunți imediat coordonatorul și suni la 112 dacă pericolul e acum","Îl trimiți acasă"],2,"Pericolul pentru viață are prioritate față de orice secret."],
["Ce e 116 111?",["Pompierii","Telefonul Copilului, gratuit","Poliția locală","Salvamontul"],1,"Copiii și adolescenții pot suna gratuit la 116 111."],
["Care dintre acestea e un semn de alarmă?",["Râde cu prietenii","Vine la timp","Vorbește despre autovătămare","E obosit după un concert"],2,"Orice discuție despre autovătămare se ia în serios."],
["Ce răspuns e potrivit când un tânăr îți spune că e foarte trist?",["„Lasă, trece”","„Îmi pare rău că te simți așa. Vrei să-mi povestești?”","„Și eu am probleme mai mari”","„Nu te mai gândi”"],1,"Validezi ce simte și îi oferi atenție."]
]},
{t:"Calmarea unei persoane agitate", d:"Cum oprești un conflict fără să-l agravezi", html:`
<p>Concertele din biserică sunt deschise tuturor. Pot apărea certuri pentru locuri, persoane băute sau oameni cu probleme psihice.</p>
<h3>Prevenția</h3>
<ul>
<li>O primire caldă la ușă previne multe probleme.</li>
<li>Dacă cineva pare agitat, îl anunți discret pe coordonator.</li>
</ul>
<h3>Când cineva e furios</h3>
<ul>
<li>Întâi scazi tensiunea. Nu poți discuta logic cu cineva în plin nervi.</li>
<li>Vorbești calm, rar și încet. Propoziții scurte și respectuoase.</li>
<li>Nu te cerți, nu ții predici, nu vorbești de sus.</li>
<li>Păstrezi distanța, mâinile la vedere, și nu îi blochezi ieșirea.</li>
<li>Nu îl înconjurați mai mulți. Asta îl agită și mai tare.</li>
<li>Îi dai o alegere și o limită: „Puteți rămâne, dacă păstrăm liniștea.” Îl conduci, dacă se poate, mai departe de public.</li>
</ul>
<h3>Lucrați în doi</h3>
<p>Unul vorbește, celălalt stă aproape. Nu acționezi singur. Coordonatorul și preotul sunt informați.</p>
<div class="tip">Amenințări, armă sau violență: te retragi și suni la <b>112</b>. Nu imobilizezi pe nimeni.</div>`,
q:[
["Doi spectatori se ceartă tare pentru un loc. Ce faci primul?",["Le spui că se fac de râs","Te apropii calm, vorbești încet și oferi o soluție, de exemplu alt loc","Chemi toți voluntarii în jurul lor","Îi dai afară pe amândoi"],1,"Calmul tău scade tensiunea."],
["Un bărbat băut vorbește tare în timpul concertului. Ce faci?",["Îl tragi de braț afară","Îl abordezi calm, împreună cu un coleg, și îi spui că poate rămâne dacă păstrează liniștea","Îl certi în fața tuturor","Oprești concertul"],1,"Alegere plus limită, spuse cu respect, de doi oameni."],
["Unde stai când vorbești cu o persoană furioasă?",["Foarte aproape, să te audă","La distanță sigură, fără să-i blochezi ieșirea","Între ea și ușă","În spatele ei"],1,"Un om care se simte blocat devine mai agresiv."],
["De ce nu e bine să o înconjurați mai mulți voluntari?",["Pentru că e nepoliticos","Pentru că o agită și mai tare","Pentru că nu e nevoie de nimeni","Pentru că pierdeți concertul"],1,"Unul vorbește, unul stă aproape. Atât."],
["Persoana scoate un cuțit. Ce faci?",["Încerci să i-l iei","Te retragi, îndepărtezi oamenii și suni la 112","Continui să discuți","Îl filmezi"],1,"Siguranța ta și a publicului e pe primul loc."]
]},
{t:"Foto, video și GDPR", d:"Imaginea oamenilor, mai ales a minorilor", html:`
<p>Concertele și evenimentele pentru tineri se filmează și se postează. Imaginea unei persoane este <b>dată personală</b>, protejată de regulamentul european GDPR.</p>
<h3>Evenimente mari</h3>
<ul>
<li>La intrare se afișează un anunț: se fac fotografii, de ce și unde vor fi folosite.</li>
<li>Pozele generale cu publicul sunt în regulă dacă oamenii au fost informați.</li>
</ul>
<h3>Prim-planuri și evenimente mici</h3>
<ul>
<li>Ceri acordul persoanei.</li>
<li>O idee simplă: ecusoane colorate. Verde înseamnă că se poate fotografia, roșu înseamnă că nu.</li>
</ul>
<h3>Minorii</h3>
<ul>
<li>Pentru pozele cu tineri sub 16 ani e nevoie de <b>acordul scris al părinților</b>.</li>
<li>Nu publici numele complet al unui tânăr lângă poza lui.</li>
<li>Folosești doar telefoanele și conturile oficiale ale bisericii sau ale corului.</li>
</ul>
<h3>Ștergerea</h3>
<p>Dacă cineva cere să fie ștearsă o poză cu el, o ștergi și anunți coordonatorul.</p>
<div class="tip">Autoritatea din România pentru protecția datelor este ANSPDCP (dataprotection.ro).</div>`,
q:[
["Ce e imaginea unei persoane, conform GDPR?",["Nimic special","O dată personală","Proprietatea bisericii","Doar o amintire"],1,"De aceea are nevoie de reguli."],
["La un concert mare se fac poze. Ce trebuie să existe la intrare?",["Nimic","Un anunț care spune că se fac fotografii și unde vor fi folosite","Un fotograf profesionist","Un formular pentru fiecare spectator"],1,"Oamenii trebuie informați."],
["Vrei să postezi o poză de aproape cu un tânăr de 14 ani. Ce îți trebuie?",["Acordul lui verbal","Acordul scris al părinților","Nimic, dacă iese bine","Acordul dirijorului"],1,"Sub 16 ani decid părinții."],
["Ce NU faci când postezi poze de la evenimentul pentru tineri?",["Folosești contul oficial","Scrii numele complet al tinerilor lângă poze","Alegi poze de grup","Verifici acordurile"],1,"Numele lângă poză îi face ușor de găsit de oricine."],
["Cineva îți cere să ștergi o poză în care apare. Ce faci?",["Refuzi, ai făcut-o legal","O ștergi și anunți coordonatorul","O muți în alt album","Îi spui să vorbească cu preotul"],1,"Respectăm dorința omului."]
]},
{t:"Accesibilitate", d:"Persoane în vârstă și persoane cu dizabilități", html:`
<p>La concertele din biserică vin mulți oameni în vârstă. Bisericile vechi au trepte, lumină slabă și ecou.</p>
<h3>Regula de bază</h3>
<p><b>Întrebi înainte să ajuți:</b> „Vă pot ajuta cu ceva?” Nu apuci pe nimeni de braț și nu împingi un scaun cu rotile fără să întrebi.</p>
<h3>Locuri și drumuri</h3>
<ul>
<li>Păstrezi câteva locuri accesibile: pe margine, aproape de ieșire și de toaletă, cu spațiu pentru un scaun cu rotile.</li>
<li>Drumurile până la ele rămân libere, fără obiecte sau cabluri pe jos.</li>
</ul>
<h3>Auz</h3>
<ul>
<li>Cine vorbește în public folosește microfonul.</li>
<li>Când vorbești cu o persoană care aude greu, stai cu fața la ea și vorbește clar, ca să-ți poată citi buzele.</li>
</ul>
<h3>Văz</h3>
<ul>
<li>Oferi programe tipărite cu litere mari, dacă există.</li>
<li>Când conduci o persoană nevăzătoare, îi oferi brațul tău și îi spui ce urmează: „Urmează trei trepte în jos.”</li>
</ul>
<h3>Dizabilități care nu se văd</h3>
<p>Autism, demență, dureri cronice. Oferi un loc mai liniștit sau o pauză și nu ceri dovezi.</p>`,
q:[
["Vezi un domn în scaun cu rotile la intrare. Ce faci?",["Îl împingi direct înăuntru","Îl întrebi: „Vă pot ajuta cu ceva?”","Îl lași să se descurce","Îl trimiți la altă intrare fără explicații"],1,"Întâi întrebi, apoi ajuți cum vrea el."],
["Ce locuri păstrezi pentru persoanele cu nevoi speciale?",["Locurile din mijlocul rândului","Locuri pe margine, aproape de ieșire, cu spațiu pentru scaun cu rotile","Locurile de la balcon","Niciunul"],1,"Ușor de ajuns și ușor de ieșit."],
["Cum vorbești cu o persoană care aude greu?",["Strigi cât poți","Stai cu fața la ea și vorbești clar","Îi scrii pe telefon din spate","O eviți"],1,"Așa îți poate citi și buzele."],
["Conduci o doamnă nevăzătoare spre loc. Ce faci?",["O tragi de mână","Îi oferi brațul și îi spui ce urmează, de exemplu trepte","O împingi ușor din spate","O lași să meargă singură"],1,"Ea te ține de braț, iar tu îi descrii drumul."],
["Un tânăr cu autism e copleșit de zgomot. Ce faci?",["Îi ceri un certificat medical","Îi oferi un loc mai liniștit sau o pauză","Îi spui să se obișnuiască","Îl trimiți acasă"],1,"Ajuți fără să ceri dovezi."]
]}
];

