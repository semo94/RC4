document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("receiveForm");
    form.addEventListener('submit', submitReceiver);
});

const decipherData = (data, info) => {
    let result = '';
    data.forEach(packet => {
        // read packet data
        let SCp = packet[0];
        let encryptedSegmant = packet[1];
        let encryptedHash = packet[2];
        let decryptedSegmant = RC4([...info.state], encryptedSegmant);
        result += dataReader(decryptedSegmant);
    });
    return result;
}

const submitReceiver = () => {
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