const sqlite3 = require("sqlite3").verbose();
import findAthleteWithCoach from ".";

let db;

beforeEach((done) => {
  db = new sqlite3.Database(":memory:", done);
});

test("It should find an athlete given theirs id and join with the data of their coach", (done) => {
  db.serialize(() => {
    // GIVEN
    db.exec(
      `
      CREATE TABLE coach (
        id uuid NOT NULL,
        name text NOT NULL,
        CONSTRAINT coach_pkey PRIMARY KEY (id)
        );
        
      INSERT INTO
        coach (id, name)
      VALUES
        ('44ba8ca3-861a-4daf-a0d1-5b0937b683db', 'Rani'),
        ('71adf442-a19b-417e-8b57-daaa8c58fc6c', 'Mohammed'),
        ('cf242d21-b187-4b45-9d91-09046c1dd060', 'Adil');

      CREATE TABLE athlete (
        id uuid NOT NULL,
        name text NOT NULL,
        coach_id uuid NOT NULL,
        CONSTRAINT athlete_pkey PRIMARY KEY (id),
        CONSTRAINT athlete_coach_fkey FOREIGN KEY (coach_id)
          REFERENCES coach (id) MATCH SIMPLE
          ON UPDATE NO ACTION
          ON DELETE CASCADE
      );

      INSERT INTO
        athlete (id, name, coach_id)
      VALUES
        (
          '8de18c87-bcfe-41aa-826c-4edf3fd9e048',
          'Ali',
          '44ba8ca3-861a-4daf-a0d1-5b0937b683db'
        ),
        (
          'bc2e26c8-7131-46ed-8629-b893136c8972',
          'Mathieu',
          '71adf442-a19b-417e-8b57-daaa8c58fc6c'
        ),
        (
          '994c3c22-3ea6-4178-a319-d5c7246ec39a',
          'Lucas',
          '71adf442-a19b-417e-8b57-daaa8c58fc6c'
        ),
        (
          '34ed884d-318c-4909-8760-e8886a21283c',
          'Geoffrey',
          '71adf442-a19b-417e-8b57-daaa8c58fc6c'
        );
      `,
      (error) => {
        if (error) {
          console.log(error);
          throw error;
        }
      }
    );

    // WHEN
    // THEN
    const statement = db.prepare(findAthleteWithCoach);
    const expected = {
      id: "34ed884d-318c-4909-8760-e8886a21283c",
      name: "Geoffrey",
      coach_name: "Mohammed",
    };
    statement.get(["34ed884d-318c-4909-8760-e8886a21283c"], (_, actual) => {
      expect(actual).toEqual(expected);
      done();
    });
    statement.finalize();
  });
});

afterEach((done) => {
  db.close(done);
});
