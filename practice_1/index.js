const prompt = require('prompt-sync')()
const functions = require('./functions')

let n = Number(prompt('Inserta n: '))
let alpha = 0
let beta = Number(prompt('Inserta beta: ')) % n

do{
    alpha = Number(prompt('Inserta alpha: '))
} while (!functions.isCoprime(alpha, n))

let alpha_p = functions.calculateInverseMultiplicative(alpha, n)

console.log("Beta: ", beta)
console.log("Alpha: ", alpha)
console.log("n: ", n)
// ``

const x = (alpha_p * (-1 * beta)) % n

console.log(`C = ${alpha}p + ${beta} mod ${n}`)
console.log(`p = ${alpha_p}C ${x > 0 ? '+' : ''}${x} mod ${n}`)