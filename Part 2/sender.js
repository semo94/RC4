document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("senderForm");
    form.addEventListener('submit', submitSender);
});

const generatePackets = (messageSegments, info) => {
    const packets = [];
    messageSegments.forEach(segment => {
        // define new packet
        const packet = [];
        // generate new hash using unencrypted SC ans data segment
        const hash = hasher(info.SCa + segment.join(''));
        // encrypt the generated hash value.
        console.log(hash);
        const encryptedhash = RC4([...info.state], hexaConstructor(hash));
        // encrypt the the data segment
        const encryptedSegment = RC4([...info.state], segment);
        // build the current packet
        packet.push(info.SCa, encryptedSegment, encryptedhash);
        // insert the current packet to the list of packets;
        packets.push(packet);
        // increase the segment counter
        info.SCa += 1;
    });
    return packets;
}

const submitSender = () => {
    event.preventDefault();
    const msg = document.getElementById('message').value;
    const key = document.getElementById('sender_key').value;
    if (isValidKey(key)) {
        // define object variables with thier initial values
        const info = {
            SCa: 0,
            i: 0,
            j: 0,
            state: KSA(stateConstructor(), hexaConstructor(key)) // generate initial state using KSA
        }
        let messageSegments = dataSegmentar(msg);
        // attache generated packets to the local storage
        let packets = generatePackets(messageSegments, info);
        localStorage.setItem("receivedData", JSON.stringify(packets));
        // redirect to the reciever interface
        window.location.replace('receiver.html');
    } else {
        alert('Invalid key! Please insert 128-bit key in hexadecimal format.');
    }
}