CREATE DATABASE elearning_quiz_merge;

USE elearning_quiz_merge;

CREATE TABLE `answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `answers`
--

INSERT INTO `answers` (`id`, `answer_text`, `is_correct`, `question_id`, `created_at`, `updated_at`) VALUES
(1, 'Python', 0, 1, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(2, 'C#', 1, 1, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(3, 'Java', 0, 1, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(4, 'Python', 0, 3, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(5, 'C#', 1, 3, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(6, 'Java', 0, 3, '2023-07-20 08:35:48', '2023-07-20 08:35:48');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `assignments`
--

CREATE TABLE `assignments` (
  `assignment_id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `deadline` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `assignments`
--

INSERT INTO `assignments` (`assignment_id`, `title`, `description`, `course_id`, `deadline`) VALUES
(1, 'Assignment 1', 'Implement a basic software application using Java.', 1, '2023-07-31'),
(2, 'Assignment 2', 'Design and implement a class hierarchy for a banking system.', 1, '2023-07-31'),
(3, 'Assignment 1', 'Create a simple website using HTML and CSS.', 3, '2023-07-31'),
(4, 'Assignment 2', 'Develop a dynamic web application using JavaScript and PHP.', 3, '2023-07-31');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `assignment_state`
--

CREATE TABLE `assignment_state` (
  `assignment_state_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `assignment_state`
--

INSERT INTO `assignment_state` (`assignment_state_id`, `student_id`, `assignment_id`, `state_id`) VALUES
(1, 1, 3, 4),
(2, 1, 4, 4),
(3, 1, 3, 4),
(4, 1, 4, 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `course`
--

CREATE TABLE `course` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `course_description` text DEFAULT NULL,
  `teacher_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `course_description`, `teacher_id`) VALUES
