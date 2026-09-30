'use strict';
const roleDetails = {
 skraning: { illustration: "A guide holds a tablet beside a registration board with a blue sky, a four-part green roof and colourful panels.", location: 'You can find me near the registration board.', schedule: [
 ['13:30','Start work. Review the list of children and anything that needs discussing at the start of the day.'],
 ['13:35','Help set up and support other preparations.'],
 ['13:50','Get ready to collect the classes.'],
 ['14:00','Welcome the class and check children in. Introduce the afternoon and chat on the way outdoors.'],
 ['14:10','All older children are outdoors. Support children in the corridor, review class registers and reconcile the board.'],
 ['14:45','Help children sign up for activity areas and explain the details of the afternoon.'],
 ['15:00–16:00','Help children settle into activities or find something suitable. Check shared spaces, welcome parents and say goodbye to children.'],
 ['16:00','Review attendance and reconcile the register at the end of the day.'],
 ['16:15','Tidy the board and say goodbye to the last children. Contact parents about collection when needed, following the agreed procedure.'],
 ['16:30','Finish when all children have been collected or responsibility has been handed over according to procedure.'] ] },
 fondur: { illustration: "A guide and two children create together at a table with coloured paper, beads and clay.", location: 'You can find me in Arts & crafts.', schedule: [
 ['13:30','Review the afternoon with the team and choose a creative activity that different children can join.'],
 ['13:35','Prepare paper, colours, beads or clay and set up the workspace.'],
 ['13:50','Help collect classes according to the team plan.'],
 ['14:00','Welcome children and support the transition outdoors.'],
 ['14:10','Help with outdoor play and invite children to try a creative project later.'],
 ['14:45','Open the activity area, introduce materials and show how to tidy up.'],
 ['15:00–15:40','Support creativity, connect children with shared interests and make room for their ideas.'],
 ['15:40','Finish projects together, label work and tidy materials before going outside.'],
 ['16:00','Help with outdoor play and departures.'],
 ['16:15','Check the workspace and share what needs preparing for tomorrow.'],
 ['16:30','Finish according to the team plan and agreed procedure.'] ] },
 music: { illustration: "A guide and two children explore a colourful xylophone and examine a leaf with a magnifying glass.", location: 'You can find me in Music & science.', schedule: [
 ['13:30','Review the afternoon and choose a music or discovery activity.'],
 ['13:35','Check equipment, prepare materials and consider safe use and comfortable sound levels.'],
 ['13:50','Help collect classes according to the team plan.'],
 ['14:00','Welcome children and accompany them outside.'],
 ['14:10','Support outdoor play and get to know the children’s interests.'],
 ['14:45','Open the activity area and introduce the project, equipment and shared rules.'],
 ['15:00–15:40','Offer music, experiments and collaboration. Help children take turns and explore.'],
 ['15:40','Put equipment away with the children and support the move outdoors.'],
 ['16:00','Help with outdoor play and departures.'],
 ['16:15','Check that equipment is stored and share ideas for tomorrow.'],
 ['16:30','Finish according to the team plan and agreed procedure.'] ] },
 stud: { illustration: "A guide crouches beside two children building with large foam blocks on a rug. A ball lies nearby.", location: 'You can find me in Active play.', schedule: [
 ['13:30','Review the group’s needs and plan a game that everyone can find a way into.'],
 ['13:35','Prepare the play space and check the play materials.'],
 ['13:50','Get ready to welcome the classes with the team.'],
 ['14:00','Welcome children and help them get outside.'],
 ['14:10','Offer outdoor games and help children connect with one another.'],
 ['14:45','Open Active play and introduce the games and boundaries of the space.'],
 ['15:00–15:40','Support free play and movement, welcome newcomers and help with relationships.'],
 ['15:40','Tidy with the group and help everyone get outside.'],
 ['16:00','Support outdoor play and a calm end to the afternoon.'],
 ['16:15','Check the play space and help the last children leave.'],
 ['16:30','Finish according to the team plan and agreed procedure.'] ] },
 uti: { illustration: "A guide watches two children playing ball in the Little Garden, with grass, a tree and a low fence.", location: 'You can find me outside in the Little Garden.', schedule: [
 ['13:30','Review the afternoon, weather and responsibilities across the outdoor areas.'],
 ['13:35','Check the outdoor space and prepare suitable play materials.'],
 ['13:50','Coordinate outdoor arrivals with the staff collecting classes.'],
 ['14:00','Welcome children outside and remind them of the boundaries.'],
 ['14:10','Be visible, support play and notice children who need company.'],
 ['14:45','Coordinate transitions between indoor and outdoor areas and welcome the youngest group.'],
 ['15:00–15:40','Support outdoor play and keep an eye on wellbeing and participation.'],
 ['15:50','Welcome the older children coming outside after tidying up.'],
 ['16:00','Coordinate departures with Registration and help children find their belongings.'],
 ['16:15','Put away outdoor equipment with the group and check the area according to the team plan.'],
 ['16:30','Finish once supervision has ended or been handed over according to procedure.'] ] },
 matur: { illustration: "A guide stands beside two children sharing a calm snack break at a table with bowls, cups and fruit.", location: 'You can find me in the dining hall.', schedule: [
 ['13:30','Review meal times and information about dietary needs using the agreed procedure.'],
 ['13:35','Prepare the dining hall and coordinate arrangements with colleagues.'],
 ['13:50','Check the space and help with arrivals according to the team plan.'],
 ['14:00','Help welcome children and introduce the afternoon.'],
 ['14:10','Prepare food or support outdoor play according to the team plan.'],
 ['14:45','Welcome children at their group’s meal time and create a calm atmosphere.'],
 ['15:00–15:40','Support food and conversation. Help children find a seat and good company.'],
 ['15:40','Tidy with the children and help them move outside.'],
 ['16:00','Check tables and equipment and help the team where needed.'],
 ['16:15','Finish tidying and share information for tomorrow.'],
 ['16:30','Finish according to the team plan and agreed procedure.'] ] },
 yngstu: { illustration: "A guide sits on a soft rug with two young children. One looks at a picture book and the other stacks wooden blocks.", location: 'You can find me in Kindergarten or outside with the youngest group.', schedule: [
 ['13:30','Review the afternoon and information relevant to the youngest group.'],
 ['13:35','Prepare familiar games, materials and a quiet space.'],
 ['13:50','Coordinate the group’s arrival and handover with colleagues.'],
 ['14:00','Welcome the youngest children indoors, greet each child and introduce the afternoon.'],
 ['14:10','Support indoor play and help children find company.'],
 ['14:45','Help with outdoor clothing and accompany the group outside. Coordinate supervision with outdoor staff.'],
 ['15:00–15:40','Be available during outdoor play, support relationships and give children time to explore.'],
 ['15:50','Support shared play as the older children come outside, maintaining continuity for the youngest group.'],
 ['16:00','Help with departures and pass updates to Registration.'],
 ['16:15','Say goodbye to the last children and check the group’s belongings and spaces.'],
 ['16:30','Finish once supervision has ended or been handed over according to procedure.'] ] }
};

