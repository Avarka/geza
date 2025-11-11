ALTER TABLE `GEZA_teacher_courses` RENAME COLUMN `classroon_neptun_id` TO `classroom_neptun_id`;--> statement-breakpoint
ALTER TABLE `GEZA_teacher_courses` MODIFY COLUMN `course_type` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `GEZA_teacher_courses` MODIFY COLUMN `week_date` date;