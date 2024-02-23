import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
// import { noise } from '@chainsafe/libp2p-noise'
// import { yamux } from '@chainsafe/libp2p-yamux'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify } from '@chainsafe/libp2p-identify'
import { multiaddr } from '@multiformats/multiaddr'
import { bootstrap } from '@libp2p/bootstrap'

const addr = multiaddr('/ip4/127.0.0.1/tcp/23199');
const bootstrapAddr = multiaddr('/ip4/64.227.125.94/tcp/23000/p2p/12D3KooWDu1DQcEXyJRwbq6spG5gbi11MbN3iSSqbc2Z85z7a8jB');
const keyperAddr0 = multiaddr('/ip4/64.227.125.94/tcp/23001/p2p/12D3KooWFbscPyxc3rxyoEgyLbDYpbfx6s6di5wnr4cFz77q3taH');
const keyperAddr1 = multiaddr('/ip4/64.227.125.94/tcp/23002/p2p/12D3KooWLmDDaCkXZgkWUnWZ1RxLzA1FHm4cVHLnNvCuGi4haGLu');
const keyperAddr2 = multiaddr('/ip4/64.227.125.94/tcp/23003/p2p/12D3KooW9y8s8gy52jHXvJXNU5D2HuDmXxrs5Kp4VznbiBtRUnU5');

const node = await createLibp2p({
    // libp2p nodes are started by default, pass false to override this
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
            list: [bootstrapAddr, keyperAddr0, keyperAddr1, keyperAddr2]
        })
    ]
    // connectionEncryption: [noise()],
    // streamMuxers: [yamux()]
});

// start libp2p
await node.start();
console.log('libp2p has started');

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