// Short on-board captions, in the same order as each role's full schedule.
const roleActivities = {
 skraning: [
 ['Reviewing the register.','Fer yfir barnalistann.'],['Helping set up.','Aðstoðar við undirbúning.'],['Collecting the classes.','Sækir bekkina.'],['Welcoming and checking in.','Tekur á móti og skráir inn.'],['Checking attendance.','Stemmir af mætingu.'],['Helping choose activities.','Aðstoðar við val á stöðvum.'],['Helping children settle in.','Hjálpar börnum að finna sinn stað.'],['Reconciling the register.','Stemmir af skráninguna.'],['Saying the last goodbyes.','Kveður síðustu börnin.'],['Finishing the handover.','Lýkur vakt og afhendingu.']
 ],
 fondur: [
 ['Choosing a creative project.','Velur sköpunarverkefni.'],['Preparing craft materials.','Tekur til föndurefni.'],['Collecting the classes.','Sækir bekkina.'],['Welcoming children outside.','Fylgir börnunum út.'],['Supporting outdoor play.','Styður við útileik.'],['Opening Arts & crafts.','Opnar Föndur og fjör.'],['Creating with the children.','Skapar með börnunum.'],['Tidying up together.','Gengur frá með hópnum.'],['Helping with departures.','Aðstoðar við brottför.'],['Checking the workspace.','Yfirfer vinnusvæðið.'],['Finishing the shift.','Lýkur vaktinni.']
 ],
 music: [
 ['Planning music and discovery.','Undirbýr tónlist og uppgötvanir.'],['Checking the equipment.','Yfirfer búnaðinn.'],['Collecting the classes.','Sækir bekkina.'],['Welcoming children outside.','Fylgir börnunum út.'],['Supporting outdoor play.','Styður við útileik.'],['Introducing the activity.','Kynnir verkefnið.'],['Making music and exploring.','Spilar tónlist og kannar.'],['Putting equipment away.','Gengur frá búnaði.'],['Helping with departures.','Aðstoðar við brottför.'],['Preparing for tomorrow.','Undirbýr næsta dag.'],['Finishing the shift.','Lýkur vaktinni.']
 ],
 stud: [
 ['Planning inclusive games.','Skipuleggur leik fyrir alla.'],['Preparing the play space.','Undirbýr leikrýmið.'],['Getting ready for arrivals.','Undirbýr móttökuna.'],['Welcoming children outside.','Fylgir börnunum út.'],['Connecting children through play.','Tengir börnin saman í leik.'],['Opening Active play.','Opnar Stuð.'],['Helping everyone join in.','Hjálpar öllum inn í leikinn.'],['Tidying up together.','Gengur frá með hópnum.'],['Supporting a calm finish.','Styður við róleg lok dagsins.'],['Checking the play space.','Yfirfer leikrýmið.'],['Finishing the shift.','Lýkur vaktinni.']
 ],
 uti: [
 ['Planning outdoor supervision.','Skipuleggur umsjón úti.'],['Checking the garden.','Yfirfer útisvæðið.'],['Coordinating outdoor arrivals.','Samræmir móttöku úti.'],['Welcoming children to the garden.','Tekur á móti börnum úti.'],['Supporting outdoor play.','Styður við útileik.'],['Welcoming the youngest group.','Tekur á móti yngsta hópnum.'],['Supporting play and wellbeing.','Styður við leik og líðan.'],['Welcoming everyone outside.','Tekur á móti öllum úti.'],['Coordinating departures.','Samræmir brottför.'],['Putting outdoor toys away.','Gengur frá útileikföngum.'],['Finishing the handover.','Lýkur vakt og afhendingu.']
 ],
 matur: [
 ['Reviewing dietary needs.','Fer yfir matarþarfir.'],['Preparing the dining hall.','Undirbýr matsalinn.'],['Checking the dining space.','Yfirfer aðstöðuna.'],['Welcoming the children.','Tekur á móti börnunum.'],['Preparing food and helping out.','Undirbýr mat og aðstoðar.'],['Welcoming children to eat.','Tekur á móti börnum í mat.'],['Supporting food and conversation.','Styður við mat og samveru.'],['Tidying up together.','Gengur frá með hópnum.'],['Checking tables and equipment.','Yfirfer borð og búnað.'],['Finishing the cleanup.','Lýkur frágangi.'],['Finishing the shift.','Lýkur vaktinni.']
 ],
 yngstu: [
 ['Reviewing the youngest group’s day.','Fer yfir dag yngsta hópsins.'],['Preparing familiar activities.','Undirbýr kunnuglegan leik.'],['Coordinating the handover.','Samræmir afhendingu hópsins.'],['Welcoming the youngest children.','Tekur á móti yngstu börnunum.'],['Supporting indoor play.','Styður við leik inni.'],['Helping the group get outside.','Hjálpar hópnum að komast út.'],['Playing outside with the group.','Er með hópnum í útileik.'],['Helping the groups play together.','Styður við leik hópanna saman.'],['Helping with departures.','Aðstoðar við brottför.'],['Checking belongings and spaces.','Yfirfer eigur og rými.'],['Finishing the handover.','Lýkur vakt og afhendingu.']
 ]
};
