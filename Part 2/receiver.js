// run on receiver page load
document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("receiveForm");
    form.addEventListener('submit', submitReceiver);
});

/**
 * This function will go through the received packets and decrypt them into their original format
 * @param {array} data array of the received packets
 * @param {object} info object containts the current receiver information such as sequence and state
 * @return {string} the decrypted message
 */
const decipherData = (data, info) => {
    let result = '';
    data.forEach(packet => {
        // read packet data
        let SCp = packet[0];
        let encryptedSegmant = packet[1];
        let encryptedHash = packet[2];
        // adjust the state
        let rounds = SCp - info.SCb;
        let updatedInfo = rounds >= 0 ? stateShifter(IPRGA, rounds, info.state, info.i, info.j) 
        : stateShifter(IPRGA, rounds, info.state, info.i, info.j);
        info.state = updatedInfo.s;
        info.i = updatedInfo.i;
        info.j = updatedInfo.j;
        // decrypt the segmant and the hash value
        let decryptedSegmant = RC4([...info.state], encryptedSegmant);
        let decryptedHash = RC4([...info.state], encryptedHash);
        // generate new hash
        let hash = hexaConstructor(hasher(info.SCb + decryptedSegmant.join('')));
        // compare between the received hash and the generated hash
        if(compareHashes(decryptedHash, hash)) {
            result += dataReader(decryptedSegmant);
        } else {
            // this will never run since the packet is always currect.
            // But when real network transmitting involves, then good luck :D
            alert('corrupted packet!');
        }
        // Increment the sequence of B
        info.SCb += 1;
    });
    return result;
}

/**
 * This is the core function in the receiver interface
 * It will get invoked once the receiver submit the form
 */
const submitReceiver = () => {
    // prevent page from refresh
    event.preventDefault();
    const key = document.getElementById('receiver_key').value;
    if (isValidKey(key)) {
        // define object variables with thier initial values
        const info = {
            SCb: 0,
            i: 0,
            j: 0,
            state: KSA(stateConstructor(), hexaConstructor(key)) // generate initial state using KSA
        }
        // pass the received data with the receiver info
        let plainMessage = decipherData(JSON.parse(localStorage.getItem('receivedData')), info);
        // render the message on the screen
        let node = document.createElement('p');
        let textNode = document.createTextNode(plainMessage);
        node.appendChild(textNode);
        document.getElementById("decrypted_message").appendChild(node);
    } else {
        alert('Invalid key! Please insert 128-bit key in hexadecimal format.');
    }
}