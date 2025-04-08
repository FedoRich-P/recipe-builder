function findChampions(statistics) {
  const totalDays = statistics.length
  const userParticipation = {}
  const userSteps = {}

  /**
   *
   * const statistics1 = [
   [{ userId: 1, steps: 1000 }, { userId: 2, steps: 1500 }],
   [{ userId: 2, steps: 1000 }]
   ];
   */
  for (let day of statistics) {
    const usersInDay = new Set()

    for (let stat of day) {
      const { userId, steps } = stat

      usersInDay.add(userId)

      if (userSteps[userId] !== undefined) {
        userSteps[userId] += steps
      } else {
        userSteps[userId] = steps
      }
    }

    for (let userId of usersInDay) {
      if (userParticipation[userId]) {
        userParticipation[userId] += 1
      } else {
        userParticipation[userId] = 1
      }
    }
  }

  const eligibleUsers = Object.keys(userParticipation).filter(userId => userParticipation[userId] === totalDays)

  if (eligibleUsers.length === 0) {
    return {userId: [], steps: 0}
  }

  let maxSteps = 0
  eligibleUsers.forEach(userId => {
    maxSteps = Math.max(maxSteps, userSteps[userId])
  })

  const userIds = eligibleUsers.filter(userId => userSteps[userId] === maxSteps)

  return {
    userIds,
    steps: maxSteps
  }
}

// Примеры ввода и вывода
const statistics1 = [
  [{ userId: 1, steps: 1000 }, { userId: 2, steps: 1500 }],
  [{ userId: 2, steps: 1000 }]
];
console.log(findChampions(statistics1)); // { userIds: [2], steps: 2500 }

const statistics2 = [
  [{ userId: 1, steps: 2000 }, { userId: 2, steps: 1500 }],
  [{ userId: 2, steps: 4000 }, { userId: 1, steps: 3500 }]
];
console.log(findChampions(statistics2)); // { userIds: [1, 2], steps: 5500 }




/**
 * Цель этого упражнения — преобразовать строку в новую строку, где каждый символ в новой строке —
 * это "(", если этот символ встречается в исходной строке только один раз, или ")", если этот символ
 *  встречается в исходной строке более одного раза.
 * Игнорируйте регистр букв при определении того, является ли символ дубликатом.
 *
 */
/**
 * Examples:
 * "din"      =>  "((("
 "recede"   =>  "()()()"
 "Success"  =>  ")())())"
 "(( @"     =>  "))(("
 */

function duplicateEncode(word) {
  const lowerWord = word.toLowerCase();
  let res = ''

  const charCount = {};

  for (const char of lowerWord) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of lowerWord) {
    if (charCount[char] > 1) {
      res += ')';
    } else {
      res += '(';
    }
  }
  return res;
}

console.log(duplicateEncode('Success'))

//duplicateEncode("din") // (((


/**
 * Цель этого упражнения — преобразовать строку в новую строку, где каждый символ в новой строке —
 * это "(", если этот символ встречается в исходной строке только один раз, или ")", если этот символ
 *  встречается в исходной строке более одного раза.
 * Игнорируйте регистр букв при определении того, является ли символ дубликатом.
 *
 */
/**
 * Examples:
 * "din"      =>  "((("
 "recede"   =>  "()()()"
 "Success"  =>  ")())())"
 "(( @"     =>  "))(("
 */
function duplicateEncode(word) {
  const newWord = word.toLowerCase();


  const map1 = newWord.split('').reduce((acc, val) => {
    if (!(val in acc)) {
      acc[val] = 1;
      return acc;
    } else {
      return {
        ...acc,
        [val]: acc[val] + 1
      }
    }
  }, {})

  return Object.values(map1).map((v) => v > 1 ? ')' : '(').join('')
}



console.log(duplicateEncode('Success'))

//duplicateEncode("din") // (((

/*function duplicateEncode(word) {
    let w = word.toLowerCase()

    let result = ''

    for (let i = 0; i < w.length; i++) {
        if (w.lastIndexOf(w[i]) === w.indexOf(w[i])) {
            result += '('

        } else {
            result += ')'
        }
    }
    return result;
}*/


return word
  .toLowerCase()
  .split("")
  .map(function (a, i, w) {
    return w.indexOf(a) === w.lastIndexOf(a) ? "(" : ")";
  })
  .join("");