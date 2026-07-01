import 'server-only';

import { db } from './database';
import { FilterState } from '@/types';

export const getFeaturedListings = () => db.listings.getFeatured();
export const getListings = (filter?: FilterState) => db.listings.getAll(filter);
export const getPaginatedListings = (filter?: FilterState) => db.listings.getPaginated(filter);
export const getListingById = (id: string) => db.listings.getById(id);
export const getAllUsers = () => db.users.getAll();
