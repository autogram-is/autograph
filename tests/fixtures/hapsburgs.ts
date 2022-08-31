import { JsonGraph } from '../../source/json-graph/index.js';
import { Dictionary } from '../../source/index.js';
import { Scion, Parent } from './scion.js';

const json = new JsonGraph();

const haps = {
  rudolfi: new Scion('Rudolf I', 1218, 1291, 'of Germany'),
  alberti: new Scion('Albert I', 1255, 1308, 'of Germany'),
  hartmann: new Scion('Hartmann', 1263, 1281),
  rudolfii: new Scion('Rudolf II', 1270, 1290, 'Duke of Austria'),
  rudolfib: new Scion('Rudolf I', 1281, 1307, 'of Bohemia'),
  frederick: new Scion('Frederick', 1289, 1330, 'the Fair'),
  leopoldi: new Scion('Leopold I', 1290, 1326, 'Duke of Austria'),
  albertii: new Scion('Albert II', 1298, 1358, 'Duke of Austria'),
  henry: new Scion('Henry', 1299, 1327, 'the Friendly'),
  otto: new Scion('Otto', 1301, 1339, 'Duke of Austria'),
  john: new Scion('John', 1290, 1312, 'Parricida'),
  rudolfiv: new Scion('Rudolf IV', 1339, 1365, 'Duke of Austria'),
  frederickiii: new Scion('Frederick III', 1347, 1362, 'Duke of Austria'),
  albertiii: new Scion('Albert III', 1349, 1395, 'Duke of Austria'),
  leopoldiii: new Scion('Leopold III', 1351, 1386, 'Duke of Austria'),
  frederickii: new Scion('Frederick II', 1327, 1344, 'Duke of Austria'),
  leopoldii: new Scion('Leopold II', 1328, 1344, 'Duke of Austria'),
  albertiv: new Scion('Albert IV', 1377, 1404, 'Duke of Austria'),
  william: new Scion('William', 1370, 1406, 'Duke of Austria'),
  leopoldiv: new Scion('Leopold IV', 1371, 1411, 'Duke of Austria'),
  ernest: new Scion('Ernest', 1377, 1424, 'Duke of Austria'),
  frederickiv: new Scion('Frederick IV', 1382, 1439, 'Duke of Austria'),
  albertiig: new Scion('Albert II', 1397, 1439, 'of Germany'),
  frederickiiih: new Scion('Frederick III', 1415, 1493, 'Holy Roman Emperor'),
  albertvi: new Scion('Albert VI', 1418, 1463, 'Archduke of Austria'),
  sigismund: new Scion('Sigismund', 1427, 1496, 'Archduke of Austria'),
  ladislaus: new Scion('Ladislaus', 1440, 1457, 'the Posthumous'),
  maximiliani: new Scion('Maximilian I', 1459, 1519, 'Holy Roman Emperor'),
  philipi: new Scion('Philip I', 1478, 1506, 'of Castile'),
  charlesv: new Scion('Charles V', 1500, 1558, 'Holy Roman Emperor'),
  ferdinandi: new Scion('Ferdinand I', 1503, 1564, 'Holy Roman Emperor'),
  philipii: new Scion('Philip II', 1527, 1598, 'of Spain'),
  maximilianii: new Scion('Maximilian II', 1527, 1576, 'Holy Roman Emperor'),
  ferdinandii: new Scion('Ferdinand II', 1529, 1595, 'Archduke of Austria'),
  charlesii: new Scion('Charles II', 1540, 1590, 'Archduke of Austria'),
  carlos: new Scion('Carlos', 1545, 1568, 'Prince of Asturias'),
  philipiii: new Scion('Philip III', 1578, 1621, 'of Spain'),
  rudolfiih: new Scion('Rudolf II', 1552, 1612, 'Holy Roman Emperor'),
  ernesta: new Scion('Ernest', 1553, 1595, 'of Austria'),
  matthias: new Scion('Matthias', 1557, 1619, 'Holy Roman Emperor'),
  maximilianiii: new Scion('Maximilian III', 1558, 1618, 'Archduke of Austria'),
  albertvii: new Scion('Albert VII', 1559, 1621, 'Archduke of Austria'),
  charles: new Scion('Charles', 1560, 1618, 'Margrave of Burgau'),
  ferdinandiih: new Scion('Ferdinand II', 1578, 1637, 'Holy Roman Emperor'),
  maximilianernest: new Scion('Maximilian Ernest', 1583, 1616, 'of Austria'),
  leopoldv: new Scion('Leopold V', 1586, 1632, 'Archduke of Austria'),
  charlesph: new Scion('Charles', 1590, 1624, 'of Austria, the Posthumous'),
  philipiv: new Scion('Philip IV', 1605, 1665, 'of Spain'),
  charlesa: new Scion('Charles', 1607, 1632, 'of Austria'),
  ferdinand: new Scion('Ferdinand', 1609 / 10, 1641, 'of Austria'),
  ferdinandiii: new Scion('Ferdinand III', 1608, 1657, 'Holy Roman Emperor'),
  leopoldwilhelm: new Scion('Leopold Wilhelm', 1614, 1662, 'of Austria'),
  ferdinandcharles: new Scion(
    'Ferdinand Charles',
    1628,
    1662,
    'Archduke of Austria',
  ),
  sigismundfrancis: new Scion(
    'Sigismund Francis',
    1630,
    1665,
    'Archduke of Austria',
  ),
  balthasarcharles: new Scion(
    'Balthasar Charles',
    1629,
    1646,
    'Prince of Asturias',
  ),
  charlesiis: new Scion('Charles II', 1661, 1700, 'of Spain'),
  ferdinandiv: new Scion('Ferdinand IV', 1633, 1654, 'King of the Romans'),
  leopoldih: new Scion('Leopold I', 1640, 1705, 'Holy Roman Emperor'),
  charlesjoseph: new Scion('Charles Joseph', 1649, 1664, 'of Austria'),
  josephi: new Scion('Joseph I', 1678, 1711, 'Holy Roman Emperor'),
  charlesvi: new Scion('Charles VI', 1685, 1740, 'Holy Roman Emperor'),
};

