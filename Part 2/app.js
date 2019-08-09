// helper functions
const hasher = input => md5(input);

const isValidKey = key => /^[0-9A-F]{32}$/i.test(key);

const swap = (arr, a, b) => [arr[a], arr[b]] = [arr[b], arr[a]];

const hexaConstructor = hexa => hexa.match(/.{2}/g).map(hexString => parseInt(hexString, 16));

const stateConstructor = () => {
    const s = [];
    for (let index = 0; index < 256; index++) {
        s[index] = index; 
    }
    return s;
}

const KSA = (state, key) => {
    let j = 0;
    state.forEach((element, i) => {
        j = (j + element + key[i % key.length]) % 256;
        swap(state, i, j);
    });
    return state;
}

const PRGA = (state, i, j) => {
    i = (i + 1) % 256;
    j = (j + state[i]) % 256;
    swap(state, i, j);
    return { i, j };
}

const IPRGA = (state, i, j) => {
    swap(state, i, j);
    j = (j - state[i] + 256) % 256;
    i = (i - 1) % 256;
    return { i, j };
}

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

const dataConstructor = str => {
    const data = [];
    str.split('').forEach(value => data.push(value.charCodeAt()));
    return data;
}

const dataReader = array => array.map(byte => String.fromCharCode(byte)).join('');

const compareHashes = (h1, h2) => {
    const identical = true;
    for (let index = 0; index < h1.length; index++) {
        if (h1[index] !== h2[index]) {
            return false;
        }
    }
    return identical;
}