(1, 'Introduction to Software Engineering', 'An overview of software engineering principles and practices.', 1),
(2, 'Object-Oriented Programming', 'Learn the fundamentals of object-oriented programming concepts.', 2),
(3, 'Web Development Basics', 'Introduction to web development technologies and techniques.', 3),
(4, 'Database Management Systems', 'Study various aspects of database management systems.', 4),
(5, 'Mobile App Development', 'Learn how to develop mobile applications for iOS and Android platforms.', 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `course_contents`
--

CREATE TABLE `course_contents` (
  `content_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `lecture_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `course_contents`
--

INSERT INTO `course_contents` (`content_id`, `course_id`, `title`, `lecture_text`) VALUES
(1, 1, 'Example content', 'Here is a brief overview of software engineering:\nSoftware engineering is the systematic application of engineering approaches to the development of software. It aims to create software that is reliable, efficient, maintainable, and that meets user requirements. Some key aspects of software engineering include:\n\nRequirements engineering - Working with stakeholders to identify and document what features the software needs to have. This results in a requirements specification.\n\nSoftware design - Creating models and architectures that describe the structure and behavior of the software. This includes dividing the software into components and designing interfaces.\n\nImplementation - Writing and testing the actual software code based on the design. This is done by programmers.\n\nSoftware testing - Evaluating the code to detect bugs and flaws. This includes unit testing individual components, integration testing how components interact, and validation testing against the requirements.\n\nSoftware maintenance - Making modifications and enhancements to the software after it is deployed. This involves fixing bugs, improving performance, or adapting to new requirements.\n\nSoftware management - Managing the scheduling, staffing, costs, risks, and quality of the project. Project management approaches like agile development are often used.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `enrollment`
--

CREATE TABLE `enrollment` (
  `enrollment_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrollment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `enrollment`
--

INSERT INTO `enrollment` (`enrollment_id`, `course_id`, `student_id`, `enrollment_date`) VALUES
(1, 1, 1, '2022-01-11'),
(2, 1, 2, '2022-01-11'),
(3, 1, 3, '2022-01-12'),
(4, 2, 2, '2022-02-16'),
(5, 2, 3, '2022-02-16'),
(6, 3, 3, '2022-03-21'),
(7, 3, 4, '2022-03-22'),
(8, 3, 1, NULL),
(9, 3, 1, NULL),
(10, 2, 1, NULL),
(11, 5, 1, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_text` text NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `questions`
--

INSERT INTO `questions` (`id`, `question_text`, `quiz_id`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Console.WriteLine(\"sample\")', 1, NULL, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(2, 'Example question?', 2, NULL, '2023-07-20 08:35:48', '2023-07-20 08:35:48'),
(3, 'Console.Readline(\"sample\")', 1, NULL, '2023-07-20 08:35:48', '2023-07-20 08:35:48');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `quizzes`
--

CREATE TABLE `quizzes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `course_id`, `created_at`, `updated_at`) VALUES
(1, 'Program languages', 'C#, Java, Python', 1, '2023-07-20 08:33:35', '2023-07-20 08:33:35'),
(2, 'No questions in this quiz', 'there are no questions in this quiz', 1, '2023-07-20 08:36:21', '2023-07-20 08:36:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `results`
--

CREATE TABLE `results` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `answer_id` bigint(20) UNSIGNED NOT NULL,
  `survey_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `results`
--

INSERT INTO `results` (`id`, `quiz_id`, `question_id`, `answer_id`, `survey_id`, `created_at`, `updated_at`) VALUES
(0, 1, 3, 5, 1, '2023-07-20 08:35:59', '2023-07-20 08:35:59'),
(1, 1, 1, 3, 1, '2023-07-20 08:35:59', '2023-07-20 08:35:59');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `states`
--

CREATE TABLE `states` (
  `state_id` int(11) NOT NULL,
  `state_name` varchar(50) NOT NULL,
  `permission` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `states`
--

INSERT INTO `states` (`state_id`, `state_name`, `permission`) VALUES
(1, 'submitted', 0),
(2, 'graded', 1),
(3, 'late', 1),
(4, 'pending', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_email` varchar(100) NOT NULL,
  `student_password` varchar(100) NOT NULL,
  `student_enrollment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `student`
--

INSERT INTO `student` (`student_id`, `student_name`, `student_email`, `student_password`, `student_enrollment_date`) VALUES
(1, 'Emily Johnson', 'emilyjohnson@example.com', 'password6', '2022-01-10'),
(2, 'Matthew Davis', 'matthewdavis@example.com', 'password7', '2022-02-15'),
(3, 'Olivia Wilson', 'oliviawilson@example.com', 'password8', '2022-03-20'),
(4, 'Daniel Taylor', 'danieltaylor@example.com', 'password9', '2022-04-25'),
(5, 'Sophia Anderson', 'sophiaanderson@example.com', 'password10', '2022-05-30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student_results`
--

CREATE TABLE `student_results` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `result_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `student_results`
--

INSERT INTO `student_results` (`id`, `student_id`, `result_id`) VALUES
(1, 1, 0),
(2, 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `surveys`
--

CREATE TABLE `surveys` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `surveys`
--

INSERT INTO `surveys` (`id`, `quiz_id`, `created_at`, `updated_at`, `student_id`) VALUES
(1, 1, '2023-07-20 08:35:59', '2023-07-20 08:35:59', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teacher`
--

CREATE TABLE `teacher` (
  `teacher_id` int(11) NOT NULL,
  `teacher_name` varchar(100) NOT NULL,
  `teacher_email` varchar(100) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `teacher_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `teacher_name`, `teacher_email`, `specialty`, `teacher_password`) VALUES
(1, 'John Smith', 'johnsmith@example.com', 'Software Engineering', 'password1'),
(2, 'Jane Doe', 'janedoe@example.com', 'Computer Science', 'password2'),
(3, 'David Johnson', 'davidjohnson@example.com', 'Web Development', 'password3'),
(4, 'Sarah Williams', 'sarahwilliams@example.com', 'Database Management', 'password4'),
(5, 'Michael Brown', 'michaelbrown@example.com', 'Mobile App Development', 'password5');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `answers_question_id_foreign` (`question_id`);

--
-- A tábla indexei `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `course_id` (`course_id`);

--
-- A tábla indexei `assignment_state`
--
ALTER TABLE `assignment_state`
  ADD PRIMARY KEY (`assignment_state_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `state_id` (`state_id`);

--
-- A tábla indexei `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- A tábla indexei `course_contents`
--
ALTER TABLE `course_contents`
  ADD PRIMARY KEY (`content_id`),
  ADD KEY `course_id` (`course_id`);

--
-- A tábla indexei `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `student_id` (`student_id`);

--
-- A tábla indexei `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_quiz_id_foreign` (`quiz_id`);

--
-- A tábla indexei `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizzes_user_id_foreign` (`course_id`);

--
-- A tábla indexei `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `results_quiz_id_foreign` (`quiz_id`),
  ADD KEY `results_question_id_foreign` (`question_id`),
  ADD KEY `results_answer_id_foreign` (`answer_id`),
  ADD KEY `results_survey_id_foreign` (`survey_id`);

--
-- A tábla indexei `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`state_id`);

--
-- A tábla indexei `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- A tábla indexei `student_results`
--
ALTER TABLE `student_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `result_id` (`result_id`);

--
-- A tábla indexei `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `surveys_quiz_id_foreign` (`quiz_id`),
  ADD KEY `student_ibfk_1` (`student_id`);

--
-- A tábla indexei `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacher_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `assignment_state`
--
ALTER TABLE `assignment_state`
  MODIFY `assignment_state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `course_contents`
--
ALTER TABLE `course_contents`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `states`
--
ALTER TABLE `states`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `student_results`
--
ALTER TABLE `student_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `assignment_state`
--
ALTER TABLE `assignment_state`
  ADD CONSTRAINT `assignment_state_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_state_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_state_ibfk_3` FOREIGN KEY (`state_id`) REFERENCES `states` (`state_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `course_contents`
--
ALTER TABLE `course_contents`
  ADD CONSTRAINT `course_contents_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);

--
-- Megkötések a táblához `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `FK_COURSE` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_3` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_4` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `student_results`
--
ALTER TABLE `student_results`
  ADD CONSTRAINT `student_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_results_ibfk_2` FOREIGN KEY (`result_id`) REFERENCES `results` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `surveys`
--
ALTER TABLE `surveys`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `surveys_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
