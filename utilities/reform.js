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
      category:Category?.name,
      likes : Likers.length,
      owner:User.dataValues,
      isLiked : isLiked,
      ...details, 
    }
    return combination;
  },
  reformTrack:(track,requesterId)=>{
    const {Likers,User, Category, ...details} = track.dataValues; 
    let isLiked = false;
    Likers.forEach(liker=>{
      if(liker.id === requesterId)isLiked = true
      
    });
    track.dataValues = {
      category:Category?.name,
      likes : Likers.length,
      owner:User.dataValues,
      isLiked : isLiked,
      ...details
    }
    return track;
  },
  reformUser:(user,requesterId)=>{
    const {Followers,Categories, ...details} = user.dataValues; 
    let isFollowed = false;
    Followers.forEach(follower=>{
      if(follower.id === requesterId)isFollowed = true
      
    });
    user.dataValues = {
      followersCount : Followers.length,
      isFollowed : isFollowed,
      categories : Categories,
      ...details
    }
    return user;
  }
}