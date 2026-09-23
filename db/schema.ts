import { pgTable, text, integer, bigint, index } from 'drizzle-orm/pg-core';
// Timestamps stay epoch milliseconds so the admin inbox keeps rendering them
// with `new Date(value)` exactly as it did on SQLite.
export const inquiries=pgTable('inquiries',{
 id:text('id').primaryKey(), name:text('name').notNull(),email:text('email').notNull(),idea:text('idea').notNull(),addons:text('addons').notNull(),estimate:integer('estimate').notNull(),status:text('status').notNull().default('new'),notes:text('notes').notNull().default(''),createdAt:bigint('created_at',{mode:'number'}).notNull(),updatedAt:bigint('updated_at',{mode:'number'}).notNull(),version:integer('version').notNull().default(1),consentAt:bigint('consent_at',{mode:'number'}).notNull(),phone:text('phone')
},t=>[index('idx_inquiries_created').on(t.createdAt),index('idx_inquiries_status_created').on(t.status,t.createdAt)]);
export const requestLimits=pgTable('request_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:bigint('expires_at',{mode:'number'}).notNull()},t=>[index('idx_limits_expiry').on(t.expiresAt)]);
