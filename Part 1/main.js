/** 
 * This function swap between two values in an array
*/
const swap = (arr, a, b) => {
    [arr[a], arr[b]] = [arr[b], arr[a]];
}

/**
 * This function generate initial array with values between 0 to 255
 * @return {array} The generated array
 */
const GenerateInitialState = () => {
    const s = [];
    for (let index = 0; index < 256; index++) {
        s[index] = index;
    }
    return s;
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
 * @param {integer} [rounds=0] The number of interations
 * @param {array} [s=GenerateInitialState()] The state array
 * @param {integer} [i=0] The first 8-bit index pointer
 * @param {integer} [j=0] The second 8-bit index pointer
 * @return {object} Object contains the shifted state array and the pointers value of the new shifted state
 * @example stateShifter(IPRGA, 3, stateArr, 4, 9);
 */
const stateShifter = (func, rounds = 0, s = GenerateInitialState(), i = 0, j = 0) => {
    for (let index = 0; index < rounds; index++) {
        let pointers = func(s, i, j);
        i = pointers.i;
        j = pointers.j;
    }
    return { s, i, j };
}

/**
 * 
 * @param {array} s1 The first state array
 * @param {array} s2 The second state array 
 * @returns {boolean} The comparison value which can be true or false
 * @example compareStates([1, 2, 3], [1, 3, 2]);
 */
const compareStates = (s1, s2) => {
    const identical = true;
    for (let index = 0; index < s1.length; index++) {
        if (s1[index] !== s2[index]) {
            return false;
        }
    }
    return identical;
}

// ***************** TESTING THE PROGRAM ***************** 
// Confirm that any RC4 state can move forward by PRGA and backward by IPRGA.

/*  
    STEP 1: Create initial RC4 state.
    By passing 0 as a round value, no shifting will applied. However, a new state array will created and assigned to variable s.
    Also, i and j variable will get the deafult value of 0
    In this case, the stateShifter() function will return an object that has the initial array s, the initial pointers i and j.
*/
let initialState = stateShifter(PRGA, 0);
console.log('Initial state object', initialState);

/*  
    STEP 2: Shift the RC4 state
    Now, let's shift the state forward by four rounds!
    Note that I passed a clone of the initial s because the deafult behaviour in JS is passing arrays by reference which will modify the orginal state.
*/
let shiftedState = stateShifter(PRGA, 4, [...initialState.s], initialState.i, initialState.j);
console.log('Shifted state object', shiftedState);

// compare the initial state array with the shifted array. It should return false!
console.log('Compare initial with shifted ==>', compareStates(initialState.s, shiftedState.s));

/*  
    STEP 3: Unshift the shifted state
    In this step, the shifted state will be moved backword by four rounds.
    This will result in undoing the previous changes and returning the RC4 to its original state
*/
let unshiftedStete = stateShifter(IPRGA, 4, [...shiftedState.s], shiftedState.i, shiftedState.j);
console.log('Ushifted state object', unshiftedStete);


// compare the initial state array with the unshifted array. It should return true!
console.log('Compare initial with unshifted ==>', compareStates(initialState.s, unshiftedStete.s));