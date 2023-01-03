const findAthleteWithCoach = `
SELECT
    athlete.id,
    athlete.name,
    coach.name AS coach_name
FROM
    athlete
    INNER JOIN coach ON coach.id = athlete.coach_id
WHERE
    athlete.id = ?;
`;

export default findAthleteWithCoach;
