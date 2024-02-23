import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify } from '@libp2p/identify'
import { multiaddr } from '@multiformats/multiaddr'
import { bootstrap } from '@libp2p/bootstrap'

const addr = multiaddr('/ip4/0.0.0.0/tcp/23199');
const bootstrapAddr = multiaddr('/ip4/64.227.125.94/tcp/23000/p2p/12D3KooWDu1DQcEXyJRwbq6spG5gbi11MbN3iSSqbc2Z85z7a8jB');
const keyperAddr0 = multiaddr('/ip4/64.227.125.94/tcp/23001/p2p/12D3KooWFbscPyxc3rxyoEgyLbDYpbfx6s6di5wnr4cFz77q3taH');
const keyperAddr1 = multiaddr('/ip4/64.227.125.94/tcp/23002/p2p/12D3KooWLmDDaCkXZgkWUnWZ1RxLzA1FHm4cVHLnNvCuGi4haGLu');
const keyperAddr2 = multiaddr('/ip4/64.227.125.94/tcp/23003/p2p/12D3KooW9y8s8gy52jHXvJXNU5D2HuDmXxrs5Kp4VznbiBtRUnU5');

const node = await createLibp2p({
    start: false,
    addresses: {
      listen: [addr]
    },
    transports: [tcp()],
    pubsub: [gossipsub()],
    services: {
        identify: identify({protocolPrefix: "shutter/0.1.0"})
    },
    peerDiscovery: [
        bootstrap({
            list: [bootstrapAddr, keyperAddr0, keyperAddr1, keyperAddr2],
            timeout: 1000, // in ms,
            tagName: 'bootstrap',
            tagValue: 50,
            tagTTL: 120000 // in ms
        })
    ]
});

// start libp2p
await node.start();
console.log('libp2p has started. peer id: ' + node.peerId);

node.addEventListener('peer:discovery', (evt) => {
    console.log('found peer: ' + evt.detail.id.toString())
});

node.addEventListener('peer:connect', (evt) => {
    console.log('connected to peer: ' + evt.detail.id.toString())
});

// node.services.pubsub.addEventListener('decryptionKey', (message) => {
//     console.log(`${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
// });

// node.services.pubsub.subscribe('decryptionKey');

// update peer connections
node.addEventListener('connection:open', () => {
    console.log("connection opened");
});

node.addEventListener('connection:close', () => {
    console.log("connection closed");
});