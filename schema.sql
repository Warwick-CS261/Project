CREATE TABLE USER (
  id INTEGER PRIMARY KEY,-- Incrementing sequence
  fName VARCHAR(30),
  lName VARCHAR(30),
  email VARCHAR(320),
  phash VARCHAR(60),
  salt VARCHAR(60),
);

--CREATE SEQUENCE uID_seq;
--id INTEGER NOT NULL DEFAULT nextval('uID_sq')

CREATE TABLE SESH (
  id VARCHAR(6) PRIMARY KEY,--function needs to generate
  sname VARCHAR(30),
  mood FLOAT,
  secure VARCHAR(60), -- security password or NULL
);

CREATE TABLE MOOD_DATE (
  sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
  stamp DATETIME,
  mood FLOAT,
);

CREATE TABLE SESSION_REACTION (
  formID INTEGER FOREIGN KEY REFERENCES FORM(id),
  userID INTEGER FOREIGN KEY REFERENCES USER(id),
  reaction VARCHAR(10), -- values 'sad', 'happy', 'bored' etc. 
  context VARCHAR(100) -- context to feedback from the requirements
  stamp DATETIME, -- time of reaction received (required for reaction-time diagram)
)

CREATE TABLE HOST_SESSION (
  userID INTEGER FOREIGN KEY REFERENCES USER(id),
  sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
);

CREATE TABLE ATTENDEE_SESSION (
  userID INTEGER FOREIGN KEY REFERENCES USER(id)
  sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
);

Create TABLE FORM (
  id INTEGER PRIMARY KEY,
  sessionID VARCHAR (6) FOREIGN KEY REFERENCES SESH(id),
  question Varchar(100),
);

CREATE TABLE CHAT (
  sessionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
  msg VARCHAR(1000),
  userID INTEGER FOREIGN KEY REFERENCES USER(id),
  stamp DATETIME,
)

CREATE TABLE SESSION_WORD (
  seesionID VARCHAR(6) FOREIGN KEY REFERENCES SESH(id),
  word VARCHAR(10),
  mood FLOAT,
  num INTEGER,
);