const now = require('performance-now');
const sumacero = require('./sumacero');
const spawn = require('child_process').spawn;

const OKTests = [
	[-1, 1],
	[-97364, -71561, -69336, 19675, 71561, 97863],
	[-53974, -39140, -36561, -23935, -15680, 0],
	[-2, 2, 3],
	[0],
	[-3, 1, 2],
	[-5, -3, -1, 2, 4, 6],
	[-98634, -86888, -48841, -40483, 2612, 9225, 17848, 71967, 84319, 88875],
	[-97162, -95761, -94672, -87254, -57207, -22163, -20207, -1753, 11646, 13652, 14572, 30580, 52502, 64282, 74896, 83730, 89889, 92200],
	[-93976, -93807, -64604, -59939, -44394, -36454, -34635, -16483, 267, 3245, 8031, 10622, 44815, 46829, 61689, 65756, 69220, 70121],
	[-92474, -61685, -55348, -42019, -35902, -7815, -5579, 4490, 14778, 19399, 34202, 46624, 55800, 57719, 60260, 71511, 75665, 82754],
	[-85029, -84549, -82646, -80493, -73373, -57478, -56711, -42456, -38923, -29277, -3685, -3164, 26863, 29890, 37187, 46607, 69300, 84808],
	[-87565, -71009, -49312, -47554, -27197, 905, 2839, 8657, 14622, 32217, 35567, 38470, 46885, 59236, 64704, 82944, 86902, 90487],
];

const KOTests = [
	[1, 2, 3],
	[],
	[-83314, -82838, -80120, -63468, -62478, -59378, -56958, -50061, -34791, -32264, -21928, -14988, 23767, 24417, 26403, 26511, 36399, 78055],
	[-92953, -91613, -89733, -50673, -16067, -9172, 8852, 30883, 46690, 46968, 56772, 58703, 59150, 78476, 84413, 90106, 94777, 95148],
	[-94624, -86776, -85833, -80822, -71902, -54562, -38638, -26483, -20207, -1290, 12414, 12627, 19509, 30894, 32505, 46825, 50321, 69294],
	[-83964, -81834, -78386, -70497, -69357, -61867, -49127, -47916, -38361, -35772, -29803, -15343, 6918, 19662, 44614, 66049, 93789, 95405],
	[-68808, -58968, -45958, -36013, -32810, -28726, -13488, 3986, 26342, 29245, 30686, 47966, 58352, 68610, 74533, 77939, 80520, 87195],
];

function createSerie(n) {
  return Array(n).fill().map((e,i)=>++i);
}

test('Should found a zero group on this series', () => {
  for (let x = 0; x < OKTests.length; x++) {
    expect(sumacero(OKTests[x])).toBe(true);
  }
});

test('Should not found a zero group on this series', () => {
  for (let x = 0; x < KOTests.length; x++) {
    expect(sumacero(KOTests[x])).toBe(false);
  }
});

const maxTime = 300 * 1000;
const serieLength = 27;
test(`Check if it can solve a serie of ${serieLength} numbers in less than 300s`, () => {
  const t1 = now();
  sumacero(createSerie(serieLength));
  const t2 = now();
  const time = t2 - t1;
  expect(time).toBeLessThanOrEqual(maxTime);
});

const concurrentSerieLength = 40;
test(`Check if it can solve a serie of ${concurrentSerieLength} numbers with concurrency in less than 300s`, (done) => {
  const t1 = now();
  const child = spawn('node', ['sumacero-cluster.js'].concat(createSerie(concurrentSerieLength)));
  child.stdout.on('data', (data) => {
    const t2 = now();
    const time = t2 - t1;
    expect(time).toBeLessThanOrEqual(maxTime);
    child.kill();
    done();
  });
}, 500000);
