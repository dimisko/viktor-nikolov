
import { Level } from './types.ts';

export const LEVELS: Record<number, Level> = {
  1: {
    id: 1,
    title: "Water Under the Bridge",
    caseFile: "VICTIM: Petar Stojanov (44). FOUND: Stone Bridge @ 03:00. CAUSE: Blunt Force Trauma / Laceration. NOTES: Victim was a top city developer. No wallet found. Signs of struggle.",
    locations: {
      "police_station": {
        id: "police_station",
        name: "Skopje Central Police Dept",
        imageSource: "/assets/locations/police_station.jpg",
        description: "The precinct smells of damp concrete and cheap tobacco. Viktor sits at his desk, head in hands. This is the only place in Skopje where the truth feels like a burden rather than a secret.",
        npcs: ["viktor", "sandra"],
        searches: [
          { id: "s1", description: "Viktor's desk contains an emergency stash of potent painkillers. You give him two. His breathing slows down.", clueId: "migraine_relief" }
        ],
        isInitial: true
      },
      "stone_bridge": {
        id: "stone_bridge",
        name: "Stone Bridge (Crime Scene)",
        imageSource: "/assets/locations/stone_bridge.jpg",
        description: "Police tape flutters in the wind. The Vardar river rages below. The spot where Stojanov fell is marked with a dark stain. The city's center feels cold tonight.",
        npcs: [],
        searches: [
          { id: "s2", description: "You notice tire tracks near the pedestrian zone. Heavy treads, likely a high-end SUV. No police vehicles were here yet.", clueId: "tire_track" },
          { id: "s3", description: "Discarded near a trash bin is a damp receipt from 'Kafana Trend' in Debar Maalo, dated last night.", clueId: "receipt" }
        ],
        isInitial: true
      },
      "debar_maalo": {
        id: "debar_maalo",
        name: "Debar Maalo - Kafana Trend",
        imageSource: "/assets/locations/debar_maalo.jpg",
        description: "The bohemian quarter is quiet now. 'Trend' is empty, but the scent of grilled meat lingers. This is where Stojanov spent his final hours.",
        npcs: ["waiter"],
        searches: [
          { id: "s4", description: "Behind a stack of menus, you find a booking card for 'Hotel Arka', Room 402, booked under the name 'Elena P.'", clueId: "hotel_card" }
        ]
      },
      "hotel_arka": {
        id: "hotel_arka",
        name: "Hotel Arka - Room 402",
        imageSource: "/assets/locations/hotel_arka.jpg",
        description: "A luxury boutique hotel in the Old Bazaar. Room 402 is clean, but there's a lingering scent of expensive perfume. Stojanov clearly used this for 'private' matters.",
        npcs: [],
        searches: [
          { id: "s5", description: "Under the bedside table, you find a gold cufflink with an 'S' engraving. It matches the one missing from the victim's body.", clueId: "cufflink" },
          { id: "s6", description: "Hidden in the room's safe (which was left open), you find documents showing Stojanov was blackmailing Marija Markova for files on her husband's embezzlement.", clueId: "blackmail_docs" }
        ]
      },
      "vardar_galleys": {
        id: "vardar_galleys",
        name: "Vardar River Galleys",
        imageSource: "/assets/locations/vardar_galleys.jpg",
        description: "The wooden tourist ships look like ghosts in the dark. A guard post sits at the end of the dock, a single lamp burning. Someone was here last night.",
        npcs: ["guard"],
        searches: [
          { id: "s7", description: "At the guard post you find a worn logbook left open on the desk. The entry for last night reads: '02:58 — Female, dark coat, carrying something bundled. Large dark SUV, Vodno direction.' Risto wasn't imagining things.", clueId: "guard_logbook" }
        ]
      },
      "markov_residence": {
        id: "markov_residence",
        name: "Markov Estate",
        imageSource: "/assets/locations/markov_residence.jpg",
        description: "A fortress of glass and marble in Vodno. The home of Goran Markov and his wife, Marija. Money can't hide the tension in the air here.",
        npcs: ["markov", "marija"],
        searches: [
          { id: "s8", description: "In the study hallway, an open velvet-lined case labeled 'Grand Opening: Skopje East Plaza'. The silver trowel that belongs there is gone. The velvet still holds the shape of it.", clueId: "missing_statuette" },
          { id: "s9", description: "A second sweep of the estate. You check the garage. Behind a loose panel near the workbench, wrapped tight in a cleaning cloth — the missing silver trowel. The engraving reads 'Skopje East Plaza'. The blood on the handle has barely dried.", clueId: "murder_weapon" }
        ]
      }
    },
    npcs: {
      "viktor": {
        id: "viktor",
        name: "Chief Inspector Viktor Nikolov",
        role: "Partner",
        description: "Tall, weary, and perpetually reaching for his temples.",
        imageSource: "/assets/characters/viktor.jpg",
        initialNode: "v_start",
        dialogue: {
          "v_start": {
            id: "v_start",
            speaker: "Viktor",
            text: "My brain is vibrating. This city is too loud for justice. What have you found in the Stojanov case?",
            options: [
              { text: "I need a fresh pair of eyes on this.", nextId: "v_help" },
              { text: "Who are our key suspects?", nextId: "v_suspects" },
              { text: "I'll keep digging.", nextId: "v_exit" }
            ]
          },
          "v_help": {
            id: "v_help",
            speaker: "Viktor",
            text: "[DYNAMIC_HINT]",
            options: [{ text: "Understood.", nextId: "v_start" }]
          },
          "v_suspects": {
            id: "v_suspects",
            speaker: "Viktor",
            text: "Markov is the obvious choice—business rivalry. But his wife, Marija... she's always been the silent partner. And Stojanov was a known womanizer. Women were his weakness and his leverage.",
            options: [{ text: "I'll keep that in mind.", nextId: "v_start" }]
          },
          "v_exit": { id: "v_exit", speaker: "Viktor", text: "Go. Don't let the Vardar wash away the truth before we can catch it.", options: [] }
        }
      },
      "sandra": {
        id: "sandra",
        name: "Dr. Sandra Kovac",
        role: "Medical Examiner",
        description: "Clinical, sharp, and impatient.",
        imageSource: "/assets/characters/sandra.jpg",
        initialNode: "s_start",
        dialogue: {
          "s_start": {
            id: "s_start",
            speaker: "Sandra",
            text: "The lab is a mess. I'm busy. Unless you have something physical from the scene, get out of my sight.",
            options: [
              { text: "Analyze the silver trowel.", nextId: "s_trowel", requirement: { clueId: "murder_weapon" } },
              { text: "Check the cufflink for DNA.", nextId: "s_cufflink_lab", requirement: { clueId: "cufflink" } },
              { text: "I'll leave you to your work.", nextId: "s_exit" }
            ]
          },
          "s_trowel": {
            id: "s_trowel",
            speaker: "Sandra",
            text: "Give me that. (She powders the handle). Exactly as I thought. Fingerprints. Let me cross-reference... It's a match. Marija Markova. You've got her, detective.",
            options: [{ text: "Excellent.", nextId: "s_start", onSelect: () => { 
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'fingerprints' }));
            }}]
          },
          "s_cufflink_lab": {
            id: "s_cufflink_lab",
            speaker: "Sandra",
            text: "This gold 'S' has skin cells caught in the engraving. The DNA sequencer doesn't lie. It's Marija's. She was struggling with him when he died.",
            options: [{ text: "Good work, Sandra.", nextId: "s_start", onSelect: () => {
                window.dispatchEvent(new CustomEvent('discover_clue', { detail: 'forensic_report' }));
            }}]
          },
          "s_exit": { id: "s_exit", speaker: "Sandra", text: "And close the door on your way out.", options: [] }
        }
      },
      "waiter": {
        id: "waiter",
        name: "Lazo",
        role: "Waiter",
        description: "Knows too much, says too little.",
        imageSource: "/assets/characters/waiter.jpg",
        initialNode: "l_start",
        dialogue: {
          "l_start": {
            id: "l_start",
            speaker: "Lazo",
            text: "Stojanov? He was here with a woman. Not his wife. She looked expensive and very, very angry. They left in a hurry.",
            options: [
              { text: "Where were they headed?", nextId: "l_info" },
              { text: "I have to go.", nextId: "l_exit" }
            ]
          },
          "l_info": {
            id: "l_info",
            speaker: "Lazo",
            text: "She mentioned 'Room 402'. I didn't catch the hotel, but she mentioned it was 'near the Bazaar'. Arka fits the bill.",
            options: [
              { text: "That's useful. Thanks.", nextId: "l_start" },
              { text: "See you around, Lazo.", nextId: "l_exit" }
            ]
          },
          "l_exit": { id: "l_exit", speaker: "Lazo", text: "Watch your back, detective.", options: [] }
        }
      },
      "markov": {
        id: "markov",
        name: "Goran Markov",
        role: "Business Partner",
        description: "A man who buys cities and burns bridges.",
        imageSource: "/assets/characters/markov.jpg",
        initialNode: "m_start",
        dialogue: {
          "m_start": {
            id: "m_start",
            speaker: "Goran",
            text: "Stojanov was a parasite. But I didn't kill him. I'm a businessman, not a thug. Ask my wife if you want a character witness.",
            options: [
              { text: "Where is Marija?", nextId: "m_wife" },
              { text: "What about the tire tracks?", nextId: "m_tires", requirement: { clueId: "tire_track" } },
              { text: "I'll be seeing you.", nextId: "m_exit" }
            ]
          },
          "m_wife": {
            id: "m_wife",
            speaker: "Goran",
            text: "She's upstairs. She's been... fragile since the news. They were 'close' once.",
            options: [{ text: "I'll go find her.", nextId: "m_start" }]
          },
          "m_tires": {
            id: "m_tires",
            speaker: "Goran",
            text: "I have a G-Wagon. So does half of Vodno. You need more than tread depth to lock me up, detective.",
            options: [{ text: "We'll see.", nextId: "m_start" }]
          },
          "m_exit": { id: "m_exit", speaker: "Goran", text: "Get out of my house.", options: [] }
        }
      },
      "guard": {
        id: "guard",
        name: "Risto",
        role: "Night Watch Guard",
        description: "Tired eyes that have seen too much of Skopje after midnight.",
        imageSource: "/assets/characters/guard.jpg",
        initialNode: "g_start",
        dialogue: {
          "g_start": {
            id: "g_start",
            speaker: "Risto",
            text: "I do twelve-hour shifts on these docks. I see a lot of things. Unless you've got a reason for me to talk, I've got rounds to do.",
            options: [
              { text: "We found SUV tracks near the bridge.", nextId: "g_witness", requirement: { clueId: "tire_track" } },
              { text: "I'll let you work.", nextId: "g_exit" }
            ]
          },
          "g_witness": {
            id: "g_witness",
            speaker: "Risto",
            text: "Yeah. Around 3am. A woman walking fast from the bridge — dark coat, heels. Not dressed for a stroll. She was carrying something bundled under her arm. Got into a big dark SUV parked on the Kej. Drove off toward Vodno.",
            options: [
              { text: "Could you describe her further?", nextId: "g_desc" },
              { text: "Did you log this?", nextId: "g_log" }
            ]
          },
          "g_desc": {
            id: "g_desc",
            speaker: "Risto",
            text: "Tall. Well put together, even at that hour. The kind of woman who lives behind gates. I didn't see her face clearly enough to say more.",
            options: [{ text: "That's enough. Thank you.", nextId: "g_start" }]
          },
          "g_log": {
            id: "g_log",
            speaker: "Risto",
            text: "It's in the logbook at the post. '02:58 — female, dark coat, dark SUV, Vodno direction.' I don't make things up.",
            options: [{ text: "I'll check the post.", nextId: "g_start" }]
          },
          "g_exit": { id: "g_exit", speaker: "Risto", text: "Watch the water, detective. It carries things away.", options: [] }
        }
      },
      "marija": {
        id: "marija",
        name: "Marija Markova",
        role: "The Wife",
        description: "Dressed in mourning black. Her eyes are dry and cold.",
        imageSource: "/assets/characters/marija.jpg",
        initialNode: "mr_start",
        dialogue: {
          "mr_start": {
            id: "mr_start",
            speaker: "Marija",
            text: "Petar was a fool. He thought he could use me to destroy Goran. He didn't realize that in Skopje, you don't use people like me.",
            options: [
              { text: "Explain your presence at Hotel Arka.", nextId: "mr_confront", requirement: { clueId: "hotel_card" } },
              { text: "Does this cufflink look familiar?", nextId: "mr_cufflink", requirement: { clueId: "cufflink" } },
              { text: "I found your blackmail documents.", nextId: "mr_blackmail", requirement: { clueId: "blackmail_docs" } },
              { text: "We found the trowel hidden in your garage.", nextId: "mr_weapon_deny", requirement: { clueId: "murder_weapon" } },
              { text: "We found the murder weapon. Admit it.", nextId: "mr_weapon", requirement: { clueId: "fingerprints" } },
              { text: "Goodbye.", nextId: "mr_exit" }
            ]
          },
          "mr_weapon_deny": {
            id: "mr_weapon_deny",
            speaker: "Marija",
            text: "In our garage. (A pause — too long.) Someone put it there. Petar had a key to the estate. He could have moved it himself. You cannot place me at that bridge.",
            options: [{ text: "A witness already did.", nextId: "mr_start" }]
          },
          "mr_confront": {
            id: "mr_confront",
            speaker: "Marija",
            text: "We had a history. A mistake. But Petar wanted more than just my company—he wanted Goran's empire. He threatened to expose us. I went there to beg him to stop.",
            options: [{ text: "I see.", nextId: "mr_start" }]
          },
          "mr_cufflink": {
            id: "mr_cufflink",
            speaker: "Marija",
            text: "A gold 'S'. Yes, he wore those every day. He was obsessed with his own name. I haven't seen that one in weeks.",
            options: [{ text: "You're lying.", nextId: "mr_start" }]
          },
          "mr_blackmail": {
            id: "mr_blackmail",
            speaker: "Marija",
            text: "He was forcing me to steal files. He was going to send Goran to prison and leave me with nothing. But that's not a reason to kill a man, is it?",
            options: [
              { text: "It is for someone with your temper.", nextId: "mr_start" },
              { text: "The presentation case in the hall is empty.", nextId: "mr_missing", requirement: { clueId: "missing_statuette" } }
            ]
          },
          "mr_missing": {
            id: "mr_missing",
            speaker: "Marija",
            text: "Petar admired that trowel — it was his project, his name on it. He must have taken it the last time he was here. I didn't even notice it was gone.",
            options: [{ text: "We found it. In your garage. Covered in his blood.", nextId: "mr_start", requirement: { clueId: "murder_weapon" } }]
          },
          "mr_weapon": {
            id: "mr_weapon",
            speaker: "Marija",
            text: "The prints... (She collapses into a chair) It was so heavy... and sharp. He laughed at me on that bridge. He said I was just a pawn in his development plan. I didn't plan it... I just couldn't let him build his empire on my bones.",
            options: [{ text: "It's over, Marija.", nextId: "mr_exit" }]
          },
          "mr_exit": { id: "mr_exit", speaker: "Marija", text: "I have nothing more to say to the police.", options: [] }
        }
      }
    },
    clues: {
      "tire_track": { id: "tire_track", name: "SUV Tire Tracks", imageSource: "/assets/evidence/tire_track.jpg", description: "Heavy treads found at the Stone Bridge. Matches Goran Markov's G-Wagon." },
      "receipt": { id: "receipt", name: "Kafana Receipt", imageSource: "/assets/evidence/receipt.jpg", description: "A receipt from Debar Maalo. Leads to Lazo the waiter." },
      "hotel_card": { id: "hotel_card", name: "Hotel Arka Card", imageSource: "/assets/evidence/hotel_card.jpg", description: "Found in Debar Maalo. Mentions Room 402." },
      "cufflink": { id: "cufflink", name: "S-Cufflink", imageSource: "/assets/evidence/cufflink.jpg", description: "Found in Hotel Arka. A match for the victim's missing one." },
      "blackmail_docs": { id: "blackmail_docs", name: "Blackmail Files", imageSource: "/assets/evidence/blackmail_docs.jpg", description: "Proves Stojanov was forcing Marija to spy on her husband." },
      "murder_weapon": { id: "murder_weapon", name: "Silver Trowel", imageSource: "/assets/evidence/murder_weapon.jpg", description: "Found hidden in the Markov garage, wrapped in a cleaning cloth. The blood on the handle has barely dried. Needs lab analysis." },
      "guard_logbook": { id: "guard_logbook", name: "Guard's Logbook", imageSource: "/assets/evidence/guard_logbook.jpg", description: "Entry 02:58 — 'Female, dark coat, carrying something bundled. Large dark SUV, Vodno direction.' Written in Risto's own hand." },
      "fingerprints": { id: "fingerprints", name: "Marija's Prints", imageSource: "/assets/evidence/fingerprints.jpg", description: "Forensic match: Marija's fingerprints found on the murder weapon." },
      "forensic_report": { id: "forensic_report", name: "Cufflink Lab Report", imageSource: "/assets/evidence/forensic_report.jpg", description: "Skin cells on the cufflink provide a DNA match for Marija Markova." },
      "missing_statuette": { id: "missing_statuette", name: "Empty Display Case", imageSource: "/assets/evidence/missing_statuette.jpg", description: "The presentation case for the silver trowel is empty at the Markov house." },
      "migraine_relief": { id: "migraine_relief", name: "Painkillers", imageSource: "/assets/evidence/migraine_relief.jpg", description: "Viktor's meds. Essential for keeping him focused." }
    },
    solution: {
      killerId: "marija",
      motive: "Personal Vendetta",
      evidenceId: "murder_weapon"
    }
  }
};
