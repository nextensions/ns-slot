```
SELECT
	s.id,
	concat(
		CASE WHEN title = '1' THEN
			'เด็กชาย'
		ELSE
			CASE WHEN title = '2' THEN
				'เด็กหญิง'
			ELSE
				CASE WHEN title = '3' THEN
					'นาย'
				ELSE
					CASE WHEN title = '4' THEN
						'นางสาว'
					END
				END
			END
		END, ' ', s.firstname, ' ', s.lastname) AS fullname,
	s.code,
	concat(ac.short_name, '/', acr.room_id) AS room_name,
	CASE WHEN s.image IS NULL THEN
		'28/orangeowl.png'
	ELSE
		s.image
	END
FROM
	student s
	INNER JOIN student_class sc ON sc.student_id = s.id
	INNER JOIN semester sem ON sem.id = sc.semester_id
		AND sem.is_active = TRUE
	INNER JOIN academy_classroom acr ON acr.id = sc.classroom_id
	INNER JOIN academy_class ac ON ac.id = acr.class_id
WHERE
	s.school_id = 28
ORDER BY
	ac.short_name,
	LENGTH(acr.room_id),
	acr.room_id
```
