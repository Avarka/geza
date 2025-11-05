CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `GEZA_teacher_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`user_email` varchar(100) NOT NULL,
	`user_name` varchar(100) NOT NULL,
	`teacher_id` int,
	`teacher_department_unique_id` int,
	`teacher_active` int,
	`course_id` int,
	`course_neptun_id` varchar(100) NOT NULL,
	`course_unique_name` varchar(100) NOT NULL,
	`course_full_name` varchar(100) NOT NULL,
	`course_type` int,
	`course_scool` int,
	`course_hour` int NOT NULL,
	`course_prefill` int,
	`course_department_unique_id` int,
	`course_division_dephelper` int,
	`week_id` int,
	`week_week` int,
	`week_active` int,
	`week_date` int,
	`course_starttime_starthour` int NOT NULL,
	`course_starttime_day_id` int NOT NULL,
	`classroon_neptun_id` varchar(255),
	`classroom_unique_name` varchar(255) NOT NULL DEFAULT '''IR-217''',
	`classroom_full_name` varchar(255) NOT NULL DEFAULT '''IR-217 PC terem'''
);
--> statement-breakpoint
CREATE TABLE `semester` (
	`name` varchar(10) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	`impersonated_by` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT true,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`role` text,
	`banned` boolean DEFAULT false,
	`ban_reason` text,
	`ban_expires` timestamp(3),
	`gid_number` int NOT NULL,
	`fullname` text,
	`display_name` text,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;