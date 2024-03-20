import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify } from '@libp2p/identify'
import { multiaddr } from '@multiformats/multiaddr'
import { bootstrap } from '@libp2p/bootstrap'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import * as fs from 'node:fs'
import { warn } from 'node:console'

const addr = multiaddr('/ip4/0.0.0.0/tcp/23199');
const bootstrapAddr = multiaddr('/ip4/64.226.117.95/tcp/23000/p2p/12D3KooWDu1DQcEXyJRwbq6spG5gbi11MbN3iSSqbc2Z85z7a8jB');
const keyperAddr0 = multiaddr('/ip4/64.226.117.95/tcp/23001/p2p/12D3KooWFbscPyxc3rxyoEgyLbDYpbfx6s6di5wnr4cFz77q3taH');
const keyperAddr1 = multiaddr('/ip4/64.226.117.95/tcp/23002/p2p/12D3KooWLmDDaCkXZgkWUnWZ1RxLzA1FHm4cVHLnNvCuGi4haGLu');
const keyperAddr2 = multiaddr('/ip4/64.226.117.95/tcp/23003/p2p/12D3KooW9y8s8gy52jHXvJXNU5D2HuDmXxrs5Kp4VznbiBtRUnU5');

const node = await createLibp2p({
    start: false,
    addresses: {
      listen: [addr]
    },
    transports: [tcp()],
    services: {
        identify: identify({protocolPrefix: "shutter/0.1.0"}),
        pubsub: gossipsub()
    },
    peerDiscovery: [
        bootstrap({
            list: [bootstrapAddr, keyperAddr0, keyperAddr1, keyperAddr2],
            timeout: 1000, // in ms,
            tagName: 'bootstrap',
            tagValue: 50,
            tagTTL: 120000 // in ms
        })
    ],
    streamMuxers: [
        yamux()
    ],
    connectionEncryption: [noise()]
});

// start libp2p
await node.start();
console.log('libp2p has started. peer id: ' + node.peerId);

node.addEventListener('peer:discovery', (evt) => {
    console.log('found peer: ' + evt.detail.id.toString())
});

node.addEventListener('peer:connect', (evt) => {
    // console.log('connected to peer: ' + evt.detail.id.toString())
    console.log('connected to peer: ' + evt.detail);
});

node.services.pubsub.subscribe('decryptionKeys');

let i = 0;
node.services.pubsub.addEventListener('message', (message) => {
    console.log(`${message.detail.topic}:`, message.detail.data.toString('hex'));
    // node.services.pubsub.publish('decryptionKeys', message);
    console.log("new message! " + i);
    i++;
    // fs.writeFile("tmp", message.detail.data, "binary", function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("The file was saved!");
    //     }
    // });
});

// update peer connections
node.addEventListener('connection:open', () => {
    console.log("connection opened");
});

node.addEventListener('connection:close', () => {
    console.log("connection closed");
});

setInterval(async () => {
    await node.services.pubsub.publish('decryptionKeys', [5, 3, 3]);
    console.log('sent!');
}, 5000)
