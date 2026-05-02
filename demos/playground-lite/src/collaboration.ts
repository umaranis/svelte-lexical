import {Doc} from 'yjs';
import {WebsocketProvider} from 'y-websocket';
import type {Provider} from 'svelte-lexical';

// parent dom -> child doc
export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Doc>,
): Provider {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const WEBSOCKET_ENDPOINT =
    params.get('collabEndpoint') || 'ws://localhost:1234';
  const WEBSOCKET_SLUG = 'playground';
  const WEBSOCKET_ID = params.get('collabId') || '0';

  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  // @ts-expect-error from lexical
  return new WebsocketProvider(
    WEBSOCKET_ENDPOINT,
    WEBSOCKET_SLUG + '/' + WEBSOCKET_ID + '/' + id,
    doc,
    {
      connect: false,
    },
  );
}
