module.exports = {
  capetalize : (word)=>{
    if(!word)return undefined
    word = word.toLowerCase();
    word = word[0].toUpperCase() + word.slice(1);
    return word;
  },
  reformCombination:(combination,requesterId)=>{
    const {Likers,Category,User, ...details} = combination.dataValues ;
    let isLiked = false; 
    Likers.forEach(liker=>{
      if(liker.id === requesterId)isLiked = true;
    })
    combination.dataValues = {
      ...details, 
      category:Category?.name,
      likes : Likers.length,
      user:User,
      isLiked : isLiked
    }
    return combination;
  },
  reformTrack:(track,requesterId)=>{
    const {Likers,User, Category, ...details} = track.dataValues; 
    let isLiked = false;
    Likers.forEach(liker=>{
      if(liker.id === requesterId)isLiked = true
      
    });
    console.log(requesterId);
    track.dataValues = {
      ...details, 
      category:Category?.name,
      likes : Likers.length,
      user:User,
      isLiked : isLiked
    }
    return track;
  }
}