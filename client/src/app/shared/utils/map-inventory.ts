import { Item } from '../types/items.types';

type RawItem = Omit<Item, 'id'> & { _id?: string; id?: string };

export function mapItemFrom(raw: RawItem): Item {
    const { _id, id, ...rest } = raw;

    return { id: (_id ?? id) as string, ...rest } as Item;
}
