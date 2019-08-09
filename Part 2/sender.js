// run on sender page load
document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("senderForm");
    form.addEventListener('submit', submitSender);
});

/**
 * This function will generate the packets that should be send to the receiver
 * @param {array} messageSegments array of the data segments
 * @param {object} info object containts the current sender information such as sequence and state.
 * @return {array} array of data packets
 */
const generatePackets = (messageSegments, info) => {
    const packets = [];
    messageSegments.forEach(segment => {
        // define new packet
        const packet = [];
        // generate new hash using unencrypted SC ans data segment
        const hash = hasher(info.SCa + segment.join(''));
        // encrypt the generated hash value.
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

/**
 * This is the core function in the sender interface.
 * It will get invoked once the sender submit the form
 */
const submitSender = () => {
    // prevent page from refresh
    event.preventDefault();
    // grab data from user
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