import { useEffect } from "react";

export type TangleEvent = { type: string };

type TangleCallback<TEvent> = (event: TEvent) => unknown;

export class TangleStore<TEvent extends TangleEvent> {
  private listeners: Map<string, Set<TangleCallback<TEvent>>>;

  constructor() {
    this.listeners = new Map<string, Set<TangleCallback<TEvent>>>();
  }

  public addEventListener(type: string, callback: (event: TEvent) => unknown) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(callback);
  }

  public removeEventListener(
    type: TEvent["type"],
    callback: (event: TEvent) => unknown
  ) {
    if (!this.listeners.has(type)) {
      return;
    }

    this.listeners.get(type)!.delete(callback);
  }

  triggeredEventTypes(event: TEvent): string[] {
    // We allow only single level namespaces for event types
    // so you can subscribe to "user." to get "user.usr-dev",
    // but you can't subscribe to "community.com-dev."
    // to get "community.com-dev.cmem-dev".
    const namespace = event.type.split(".")[0];
    return [`${namespace}.`, event.type];
  }

  public dispatchEvent(event: TEvent) {
    for (const type of this.triggeredEventTypes(event)) {
      if (!this.listeners.has(type)) {
        continue;
      }

      for (const callback of this.listeners.get(type)!) {
        callback.call(this, event);
      }
    }
  }
}

export const useTangle = <TEvent extends TangleEvent>({
  store,
  eventName,
  handleEvent,
}: {
  store: TangleStore<TEvent>;
  eventName: string;
  handleEvent: (event: TEvent) => void;
}) => {
  useEffect(() => {
    store.addEventListener(eventName, handleEvent);
    return () => {
      store.removeEventListener(eventName, handleEvent);
    };
  }, [eventName, store, handleEvent]);
};
