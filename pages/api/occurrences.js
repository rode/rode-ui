import GrafeasGrpc from '../../rode-client-nodejs/proto/v1beta1/grafeas_grpc_pb'
import GrafeasMessages  from '../../rode-client-nodejs/proto/v1beta1/grafeas_pb'

import * as grpc from '@grpc/grpc-js';
import {promisify} from 'util';

export default async (req, res) => {
  try {
    const client = new GrafeasGrpc.GrafeasV1Beta1Client(
        "localhost:8080",
        grpc.credentials.createInsecure()
    );
    // console.log('GrafeasMessages', GrafeasMessages)

    // const listOccurrences = promisify(client.listOccurrences);
    const msg = new GrafeasMessages.ListOccurrencesRequest();
    msg.setParent("projects/rode")
    console.log('msg', msg.setParent)
    client.listOccurrences(msg, (res, err) => {
      console.log('res', res)
      console.log('err', err)
    })
    // const response = await listOccurrences(msg);
    // console.log('response', response);
  } catch(e) {
    console.log('oh no', e)
  }

  res.status(200).json({ foo: "bar" });
};
