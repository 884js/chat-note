CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text NOT NULL,
	`icon` text,
	`isArchived` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_groups_updatedAt` ON `groups` (`updatedAt`);--> statement-breakpoint
CREATE INDEX `idx_groups_isArchived` ON `groups` (`isArchived`);--> statement-breakpoint
CREATE TABLE `memos` (
	`id` text PRIMARY KEY NOT NULL,
	`groupId` text NOT NULL,
	`content` text,
	`imageUri` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_memos_groupId` ON `memos` (`groupId`);--> statement-breakpoint
CREATE INDEX `idx_memos_createdAt` ON `memos` (`createdAt`);