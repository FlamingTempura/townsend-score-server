const tap = require('tap');
const http = require('http');
const server = require('./townsend');

const examples = [
	{ postcode: 'L199AU', lsoa: 'Liverpool 053E', townsend: -2.812346042 },
	{ postcode: 'E126HA', lsoa: 'Newham 005B', townsend: 6.422969437 },
	{ postcode: 'M90NF', lsoa: 'Manchester 001C', townsend: 2.05448624 },
	{ postcode: 'L342QG', lsoa: 'St. Helens 018C', townsend: -3.212450037 },
	{ postcode: 'WF83HN', lsoa: 'Wakefield 041C', townsend: -1.689442217 },
	{ postcode: 'TF42FT', lsoa: 'Telford and Wrekin 016B', townsend: -3.21933413 },
	{ postcode: 'RG423SU', lsoa: 'Bracknell Forest 003D', townsend: -4.531423587 },
	{ postcode: 'HP180QH', lsoa: 'Aylesbury Vale 010D', townsend: -3.955012697 },
	{ postcode: 'PL303HA', lsoa: 'Cornwall 007B', townsend: -2.313496309 },
	{ postcode: 'GU140DX', lsoa: 'Rushmoor 006D', townsend: -1.779580683 },
	{ postcode: 'PR21BN', lsoa: 'Preston 010D', townsend: -0.405920973 },
	{ postcode: 'BA77JN', lsoa: 'South Somerset 002C', townsend: -3.816694166 }
];

const request = async (url) => new Promise(resolve => {
	http.get(url, async res => {
		res.setEncoding('utf8');
		let body = '';
		for await (const chunk of res) { body += chunk; }
		resolve(body ? JSON.parse(body) : null);
	});
});

tap.test(async t => {
	await new Promise(resolve => server.on('listening', resolve));
	console.time('COMPLETE');
	for (let example of examples) {
		let body = await request(`http://localhost:3420/${example.postcode}`);
		t.equal(body.postcode, example.postcode);
		t.equal(body.lsoa, example.lsoa);
		t.equal(body.townsend, example.townsend);
	}
	console.timeEnd('COMPLETE');
	server.close();
});