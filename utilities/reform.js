module.exports = {
  capetalize : (word)=>{
    if(!word)return undefined
    word = word.toLowerCase();
    word = word[0].toUpperCase() + word.slice(1);
    return word;
  }
}