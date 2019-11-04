
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class Vote{
    constructor(voterAddress,candidateIndex){
        this.voterAddress=voterAddress;
        this.candidateIndex= candidateIndex;
    }
    calculateHash(){
        return SHA256(this.voterAddress+this.candidateIndex).toString();
    }

    singVote(singInKey){
        if(singInKey.getPublic('hex')!== this.voterAddress){
            throw new Error('You cannot vote for someone who is not yourself');
        }
        const hashVote = this.calculateHash();
        const signature = singInKey.sing(hashVote,'base64');
        this.signature = signature.toDER('hex');
    }
    isValid(){
      if(this.signature || this.signature.length==0){
          throw new Error('No signature for the transaction');
        }
        
        const publicKey = ec.keyFromPublic(this.voterAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}
class Block{
    constructor(timestamp,votes,previousHash=""){
        
        this.timestamp=timestamp;
        this.votes=votes;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;

    }
    calculateHash(){       
        return SHA256(this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("Block mined:"+ this.hash);
    }
    hasValidVotes(){
        for(const vt of this.votes){
            if (!vt.isValid()) {
                return false;
                
            }
        }
        return true;
    }

}

class Blockchain{
    constructor(){
        this.chain= [this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingVotes = [];

    }
    createGenesisBlock(){
return new Block("01/01/2019","Genesis block","0");

    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    minePendingVotes(minerAddress){
        let block = new Block(Date.now(),this.pendingVotes,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log("Block Succesfully mined!");
        this.chain.push(block);
        this.pendingVotes=[
            new Vote(null,null)
        ];
        
    }
    addVote(vote){
        if (!vote.voterAddress||!vote.candidateIndex) {
            throw new Error('El voto debe tener votante y candidato por el cual votar.');
        }
        if (!vote.isValid) {
            throw new Error('El voto debe ser valido');
        }

    this.pendingVotes.push(vote);

    }
    getNumberOfVotes(candidateIndex){
        let NumberofVotes=0;
        for(const block of this.chain){
            for(const vote of block.votes){
                if(vote.candidateIndex== candidateIndex){
                    NumberofVotes++;
                }
            }
        }
        return NumberofVotes;
    }
    
    isChainValid(){
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock= this.chain[index-1];

            if (!currentBlock.hasValidVotes()) {
                console.log('Tiene votos invalidos');
                return false;
            }
            if(currentBlock.hash!==currentBlock.calculateHash()){
                console.log("No es el mismo que el calculado");
                return false;

            }
            if (currentBlock.previousHash!== previousBlock.hash ) {
                console.log("No es el mismo que el anterior");
            return false;    
            }
            
        }
        return true;
    }

    

}
module.exports.Blockchain= Blockchain;

module.exports.Vote=Vote;