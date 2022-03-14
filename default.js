employees = {
  1: 'Bill, Engineer',
  2: 'Joe, HR',
  3: 'Sally, Engineer',
  4: 'Richard, Business',
  6: 'Tom, Engineer',
};

friendships = ['1, 2', '1, 3', '3, 4'];

// find how many friends

function findRelationships(employees, friendships) {
  const friends = Object.keys(employees);
  const total = {};
  
  friends.forEach(employee => {
    friendships.forEach(friend => {
      // console.log('employ:', employee, ' friend:', friend);
      if (friend.includes(employee)) {
        const splitFriend = friend.split(',');
        let realFriend = splitFriend.pop();
        console.log('realFriend', realFriend);
        console.log('split:', splitFriend);
        if (realFriend === employee) {
          realFriend = splitFriend.toString();
        }
        console.log('final:', realFriend)
        if (!total[employee]) {
          total[employee] = [realFriend]
          console.log('first time:', total[employee], friend);
        } else {
          total[employee].push(realFriend)
          console.log('next time:', total[employee], realFriend);
        }
      }
    })
    if (!total[employee]) {
      total[employee] = "none";
    }
  })
  return total;
}


console.log(findRelationships(employees, friendships))
