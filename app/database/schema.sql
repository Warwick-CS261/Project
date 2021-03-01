CREATE TABLE USER (
  id INTEGER PRIMARY KEY AUTOINCREMENT,-- Incrementing sequence
  fName VARCHAR(30),
  lName VARCHAR(30),
  email VARCHAR(320),
  phash VARCHAR(60),
  salt VARCHAR(60)
);

CREATE TABLE USER_TOKEN (
  userID INTEGER,
  token VARCHAR(64),
  FOREIGN KEY(userID) REFERENCES USER(id)
);

CREATE TABLE SERIES (
  id VARCHAR(6) PRIMARY KEY,
  seriesName VARCHAR(30),
  secure VARCHAR(6)
);

--CREATE SEQUENCE uID_seq;
--id INTEGER NOT NULL DEFAULT nextval('uID_sq')

CREATE TABLE SESH (
  id VARCHAR(6) PRIMARY KEY,--function needs to generate
  seriesID VARCHAR(6) ,
  sname VARCHAR(30),
  mood FLOAT,
  secure VARCHAR(6), -- security password or NULL
  userID INTEGER,
  ended BIT,
  FOREIGN KEY(seriesID) REFERENCES SERIES(id),
  FOREIGN KEY(userID) REFERENCES USER(id)
);

CREATE TABLE MOOD_DATE (
  sessionID VARCHAR(6),
  stamp DATETIME,
  mood FLOAT,
  FOREIGN KEY(sessionID) REFERENCES SESH(id)
);

CREATE TABLE ANSWER (
  qID INTEGER,
  sessionID VARCHAR(6),
  userID INTEGER,
  reaction INTEGER,--1,2 or 3 -- values 'sad', 'happy', 'bored' etc. 
  stamp DATETIME, -- time of reaction received (required for reaction-time diagram)
  anon BIT,
  context VARCHAR(256), -- context to feedback from the requirements
  FOREIGN KEY(qID) REFERENCES QUESTION(id),
  FOREIGN KEY(userID) REFERENCES USER(id),
  FOREIGN KEY(sessionID) REFERENCES SESH(id),
  PRIMARY KEY (qid, sessionID)
);

CREATE TABLE MODERATOR_SESSION (
  userID INTEGER,
  sessionID VARCHAR(6),
  FOREIGN KEY(userID) REFERENCES USER(id),
  FOREIGN KEY(sessionID) REFERENCES SESH(id)
);

CREATE TABLE ATTENDEE_SESSION (
  userID INTEGER,
  sessionID VARCHAR(6),
  FOREIGN KEY(userID) REFERENCES USER(id),
  FOREIGN KEY(sessionID) REFERENCES SESH(id)
);

CREATE TABLE QUESTION (
  id INTEGER,
  sessionID VARCHAR (6),
  question VARCHAR(100),
  pushed BIT,
  FOREIGN KEY(sessionID) REFERENCES SESH(id)
);

CREATE TABLE MESSAGES (
  sessionID VARCHAR(6),
  msg VARCHAR(1000),
  userID INTEGER,
  stamp DATETIME,
  anon BIT,
  FOREIGN KEY(sessionID) REFERENCES SESH(id),
  FOREIGN KEY(userID) REFERENCES USER(id)
);

CREATE TABLE SESSION_WORD (
  sessionID VARCHAR(6),
  word VARCHAR(10),
  mood FLOAT,
  num INTEGER,
  FOREIGN KEY(sessionID) REFERENCES SESH(id)
);