const parentage: Parent[] = [
  new Parent(haps.rudolfi, haps.alberti),
  new Parent(haps.rudolfi, haps.hartmann),
  new Parent(haps.rudolfi, haps.rudolfii),

  new Parent(haps.alberti, haps.rudolfib),
  new Parent(haps.alberti, haps.frederick),
  new Parent(haps.alberti, haps.leopoldi),
  new Parent(haps.alberti, haps.albertii),
  new Parent(haps.alberti, haps.henry),
  new Parent(haps.alberti, haps.otto),

  new Parent(haps.rudolfii, haps.john),

  new Parent(haps.albertii, haps.rudolfiv),
  new Parent(haps.albertii, haps.frederickiii),
  new Parent(haps.albertii, haps.albertiii),
  new Parent(haps.albertii, haps.leopoldiii),

  new Parent(haps.otto, haps.frederickii),
  new Parent(haps.otto, haps.leopoldii),

  new Parent(haps.albertiii, haps.albertiv),

  new Parent(haps.leopoldiii, haps.william),
  new Parent(haps.leopoldiii, haps.leopoldiv),
  new Parent(haps.leopoldiii, haps.ernest),
  new Parent(haps.leopoldiii, haps.frederickiv),

  new Parent(haps.albertiv, haps.albertiig),

  new Parent(haps.ernest, haps.frederickiiih),
  new Parent(haps.ernest, haps.albertvi),

  new Parent(haps.frederickiv, haps.sigismund),

  new Parent(haps.albertiig, haps.ladislaus),

  new Parent(haps.frederickiiih, haps.maximiliani),

  new Parent(haps.maximiliani, haps.philipi),

  new Parent(haps.philipi, haps.charlesv),
  new Parent(haps.philipi, haps.ferdinandi),

  new Parent(haps.charlesv, haps.philipii),

  new Parent(haps.ferdinandi, haps.maximilianii),
  new Parent(haps.ferdinandi, haps.ferdinandii),
  new Parent(haps.ferdinandi, haps.charlesii),

  new Parent(haps.philipii, haps.carlos),
  new Parent(haps.philipii, haps.philipiii),

  new Parent(haps.maximilianii, haps.rudolfiih),
  new Parent(haps.maximilianii, haps.ernesta),
  new Parent(haps.maximilianii, haps.matthias),
  new Parent(haps.maximilianii, haps.maximilianiii),
  new Parent(haps.maximilianii, haps.albertvii),

  new Parent(haps.ferdinandii, haps.charles),

  new Parent(haps.philipiii, haps.ferdinandiih),
  new Parent(haps.philipiii, haps.leopoldv),
  new Parent(haps.philipiii, haps.charlesa),

  new Parent(haps.ferdinandiih, haps.ferdinandiii),
  new Parent(haps.ferdinandiih, haps.leopoldwilhelm),

  new Parent(haps.leopoldv, haps.ferdinandcharles),
  new Parent(haps.leopoldv, haps.sigismundfrancis),

  new Parent(haps.philipiv, haps.balthasarcharles),
  new Parent(haps.philipiv, haps.charlesiis),

  new Parent(haps.ferdinandiii, haps.ferdinandiv),
  new Parent(haps.ferdinandiii, haps.leopoldih),
  new Parent(haps.ferdinandiii, haps.charlesjoseph),

  new Parent(haps.leopoldih, haps.josephi),
  new Parent(haps.leopoldih, haps.charlesvi),
];

json.add([...Object.values(haps), ...parentage]);
json.save('./hapsburgs.ndjson');
