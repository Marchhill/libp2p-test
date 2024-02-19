import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
// import { noise } from '@chainsafe/libp2p-noise'
// import { yamux } from '@chainsafe/libp2p-yamux'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'

const node = await createLibp2p({
    // libp2p nodes are started by default, pass false to override this
    start: false,
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/23102']
    },
    transports: [tcp()],
    pubsub: [gossipsub()]
    // connectionEncryption: [noise()],
    // streamMuxers: [yamux()]
});
  
// start libp2p
await node.start();
console.log('libp2p has started');

node.services.pubsub.addEventListener('decryptionKey', (message) => {
    console.log(`${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
});

node.services.pubsub.subscribe('decryptionKey');


// update peer connections
// libp2p.addEventListener('connection:open', () => {
//     updatePeerList();
// })
// libp2p.addEventListener('connection:close', () => {
//     updatePeerList();
// })