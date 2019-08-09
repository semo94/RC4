// helper functions

/**
 * This function uses external library to produce fixed 128 bit hashed value.
 * @param {string} input string value
 * @return {string} 128-bit hashed value
 */
const hasher = input => md5(input);

/**
 * This function checks if the entered key adhere to the required specification
 * @param {string} key the user key
 * @return {boolean} true or false
 */
const isValidKey = key => /^[0-9A-F]{32}$/i.test(key);

/**
 * This function swap between two values in an array
 * @param {array} arr
 * @param {integer} a first index of the array
 * @param {integer} b second index of the array
 */
const swap = (arr, a, b) => [arr[a], arr[b]] = [arr[b], arr[a]];

/**
 * 
 * @param {string} hexa a string representation of the hexadecimal value
 * @return {array} array contains the byte format of each hexadecimal number
 */
const hexaConstructor = hexa => hexa.match(/.{2}/g).map(hexString => parseInt(hexString, 16));

/**
 * This function will initiate the state with values from 0 to 255
 * @return {array} the constructed initial state
 */
const stateConstructor = () => {
    const s = [];
    for (let index = 0; index < 256; index++) {
        s[index] = index; 
    }
    return s;
}

/**
 * This function will perform Key-scheduling algorithm based on the givin state and key
 * @param {array} state the initial state
 * @param {array} key array of the key representation in bytes
 * @return {state} the state after the initial permutation
 */
const KSA = (state, key) => {
    let j = 0;
    state.forEach((element, i) => {
        j = (j + element + key[i % key.length]) % 256;
        swap(state, i, j);
    });
    return state;
}

/**
 * This function applies one iteration of the pseudo-random generator algorithm
 * @param {array} state The state array
 * @param {integer} i The first 8-bit index pointer
 * @param {integer} j The second 8-bit index pointer
 * @return {object} Object contains the pointers value of the new state
 */
const PRGA = (state, i, j) => {
    i = (i + 1) % 256;
    j = (j + state[i]) % 256;
    swap(state, i, j);
    return { i, j };
}

/**
 * This function applies one iteration of the inverse pseudo-random generator algorithm
 * @param {array} state The state array
 * @param {integer} i The first 8-bit index pointer
 * @param {integer} j The second 8-bit index pointer
 * @return {object} Object contains the pointers value of the new inversed state
 */
const IPRGA = (state, i, j) => {
    swap(state, i, j);
    j = (j - state[i] + 256) % 256;
    i = (i - 1) % 256;
    return { i, j };
}

/**
 * This function applies certain rounds on either PRGA or IPRGA
 * @param {function} func The target algorithm 
 * @param {integer} rounds The number of interations
 * @param {array} s The state array
 * @param {integer} i The first 8-bit index pointer
 * @param {integer} j The second 8-bit index pointer
 * @return {object} Object contains the shifted state array and the pointers value of the new shifted state
 * @example stateShifter(IPRGA, 3, stateArr, 4, 9);
 */
const stateShifter = (func, rounds, s, i, j) => {
    for (let index = 0; index < rounds; index++) {
        let pointers = func(s, i, j);
        i = pointers.i;
        j = pointers.j;
    }
    return { s, i, j };
}

/**
 * This function perform the encryption/decryption RC4 algorithm
 * @param {array} state the generated state by the KSA
 * @param {array} data the data in bytes format that needs to be encrypted or decrypted
 */
const RC4 = (state, data) => {
    let result = [];
    let i, j;
    i = j = 0;
    data.forEach(byte => {
        i = (i + 1) % 256;
        j = (j + state[i]) % 256;
        swap(state, i, j);
        let stream = state[(state[i] + state[j]) % 256]
        let xoredValue = stream ^ byte;
        result.push(xoredValue);
    });
    return result;
}

/**
 * This function creates data segments in byte format
 * @param {string} msg message in plain text
 * @return {array} an array contains data segments
 */
const dataSegmentar = (msg) => {
    const messageParts = msg.match(/.{1,252}/g);
    return messageParts.map(part => {
        let data  = dataConstructor(part);
        while (data.length < 252) {
            data.push(0);
        }
        return data;
    });
}

/**
 * This function convert a string into byte format
 * @param {string} str
 */
const dataConstructor = str => {
    const data = [];
    str.split('').forEach(value => data.push(value.charCodeAt()));
    return data;
}

/**
 * This function read the data with bytes format and convert it back to string
 * @param {array} array 
 * @return {string} the read data
 */
const dataReader = array => array.map(byte => String.fromCharCode(byte)).join('');

/**
 * 
 * @param {array} h1 the first hash value in binary array
 * @param {array} h2 the second hash value in binart array
 * @return {boolean} The comparison value which can be true or false
 */
const compareHashes = (h1, h2) => {
    const identical = true;
    for (let index = 0; index < h1.length; index++) {
        if (h1[index] !== h2[index]) {
            return false;
        }
    }
    return identical;
}