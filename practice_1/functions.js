function calculateMCD(number1, number2) {
    while (number2 !== 0) {
        let temp = number2;
        number2 = number1 % number2;
        number1 = temp;
    }

    return number1;
}

const isCoprime = (number1, number2) => {
    const mcd = calculateMCD(number1, number2)
    console.log('MCD: ', mcd)
    if(mcd == 1){
        return true
    }

    console.log('Intente con otro alpha')
    return false
}

const extendedEuclides = (a, b) => {
    if (b === 0) {
        return [1, 0, a];
    } else {
        const [x, y, gcd] = extendedEuclides(b, a % b);
        return [y, x - Math.floor(a / b) * y, gcd];
    }
}

const calculateInverseMultiplicative = (a, m) => {
    const [x, y, gcd] = extendedEuclides(a, m);
    if (gcd !== 1) {
        throw new Error(`El inverso multiplicativo no existe ya que ${a} y ${m} no son coprimos.`);
    }
    // Asegurarse de que el inverso multiplicativo sea positivo y menor que m
    let inverso = x % m;
    if (inverso < 0) {
        inverso += m;
    }
    return inverso;
}

module.exports = {
    isCoprime,
    calculateInverseMultiplicative
}