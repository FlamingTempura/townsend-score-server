const fs = require('fs');
const readline = require('readline');
const http = require('http');

const LSOA_DATA = 'PCD11_OA11_LSOA11_MSOA11_LAD11_EW_LU_aligned_v2.csv';
const TOWNSEND_DATA = 'Scores- 2011 UK LSOA.csv';
const HOST = 'localhost';
const PORT = 3420;

const getKey = postcode => postcode.slice(0, 4);

const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // cors
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST,PUT,GET,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Range, Accept, Origin, Content-Type');
	res.setHeader('Access-Control-Expose-Headers', 'ETag, Content-Disposition');
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}
	let postcode = req.url.slice(1).toUpperCase();
	if (postcode.length < 3 || postcode.length > 8) {
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.end('{ "error": "invalid request" }');
		return;
	}
	let lsoa = await lookupLSOA(postcode),
		townsend = await lookupTownsend(lsoa);
	console.log(`Postcode ${postcode} is in LSOA ${lsoa} with townsend score of ${townsend}`) ;
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ postcode, lsoa, townsend }));
});

server.on('listening', () => console.log(`Listening on http://${HOST}:${PORT}/[postcode]`));

const lsoaIndex = new Promise(async resolve => {
	console.log('building postcode index... (this can take a while)');
	let index = {},
		input = fs.createReadStream(LSOA_DATA),
		rl = readline.createInterface({ input, crlfDelay: Infinity }), // crlfDelay option to recognize all instances of CR LF ('\r\n')
		currPos = 0;
	for await (const line of rl) {
		if (currPos > 0) { // ignore header line
			let key = getKey(line.slice(1, 7).replace(/\s+/g, ''));
			if (!index[key]) {
				index[key] = currPos;
			}
		}
		currPos += line.length + 2; // add 2 for \r\n
	}
	console.log('done');
	server.listen(PORT, HOST);
	resolve(index);
});

const csvParse = line => {
	return line.replace(/"([^"]*)"/g, (m, val) => val.replace(/,/g, '@@')) // temporarily replace commas in quoted values
		.split(',')
		.map(val => val.replace(/@@/g, ','));
};

const lookupTownsend = async lsoa => {
	let input = fs.createReadStream(TOWNSEND_DATA),
		rl = readline.createInterface({ input, crlfDelay: Infinity });
	for await (const line of rl) {
		let row = csvParse(line);
		if (row[2] === lsoa) {
			return Number(row[3]);
		}
	}
};

const lookupLSOA = async postcode => {
	postcode = postcode.replace(/\s+/, '').toUpperCase();
	let index = await lsoaIndex,
		key = getKey(postcode),
		input = fs.createReadStream(LSOA_DATA, { start: index[key] }),
		rl = readline.createInterface({ input, crlfDelay: Infinity });
	for await (const line of rl) {
		let check = line.slice(1, 8).replace(/\s+/, '');
		if (check === postcode) { 
			return csvParse(line)[4];
		}
	}
};

module.exports = server;
