
import { Level } from './types.ts';

export const LEVELS: Record<number, Level> = {
  1: {
    id: 1,
    title: "Вода под мостот",
    caseFile: "ЖРТВА: Петар Стојанов (44). ПРОНАЈДЕН: Камен Мост @ 03:00. ПРИЧИНА: Тап удар / Лацерација. ЗАБЕЛЕШКИ: Жртвата беше врвен градски претприемач. Паричникот не е пронајден. Знаци на борба.",
    locations: {
      "police_station": {
        id: "police_station",
        name: "МВР Скопје - Централна Станица",
        imageSource: "/assets/locations/police_station.jpg",
        description: "Станицата мириса на влажен бетон и евтин тутун. Виктор седи зад бирото, со главата во раце. Ова е единственото место во Скопје каде вистината се чувствува како товар, а не тајна.",
        npcs: ["viktor", "sandra"],
        searches: [
          { id: "s1", description: "Бирото на Виктор крие итна резерва силни аналгетици. Му даваш два. Дишењето му се смирува.", clueId: "migraine_relief" }
        ],
        isInitial: true
      },
      "stone_bridge": {
        id: "stone_bridge",
        name: "Камен Мост (место на злосторство)",
        imageSource: "/assets/locations/stone_bridge.jpg",
        description: "Полициска лента се вивори на ветерот. Вардар беснее долу. Местото каде паднал Стојанов е обележано со темна дамка. Центарот на градот оваа ноќ е студен.",
        npcs: [],
        searches: [
          { id: "s2", description: "Забележуваш траги од гуми близу пешачката зона. Тешки шари, веројатно скап теренец. Нема полициски возила овде сè уште.", clueId: "tire_track" },
          { id: "s3", description: "Фрлена покрај канта за отпад е влажна сметка од 'Кафана Тренд' во Дебар Маало, датирана минатата ноќ.", clueId: "receipt" }
        ],
        isInitial: true
      },
      "debar_maalo": {
        id: "debar_maalo",
        name: "Дебар Маало - Кафана Тренд",
        imageSource: "/assets/locations/debar_maalo.jpg",
        description: "Боемската улица е тивка сега. 'Тренд' е празен, но мирисот на скара сè уште трае. Тука ги поминал последните часови Стојанов.",
        npcs: ["waiter"],
        searches: [
          { id: "s4", description: "Зад куп менија, наоѓаш картичка за резервација на 'Хотел Арка', Соба 402, резервирана на 'Елена П.'", clueId: "hotel_card" }
        ]
      },
      "hotel_arka": {
        id: "hotel_arka",
        name: "Хотел Арка - Соба 402",
        imageSource: "/assets/locations/hotel_arka.jpg",
        description: "Луксузен бутик хотел во Стариот Базар. Соба 402 е чиста, но има остаток на скап парфем. Стојанов очигледно ја користел за 'приватни' работи.",
        npcs: [],
        searches: [
          { id: "s5", description: "Под ноќнaта масичка наоѓаш златна манжетна со гравура 'С'. Се совпаѓа со онаа што недостасува од телото на жртвата.", clueId: "cufflink" },
          { id: "s6", description: "Скриено во сефот на собата (кој бил оставен отворен), наоѓаш документи кои покажуваат дека Стојанов ја уценувал Марија Маркова со досиеа за проневерата на нејзиниот сопруг.", clueId: "blackmail_docs" }
        ]
      },
      "vardar_galleys": {
        id: "vardar_galleys",
        name: "Галии на реката Вардар",
        imageSource: "/assets/locations/vardar_galleys.jpg",
        description: "Дрвените туристички бродови изгледаат како духови во темнината. Чуварски пост стои на крајот на шеталиштето, со единечна ламба која гори. Некој бил овде минатата ноќ.",
        npcs: ["guard"],
        searches: [
          { id: "s7", description: "На чуварскиот пост наоѓаш истрошен дневник оставен отворен на бирото. Записот од минатата ноќ гласи: '02:58 — Жена, темен мантил, носи нешто завиткано. Голем темен теренец, насока Водно.' Ристо не измислувал.", clueId: "guard_logbook" }
        ]
      },
      "markov_residence": {
        id: "markov_residence",
        name: "Имотот на Маркови",
        imageSource: "/assets/locations/markov_residence.jpg",
        description: "Тврдина од стакло и мермер на Водно. Домот на Горан Марков и неговата сопруга Марија. Парите не можат да ја скријат напнатоста во воздухот.",
        npcs: ["markov", "marija"],
        searches: [
          { id: "s8", description: "Во ходникот на кабинетот, отворена кутија со кадифена облога означена 'Свечено Отворање: Скопје Ист Плаза'. Сребрената мистрија која треба да биде таму ја нема. Некој ја отстранил неодамна — кадифето сè уште го чува неговиот облик.", clueId: "missing_statuette" },
          { id: "s9", description: "Втор преглед на имотот. Ја проверуваш гаражата. Зад лабава плоча покрај работната маса, цврсто завиткана во крпа за чистење — сребрената мистрија. Гравурата гласи 'Скопје Ист Плаза'. Крвта на рачката едвај се исушила.", clueId: "murder_weapon" }
        ]
      }
    },
    npcs: {
      "viktor": {
        id: "viktor",
        name: "Главен Инспектор Виктор Николов",
        role: "Партнер",
        description: "Висок, изморен, и вечно со рацете на слепоочниците.",
        imageSource: "/assets/characters/viktor.jpg",
        initialNode: "v_start",
        dialogue: {
          "v_start": {
            id: "v_start",
            speaker: "Виктор",
            text: "Мозокот ми вибрира. Овој град е премногу бучен за правда. Што пронадје во случајот со Стојанов?",
            options: [
              { text: "Ми треба свеж поглед на ова.", nextId: "v_help" },
              { text: "Кои се нашите главни осомничени?", nextId: "v_suspects" },
              { text: "Ќе продолжам да копам.", nextId: "v_exit" }
            ]
          },
          "v_help": {
            id: "v_help",
            speaker: "Виктор",
            text: "[DYNAMIC_HINT]",
            options: [{ text: "Разбрано.", nextId: "v_start" }]
          },
          "v_suspects": {
            id: "v_suspects",
            speaker: "Виктор",
            text: "Марков е очигледниот избор — деловна ривалност. Но неговата сопруга Марија... таа секогаш била тивкиот партнер. А Стојанов беше познат по жени. Жените беа и негова слабост и негова потпора.",
            options: [{ text: "Ќе го имам предвид тоа.", nextId: "v_start" }]
          },
          "v_exit": { id: "v_exit", speaker: "Виктор", text: "Оди. Не дозволувај Вардар да ја однесе вистината пред да можеме да ја фатиме.", options: [] }
        }
      },
      "sandra": {
        id: "sandra",
        name: "Д-р Сандра Ковач",
        role: "Судски Медицински Вештак",
        description: "Клинична, остра и нестрплива.",
        imageSource: "/assets/characters/sandra.jpg",
        initialNode: "s_start",
        dialogue: {
          "s_start": {
            id: "s_start",
            speaker: "Сандра",
            text: "Лабораторијата е во неред. Зафатена сум. Ако немаш нешто физичко од местото на злосторство, излези.",
            options: [
              { text: "Анализирај ја сребрената мистрија.", nextId: "s_trowel", requirement: { clueId: "murder_weapon" } },
              { text: "Провери ја манжетната за ДНК.", nextId: "s_cufflink_lab", requirement: { clueId: "cufflink" } },
              { text: "Ќе те оставам на работа.", nextId: "s_exit" }
            ]
          },
          "s_trowel": {
            id: "s_trowel",
            speaker: "Сандра",
            text: "Дај ми го. (Го пудрира рачката). Токму она што го мислев. Отпечатоци. Дај да проверам... Поклопување. Марија Маркова. Ја имаш, детективу.",
            options: [{ text: "Одлично.", nextId: "s_start", onSelect: () => {
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'fingerprints' }));
            }}]
          },
          "s_cufflink_lab": {
            id: "s_cufflink_lab",
            speaker: "Сандра",
            text: "Оваа златна 'С' има клетки на кожа фатени во гравурата. ДНК секвенцерот не лаже. Нејзина е. Се борела со него кога умрел.",
            options: [{ text: "Добра работа, Сандра.", nextId: "s_start", onSelect: () => {
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'forensic_report' }));
            }}]
          },
          "s_exit": { id: "s_exit", speaker: "Сандра", text: "И затвори ја вратата кога ќе излезеш.", options: [] }
        }
      },
      "waiter": {
        id: "waiter",
        name: "Лазо",
        role: "Келнер",
        description: "Знае премногу, зборува премалку.",
        imageSource: "/assets/characters/waiter.jpg",
        initialNode: "l_start",
        dialogue: {
          "l_start": {
            id: "l_start",
            speaker: "Лазо",
            text: "Стојанов? Бил тука со жена. Не неговата сопруга. Изгледала скапо и многу, многу лута. Заминале брзо.",
            options: [
              { text: "Каде се упатиле?", nextId: "l_info" },
              { text: "Морам да одам.", nextId: "l_exit" }
            ]
          },
          "l_info": {
            id: "l_info",
            speaker: "Лазо",
            text: "Таа спомена 'Соба 402'. Не го фатив хотелот, но рече дека е 'близу Базарот'. Арка одговара.",
            options: [
              { text: "Корисно. Благодарам.", nextId: "l_start" },
              { text: "Видување, Лазо.", nextId: "l_exit" }
            ]
          },
          "l_exit": { id: "l_exit", speaker: "Лазо", text: "Внимавај на себе, детективу.", options: [] }
        }
      },
      "guard": {
        id: "guard",
        name: "Ристо",
        role: "Ноќен Чувар",
        description: "Уморни очи кои виделе премногу од Скопје по полноќ.",
        imageSource: "/assets/characters/guard.jpg",
        initialNode: "g_start",
        dialogue: {
          "g_start": {
            id: "g_start",
            speaker: "Ристо",
            text: "Работам дванаесет-часовни смени на овие галии. Гледам многу работи. Ако немаш причина да зборувам, имам тури за правење.",
            options: [
              { text: "Пронајдовме траги од теренец кај мостот.", nextId: "g_witness", requirement: { clueId: "tire_track" } },
              { text: "Ќе те оставам на работа.", nextId: "g_exit" }
            ]
          },
          "g_witness": {
            id: "g_witness",
            speaker: "Ристо",
            text: "Да. Околу 3 наутро. Жена која брзо оди од мостот — темен мантил, штикли. Не беше облечена за прошетка. Носеше нешто завиткано под рака. Се качи во голем темен теренец паркиран на Кеј. Замина кон Водно.",
            options: [
              { text: "Можеш ли да ја опишеш подетално?", nextId: "g_desc" },
              { text: "Го запишал ли ова?", nextId: "g_log" }
            ]
          },
          "g_desc": {
            id: "g_desc",
            speaker: "Ристо",
            text: "Висока. Негувана, дури и во тој час. Типот на жена која живее зад високи порти. Не и го видов лицето доволно јасно за да кажам повеќе.",
            options: [{ text: "Тоа е доволно. Благодарам.", nextId: "g_start" }]
          },
          "g_log": {
            id: "g_log",
            speaker: "Ристо",
            text: "Запишано е во дневникот на постот. '02:58 — жена, темен мантил, темен теренец, насока Водно.' Јас не измислувам.",
            options: [{ text: "Ќе го проверам постот.", nextId: "g_start" }]
          },
          "g_exit": { id: "g_exit", speaker: "Ристо", text: "Внимавај на водата, детективу. Таа носи работи.", options: [] }
        }
      },
      "markov": {
        id: "markov",
        name: "Горан Марков",
        role: "Деловен Партнер",
        description: "Човек кој купува градови и ги гори мостовите.",
        imageSource: "/assets/characters/markov.jpg",
        initialNode: "m_start",
        dialogue: {
          "m_start": {
            id: "m_start",
            speaker: "Горан",
            text: "Стојанов беше паразит. Но јас не го убив. Јас сум деловен човек, не убиец. Прашај ја жена ми ако сакаш карактерна референца.",
            options: [
              { text: "Каде е Марија?", nextId: "m_wife" },
              { text: "Што е со трагите од гуми?", nextId: "m_tires", requirement: { clueId: "tire_track" } },
              { text: "Ќе се видиме.", nextId: "m_exit" }
            ]
          },
          "m_wife": {
            id: "m_wife",
            speaker: "Горан",
            text: "Горе е. Беше... погодена од веста. Биле 'блиски' некогаш.",
            options: [{ text: "Ќе одам да ја најдам.", nextId: "m_start" }]
          },
          "m_tires": {
            id: "m_tires",
            speaker: "Горан",
            text: "Имам G-Wagon. Исто така и половина Водно. Ти треба повеќе од оттиссоци на шари од гуми за да ме затвориш, детективу.",
            options: [{ text: "Ќе видиме.", nextId: "m_start" }]
          },
          "m_exit": { id: "m_exit", speaker: "Горан", text: "Излези од мојата куќа.", options: [] }
        }
      },
      "marija": {
        id: "marija",
        name: "Марија Маркова",
        role: "Сопругата",
        description: "Облечена во жалосна црнина. Очите и се суви и студени.",
        imageSource: "/assets/characters/marija.jpg",
        initialNode: "mr_start",
        dialogue: {
          "mr_start": {
            id: "mr_start",
            speaker: "Марија",
            text: "Петар беше будала. Мислеше дека може да ме искористи за да го уништи Горан. Не сфатил дека во Скопје, луѓе како мене не се користат.",
            options: [
              { text: "Објасни го присуството во Хотел Арка.", nextId: "mr_confront", requirement: { clueId: "hotel_card" } },
              { text: "Ова манжетна ти е позната?", nextId: "mr_cufflink", requirement: { clueId: "cufflink" } },
              { text: "Ги пронајдов твоите документи за уцена.", nextId: "mr_blackmail", requirement: { clueId: "blackmail_docs" } },
              { text: "Ја пронајдовме мистријата скриена во вашата гаража.", nextId: "mr_weapon_deny", requirement: { clueId: "murder_weapon" } },
              { text: "Го пронајдовме оружјето за убиство. Признај.", nextId: "mr_weapon", requirement: { clueId: "fingerprints" } },
              { text: "Збогум.", nextId: "mr_exit" }
            ]
          },
          "mr_weapon_deny": {
            id: "mr_weapon_deny",
            speaker: "Марија",
            text: "Во нашата гаража. (Пауза — предолга.) Некој го ставил таму. Петар имал клуч за имотот — можел сам да го преместил. Не можеш да ме поврзеш со тој мост.",
            options: [{ text: "Еден сведок веќе го направи тоа.", nextId: "mr_start" }]
          },
          "mr_confront": {
            id: "mr_confront",
            speaker: "Марија",
            text: "Имавме историја. Грешка. Но Петар сакал повеќе од само моето друштво — ја сакал империјата на Горан. Се закануваше дека ќе не разоткрие. Дојдов да го молам да запре.",
            options: [{ text: "Разбирам.", nextId: "mr_start" }]
          },
          "mr_cufflink": {
            id: "mr_cufflink",
            speaker: "Марија",
            text: "Златно 'С'. Да, ги носеше секој ден. Беше опседнат со сопственото име. Не сум го видела тоа со недели.",
            options: [{ text: "Лажеш.", nextId: "mr_start" }]
          },
          "mr_blackmail": {
            id: "mr_blackmail",
            speaker: "Марија",
            text: "Ме принудуваше да крадам досиеа. Ќе го пратеше Горан во затвор и ќе ме оставеше без ништо. Но тоа не е причина да се убие човек, нели?",
            options: [
              { text: "За некој со твојот темперамент — апсолутно.", nextId: "mr_start" },
              { text: "Кутијата за изложба во ходникот е празна.", nextId: "mr_missing", requirement: { clueId: "missing_statuette" } }
            ]
          },
          "mr_missing": {
            id: "mr_missing",
            speaker: "Марија",
            text: "Петар ја обожуваше таа мистрија — тоа беше негов проект, неговото име на него. Мора да го зел последниот пат кога беше тука. Не забележав дека го нема.",
            options: [{ text: "Го пронајдовме. Во твојата гаража. Покриено со негова крв.", nextId: "mr_start", requirement: { clueId: "murder_weapon" } }]
          },
          "mr_weapon": {
            id: "mr_weapon",
            speaker: "Марија",
            text: "Отпечатоците... (Се урива на столот) Беше толку тешко... и остро. Се смееше на тој мост. Рече дека сум само фигура во неговиот план за развој. Не го планирав... само не можев да го оставам да ја гради империјата врз моите коски.",
            options: [{ text: "Готово е, Марија.", nextId: "mr_exit" }]
          },
          "mr_exit": { id: "mr_exit", speaker: "Марија", text: "Немам повеќе ништо да кажам на полицијата.", options: [] }
        }
      }
    },
    clues: {
      "tire_track": { id: "tire_track", name: "Траги од гуми на теренец", imageSource: "/assets/evidence/tire_track.jpg", description: "Тешки шари пронајдени на Камен Мост. Се совпаѓаат со Г-Вагонот на Горан Марков." },
      "receipt": { id: "receipt", name: "Сметка од кафана", imageSource: "/assets/evidence/receipt.jpg", description: "Сметка од Дебар Маало. Води до Лазо, келнерот." },
      "hotel_card": { id: "hotel_card", name: "Картичка за хотел Арка", imageSource: "/assets/evidence/hotel_card.jpg", description: "Пронајдена во Дебар Маало. Споменува Соба 402." },
      "cufflink": { id: "cufflink", name: "Манжетна со буквата 'С'", imageSource: "/assets/evidence/cufflink.jpg", description: "Пронајдена во Хотел Арка. Се совпаѓа со онаа што недостасува на жртвата." },
      "blackmail_docs": { id: "blackmail_docs", name: "Досиеа за уцена", imageSource: "/assets/evidence/blackmail_docs.jpg", description: "Докажува дека Стојанов ја принудувал Марија да шпионира против нејзиниот сопруг." },
      "murder_weapon": { id: "murder_weapon", name: "Сребрена мистрија", imageSource: "/assets/evidence/murder_weapon.jpg", description: "Пронајдено скриено во гаражата на Маркови, завиткано во крпа за чистење. Крвта на рачката едвај се исушила. Потребна е лабораториска анализа." },
      "fingerprints": { id: "fingerprints", name: "Отпечатоци на Марија", imageSource: "/assets/evidence/fingerprints.jpg", description: "Форензичко поклопување: отпечатоците на Марија Маркова пронајдени на оружјето за убиство." },
      "forensic_report": { id: "forensic_report", name: "Лабораториски извештај", imageSource: "/assets/evidence/forensic_report.jpg", description: "Клетки на кожа на копчата за манжетни обезбедуваат ДНК поклопување за Марија Маркова." },
      "missing_statuette": { id: "missing_statuette", name: "Празна кутија за изложба", imageSource: "/assets/evidence/missing_statuette.jpg", description: "Кутијата за изложба на сребрена мистрија е празна во куќата на Маркови." },
      "guard_logbook": { id: "guard_logbook", name: "Дневник на чуварот", imageSource: "/assets/evidence/guard_logbook.jpg", description: "Запис од 02:58: 'Жена, темен мантил, голем темен теренец, насока Водно.' Напишано со рака на Ристо." },
      "migraine_relief": { id: "migraine_relief", name: "Аналгетици", imageSource: "/assets/evidence/migraine_relief.jpg", description: "Лековите на Виктор. Неопходни за да остане фокусиран." }
    },
    solution: {
      killerId: "marija",
      motive: "Лична освета",
      evidenceId: "murder_weapon"
    }
  }
};
