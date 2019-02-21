const fs = require('fs');
const readline = require('readline');
const http = require('http');

const csvParse = line => {
	return line.replace(/"([^"]*)"/g, (m, val) => val.replace(/,/g, '@@')) // temporarily replace commas in quoted values
		.split(',')
		.map(val => val.replace(/@@/g, ','));
};

const lookupTownsend = async lsoa => {
	let input = fs.createReadStream('Scores- 2011 UK LSOA.csv'),
		rl = readline.createInterface({ input, crlfDelay: Infinity }); // crlfDelay option to recognize all instances of CR LF ('\r\n')
	for await (const line of rl) {
		let row = csvParse(line);
		if (row[2] === lsoa) {
			return Number(row[3]);
		}
	}
};

const lookupLSOA = async postcode => {
	postcode = postcode.replace(/\s/, '');
	let input = fs.createReadStream('PCD11_OA11_LSOA11_MSOA11_LAD11_EW_LU_aligned_v2.csv'),
		rl = readline.createInterface({ input, crlfDelay: Infinity }); // crlfDelay option to recognize all instances of CR LF ('\r\n')
	for await (const line of rl) {
		let check = line.slice(1, 8).replace(/\s/, '');
		if (check === postcode) { 
			return csvParse(line)[4];
		}
	}
};

http.createServer(async (req, res) => {
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
	})
	.listen(3420, 'localhost');
