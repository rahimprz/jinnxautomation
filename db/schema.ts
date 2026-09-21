import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const inquiries=sqliteTable('inquiries',{
 id:text('id').primaryKey(), name:text('name').notNull(),email:text('email').notNull(),idea:text('idea').notNull(),addons:text('addons').notNull(),estimate:integer('estimate').notNull(),status:text('status').notNull().default('new'),notes:text('notes').notNull().default(''),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),version:integer('version').notNull().default(1),consentAt:integer('consent_at').notNull()
},t=>[index('idx_inquiries_created').on(t.createdAt),index('idx_inquiries_status_created').on(t.status,t.createdAt)]);
export const adminOwner=sqliteTable('admin_owner',{slot:integer('slot').primaryKey(),userId:text('user_id').notNull(),createdAt:integer('created_at').notNull()});
export const requestLimits=sqliteTable('request_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('idx_limits_expiry').on(t.expiresAt)]);
