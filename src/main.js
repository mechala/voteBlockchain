const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey =ec.keyFromPrivate('01cd692adf52176334db41fa07e47cac9cc749dde6232b51ff549721421eba88');
const myID = myKey.getPublic('hex');
const {Blockchain,Vote} = require("./blockchain");
let DependeCoin53= new Blockchain();



//Prueba basica de validez
//console.log(JSON.stringify(DependeCoin53,null,4));
//console.log("Is blockchain valid? "+ DependeCoin53.isChainValid());

//DependeCoin53.chain[1].data= {amount:100};
//DependeCoin53.chain[1].hash=DependeCoin53.chain[1].calculateHash();
//console.log("Is blockchain valid? "+ DependeCoin53.isChainValid());

//Prueba de trabajo
//console.log("Mining block one...");
//DependeCoin53.addBlock(new Block(1,"04/22/2019",(amount=4)));
//console.log("Mining block two...");
//DependeCoin53.addBlock(new Block(2,"14/22/2019",(amount=10)));

DependeCoin53.addVote(new Vote(myID,2));
DependeCoin53.addVote(new Vote("Pedro",2));
DependeCoin53.addVote(new Vote("Juancho",1));

console.log("\n starting the miner...");
DependeCoin53.minePendingVotes("Maquina#1");

console.log("\n Numero de votos del candidato "+2+": "+DependeCoin53.getNumberOfVotes(2));

DependeCoin53.addVote(new Vote("Jesus",2));
DependeCoin53.addVote(new Vote("Alonso",3));
DependeCoin53.addVote(new Vote("Carlos",1));
console.log("\n starting the miner...");
DependeCoin53.minePendingVotes("Maquina#1");
console.log("\n Numero de votos del candidato "+2+": "+DependeCoin53.getNumberOfVotes(2));
console.log(JSON.stringify(DependeCoin53,null,4));