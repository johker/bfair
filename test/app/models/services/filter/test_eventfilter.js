var _ = require('underscore');

var res = [ { event: 
     { id: '27028863',
       name: 'Peya/Soares v Hanley/Smith',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27029188',
       name: 'Flipkens v Pennetta',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-07-01T10:00:00.000Z' },
    marketCount: 10 },
  { event: 
     { id: '27028857',
       name: 'Qureshi/Rojer v Malisse/Skupski',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028858',
       name: 'Mirnyi/Tecau v Groth/Guccione',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 6 },
  { event: 
     { id: '27029070',
       name: 'Zemlja v Del Potro',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:00:00.000Z' },
    marketCount: 14 },
  { event: 
     { id: '27028373',
       name: 'Blake/Melzer v Murray/Peers',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27028855',
       name: 'Begemann/Emmrich v Huey/Inglot',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '26905150',
       name: 'US Open 2013',
       countryCode: 'US',
       timezone: 'US/Eastern',
       openDate: '2013-08-26T15:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '26990909',
       name: 'Czech Republic v Argentina',
       countryCode: 'CZ',
       timezone: 'Europe/London',
       openDate: '2013-09-13T09:00:00.000Z' },
    marketCount: 1 },
  { event: 
     { id: '27028367',
       name: 'Hanley/Chan v Farah/Jurak',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '26990910',
       name: 'Serbia v Canada',
       countryCode: 'CS',
       timezone: 'EET',
       openDate: '2013-09-13T08:00:00.000Z' },
    marketCount: 1 },
  { event: 
     { id: '27029085',
       name: 'Djokovic v Chardy',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 25 },
  { event: 
     { id: '27028735',
       name: 'Pironkova v Martic',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27028356',
       name: 'Haase/Rosolska v Marray/Watson',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029078',
       name: 'Robson v Erakovic',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029218',
       name: 'Bryan/Bryan v Marrero/Seppi',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T15:30:00.000Z' },
    marketCount: 6 },
  { event: 
     { id: '27028677',
       name: 'S Williams v Date Krumm',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T15:15:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029216',
       name: 'Bartoli v Knapp',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-07-01T10:30:00.000Z' },
    marketCount: 10 },
  { event: 
     { id: '26923703',
       name: 'A Murray Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029090',
       name: 'F Lopez v Haas',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 14 },
  { event: 
     { id: '27029224',
       name: 'Inglot/Konta v Almagro/Torro Flor',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '26950508',
       name: 'Serena Williams Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-21T18:00:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '27029235',
       name: 'Set 02',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 13 },
  { event: 
     { id: '27028693',
       name: 'Anderson v Berdych',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:30:00.000Z' },
    marketCount: 16 },
  { event: 
     { id: '27029234',
       name: 'Lepchenko/Zheng v Petrova/Srebotnik',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029233',
       name: 'Set 01',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 13 },
  { event: 
     { id: '27028694',
       name: 'Zakopalova v Li',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:00:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029232',
       name: 'Flipkens/Rybarikova v Jankovic/Lucic Baroni',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029238',
       name: 'Set 05',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 13 },
  { event: 
     { id: '27029237',
       name: 'Set 04',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 13 },
  { event: 
     { id: '27029236',
       name: 'Set 03',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 13 },
  { event: 
     { id: '27028807',
       name: 'Sijsling v Dodig',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 14 },
  { event: 
     { id: '27029243',
       name: 'Gonzalez/Lipsky v Levine/Pospisil',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '27028149',
       name: 'Puig v Birnerova',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 9 },
  { event: 
     { id: '27029241',
       name: 'Kubot/Matkowski v Matosevic/Moser',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:15:00.000Z' },
    marketCount: 6 },
  { event: 
     { id: '27029240',
       name: 'Makarova/Vesnina v McHale/Paszek',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029245',
       name: 'Blake/Vekic v Levinsky/Dekmeijere',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029244',
       name: 'Pennetta/Petkovic v Huber/Mirza',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028527',
       name: 'Lisicki v Stosur',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:30:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '26923740',
       name: 'ATP Season Head To Heads',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029133',
       name: 'Riske v Kanepi',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '26928887',
       name: 'Fed Cup 2013',
       timezone: 'Europe/London',
       openDate: '2013-02-09T08:00:00.000Z' },
    marketCount: 1 },
  { event: 
     { id: '27028786',
       name: 'Gasquet v Tomic',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 14 },
  { event: 
     { id: '27028789',
       name: 'A Radwanska v Keys',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:45:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029260',
       name: 'Emmrich/Goerges v Cabal/Jovanovski',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029259',
       name: 'Knowle/Zhang v Peers/Barty',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029258',
       name: 'Cornet/Parmentier v Goerges/Z Strycova',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:45:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '26928875',
       name: 'Davis Cup 2013',
       timezone: 'Europe/London',
       openDate: '2013-02-01T08:00:00.000Z' },
    marketCount: 1 },
  { event: 
     { id: '27029255',
       name: 'Aoyama/Scheepers v Olaru/Savchuk',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T13:15:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27029254',
       name: 'Monroe/Stadler v Bhupathi/Knowle',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '26923724',
       name: 'Nadal Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27022541',
       name: 'French Open 2014',
       countryCode: 'FR',
       timezone: 'Europe/London',
       openDate: '2014-05-25T10:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '26923723',
       name: 'Federer Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '26923586',
       name: 'Tennis Specials 2013',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 10 },
  { event: 
     { id: '26923722',
       name: 'Djokovic Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27028882',
       name: 'Foretz Gacon/Hrdinova v Hsieh/Peng',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T11:45:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028887',
       name: 'R Ram/Schiavone v Klaasen/An Rodionova',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27028886',
       name: 'A Ram/Spears v Bracciali/Voskoboeva',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27026582',
       name: 'Player Stage of Elimination',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028884',
       name: 'Groenefeld/Peschke v Raymond/Robson',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-07-01T10:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028889',
       name: 'Cerretani/Barthel v Brunstrom/Marosi',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028752',
       name: 'Nishikori v Seppi',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 7 },
  { event: 
     { id: '27028888',
       name: 'Fognini/Pennetta v Delgado/Moore',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028351',
       name: 'Mertinak/Uhlirova v Butorac/Cornet',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T15:15:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028866',
       name: 'Dimitrov/Nielsen v Benneteau/Zimonjic',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:30:00.000Z' },
    marketCount: 6 },
  { event: 
     { id: '27029172',
       name: 'Ferrer v Dolgopolov',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:00:00.000Z' },
    marketCount: 14 },
  { event: 
     { id: '27028871',
       name: 'Bouchard/Martic v Black/Erakovic',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T15:45:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028327',
       name: 'Stephens v Cetkovska',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 7 },
  { event: 
     { id: '27028869',
       name: 'Brands/Rosol v Bopanna/Roger Vasselin',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '27026567',
       name: 'Quarter Winners',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27027252',
       name: 'Wimbledon Womens 2013',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '27029182',
       name: 'Janowicz v Melzer',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-07-01T10:30:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27029044',
       name: 'Wimbledon Specials 2013',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-28T11:43:44.000Z' },
    marketCount: 1 },
  { event: 
     { id: '27026571',
       name: 'Quarter Winners',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27026434',
       name: 'Player Stage of Elimination',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '27028736',
       name: 'Vinci v Cibulkova',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:00:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '27027251',
       name: 'Wimbledon Mens 2013',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-24T10:30:00.000Z' },
    marketCount: 11 } ]
[ { event: 
     { id: '27028373',
       name: 'Blake/Melzer v Murray/Peers',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T10:30:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27029085',
       name: 'Djokovic v Chardy',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:45:00.000Z' },
    marketCount: 25 },
  { event: 
     { id: '27028677',
       name: 'S Williams v Date Krumm',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T15:15:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '26923703',
       name: 'A Murray Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 4 },
  { event: 
     { id: '26950508',
       name: 'Serena Williams Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-21T18:00:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '27028789',
       name: 'A Radwanska v Keys',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T12:45:00.000Z' },
    marketCount: 12 },
  { event: 
     { id: '26923724',
       name: 'Nadal Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '26923723',
       name: 'Federer Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 3 },
  { event: 
     { id: '26923722',
       name: 'Djokovic Specials',
       timezone: 'Europe/London',
       openDate: '2013-01-01T00:00:00.000Z' },
    marketCount: 2 },
  { event: 
     { id: '27029172',
       name: 'Ferrer v Dolgopolov',
       countryCode: 'GB',
       timezone: 'Europe/London',
       openDate: '2013-06-29T14:00:00.000Z' },
    marketCount: 14 } ]





 var keys = [
 		'Djokovic', 'Murray', 'Federer', 'Ferrer', 'Nadal', 'Berdych', 'Tsonga', 'Del Potro', 'Gasquet', 'Wawrinka', 'Haas', 'Cilic', 'Nishikori', 'Tipsarevic', 'Raonic', 'Almagro', 'Simon', 'Kohlschreiber', 'Querrey', 'Monaco',
 		'Williams', 'Azarenka', 'Sharapova', 'Radwanska', 'Errani', 'Li', 'Kerber', 'Kvitova', 'Wozniacki', 'Kirilenko', 'Vinci', 'Ivanovic', 'Petrova', 'Stosur', 'Bartoli', 'Jankovic', 'Stephens', 'Cibulkova', 'Suarez Navarro', 'Flipkens'
 	]
 	
 	var testkeys = ['Raymond', 'Zemlja']; 
 	

 	/*
var questions = [
    {question: "what is your name"},
    {question: "How old are you"},
    {question: "whats is your mothers name"},
    {question: "where do work/or study"},
];

var questions2 = [
     { event: {question: "what is your name", name: 'Wimbledon Mens 2013'}, a:'b'},
     { event:{question: "How old are you", name: 'Wimbledon Mens 2013'}, a:'b'},
     { event:{question: "whats is your mothers name", name: 'Wimbledon Mens 2013'}, a:'b'},
     { event:{question: "where do work/or study", name: 'Wimbledon Mens 2013'}, a:'b'},
];

var jsonf = _.filter(questions2, function(obj) {
    return ~obj.event.name.toLowerCase().indexOf("mens");
});

console.log(jsonf); 


var jsonf2 = _.filter(questions2, function(obj) {
    return ~obj.event.question.toLowerCase().indexOf("how");
});

console.log(jsonf);

*/ 

 keys = [ 'Djokovic',
  'Murray',
  'Federer',
  'Ferrer',
  'Nadal',
  'Williams',
  'Azarenka',
  'Sharapova',
  'Radwanska',
  'Errani' ]


var resf = _.filter(res, function(obj) {
	var ret; 
	for(var i in keys) {
		ret = ret || ~obj.event.name.toLowerCase().indexOf(testkeys[i].toLowerCase()); 
	}
	return ret; 	
});


 console.log(resf); 